# recommendation.py
from typing import List, Dict, Any
from datetime import datetime
import re
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

analyzer = SentimentIntensityAnalyzer()

async def generate_recommendations(user: Dict[str, Any], dal) -> List[Dict[str, Any]]:
    """Generate scholarship recommendations for a user with detailed logging."""
    try:
        #logger.info("Starting recommendation generation...")
        scholarships = await dal.fetch_all_scholarships(limit=1000)
        #logger.info(f"Fetched {len(scholarships)} scholarships for processing")

        scored_scholarships = []
        eligible_count = 0
        
        for idx, scholarship in enumerate(scholarships, 1):
            #logger.info(f"\nProcessing scholarship {idx}/{len(scholarships)}: {scholarship.get('title')}")
            
            # Eligibility Check
            is_eligible, reason = check_eligibility(user, scholarship)
            if not is_eligible:
                #logger.info(f"❌ Not eligible: {reason}")
                continue
            eligible_count += 1
            
            # Score Calculation
            grant_score = calculate_grant_score(scholarship)
            interest_score = calculate_interest_score(user, scholarship)
            sentiment_score = calculate_sentiment_score(scholarship)
            total_score = grant_score + interest_score + sentiment_score
            
            #logger.info(f"⭐ Scores - Grant: {grant_score:.2f}, Interest: {interest_score:.2f}, Sentiment: {sentiment_score:.2f}, Total: {total_score:.2f}")
            
            scored_scholarships.append((scholarship, total_score))

        #logger.info(f"Eligible scholarships: {eligible_count}/{len(scholarships)}")
        
        # Sorting and selection
        scored_scholarships.sort(key=lambda x: x[1], reverse=True)
        top_scholarships = [scholarship for scholarship, _ in scored_scholarships[:15]]
        
        #logger.info("Top 5 recommended scholarships:")
        for i, sch in enumerate(top_scholarships[:5], 1):
            #logger.info(f"{i}. {sch.get('title')} - Score: {scored_scholarships[i-1][1]:.2f}")
            ohh=1
        
        return top_scholarships
        
    except Exception as e:
        logger.error(f"Recommendation generation failed: {str(e)}", exc_info=True)
        return []

def check_eligibility(user: Dict[str, Any], scholarship: Dict[str, Any]) -> (bool, str):

    """Check if user is eligible for scholarship with detailed failure reasons."""
    #Deadline check
    if scholarship.get('due_date'):
        date_str = scholarship['due_date']
        try:
            # Handle "June 07, 2025" format
            deadline = datetime.strptime(date_str, "%B %d, %Y")
            if deadline < datetime.now():
                return False, f"Deadline has passed ({date_str})"
        except ValueError:
            #logger.error(f"⚠️ Invalid date format: '{date_str}'. Expected 'Month Day, Year' (e.g., 'June 07, 2025').")
            return False, "Invalid deadline format"


    # Field-specific checks
    checks = [
        ('academic_major', "Academic major mismatch"),
        ('age', "Age requirement not met"),
        ('financial_need', "Financial need mismatch"),
        ('gender', "Gender requirement not met")
    ]
    
    for field, reason in checks:
        sch_values = scholarship.get(field)
        user_value = user.get(field)
        
        if sch_values is not None and user_value is not None:
            if user_value not in sch_values:
                return False, reason

    # GPA check
    if scholarship.get('grade_point_average') and user.get('grade_point_average'):
        if not any(check_range(user['grade_point_average'], r) 
                  for r in scholarship['grade_point_average']):
            return False, "GPA requirement not met"

    # SAT check
    if scholarship.get('sat_score') and user.get('sat_score'):
        if not any(check_range(user['sat_score'], r) 
                  for r in scholarship['sat_score']):
            return False, "SAT score requirement not met"

    return True, "All eligibility criteria met"

def check_range(user_value: float, range_str: str) -> bool:
    """Check if user value falls within a range string."""
    numbers = re.findall(r"[\d.]+", range_str)
    if len(numbers) >= 2:
        lower = float(numbers[0])
        upper = float(numbers[1])
        return lower <= user_value <= upper
    logger.warning(f"Invalid range format: {range_str}")
    return False

def calculate_grant_score(scholarship: Dict[str, Any]) -> float:
    """Calculate score based on scholarship amount."""
    amount_str = scholarship.get('amount', '')
    numbers = re.findall(r"[\d,]+", amount_str)
    
    if not numbers:
        logger.debug("No valid amount found")
        return 0.0
    
    try:
        amounts = [float(num.replace(',', '')) for num in numbers]
        max_amount = max(amounts)
        score = max_amount / 10000  # Normalize
        logger.debug(f"Grant score: {score:.2f} (Amount: {max_amount})")
        return score
    except Exception as e:
        logger.warning(f"Error parsing amount '{amount_str}': {str(e)}")
        return 0.0

def calculate_interest_score(user: Dict[str, Any], scholarship: Dict[str, Any]) -> float:
    """Calculate score based on user interests in scholarship content."""
    if not user.get('interests'):
        logger.debug("No user interests to score")
        return 0.0
    
    # Combine all relevant text fields
    text_parts = [
        scholarship.get('description', ''),
        ' '.join(scholarship.get('details', [])),
        ' '.join(scholarship.get('eligibility_criteria', []))
    ]
    text = ' '.join(text_parts).lower()
    
    # Count matches for each interest
    score = 0
    for interest in user['interests']:
        interest_lower = interest.lower()
        if interest_lower in text:
            score += 1
            logger.debug(f"Interest match: '{interest}'")
    
    final_score = score * 50.0
    logger.debug(f"Interest score: {final_score:.2f} ({score} matches)")
    return final_score

def calculate_sentiment_score(scholarship: Dict[str, Any]) -> float:
    """Calculate score based on sentiment analysis of scholarship text."""
    text_parts = []
    for key in ['description', 'details', 'eligibility_criteria']:
        value = scholarship.get(key)
        if isinstance(value, list):
            text_parts.extend(value)
        elif value:
            text_parts.append(str(value))
    
    text = ' '.join(text_parts)
    if not text.strip():
        logger.debug("No text for sentiment analysis")
        return 0.0
    
    try:
        vs = analyzer.polarity_scores(text)
        score = (vs['compound'] + 1) * 50  # Scale to 0-100
        logger.debug(f"Sentiment score: {score:.2f} (Compound: {vs['compound']:.2f})")
        return score
    except Exception as e:
        logger.warning(f"Sentiment analysis failed: {str(e)}")
        return 0.0
