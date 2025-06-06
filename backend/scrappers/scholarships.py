import os
import sys
import platform
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.safari.webdriver import WebDriver as SafariDriver
from selenium.common.exceptions import WebDriverException
from bs4 import BeautifulSoup
from pymongo import MongoClient
from dotenv import load_dotenv

# Load MongoDB URI from backend/.env
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BACKEND_DIR, ".env"))
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DATABASE_NAME", "scholarship_db")
COLLECTION_NAME = "scholarships"

# --- Field Enums (as strings for DB) ---
academic_majors = [
    "Aerospace Technologies and Engineering", "Art", "Business Management", "Chemical Engineering",
    "Civil Engineering", "Communications", "Chemistry", "Biochemistry", "Computer Science",
    "Cybersecurity", "Dentistry", "Design", "Electrical Engineering", "Electronics", "Finance",
    "Humanities", "Mechanical Engineering", "Mathematics", "Medicine", "Statistics"
]
age_ranges = [
    "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", 
    "26", "27", "28", "29", "30", "Age Greater than 30"
]
genders = ["Male", "Female", "Other"]
financial_needs = ["Financial Need not Required", "Financial Need Required"]
gpa_ranges = [
    "Minimum Grade Point Average From 1.0 To 2.0",
    "Minimum Grade Point Average From 2.1 To 2.5",
    "Minimum Grade Point Average From 2.6 To 3.0",
    "Minimum Grade Point Average From 3.1 To 3.5",
    "Minimum Grade Point Average From 3.6 To 4.0"
]
sat_ranges = [
    "SAT Scores From 400 To 1,000",
    "SAT Scores From 1,001 To 1,200",
    "SAT Scores From 1,201 To 1,400",
    "SAT Scores From 1,401 To 1,600"
]

urls = [ 
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/aerospace-technologies-and-engineering",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/art",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/business",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/chemical-engineering",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/civil-engineering",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/communications",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/chemistry",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/biochemistry",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/computer-science",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/cybersecurity",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/dentistry",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/design",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/electrical-engineering",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/electronics",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/finance",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/humanities",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/mechanical-engineering",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/mathematics",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/medicine",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/academic-major/statistics",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-13",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-14",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-15",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-16",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-17",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-18",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-19",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-20",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-21",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-22",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-23",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-24",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-25",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-26",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-27",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-28",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-29",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-30",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/age/age-greater-than-30",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/gender/male",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/gender/female",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/gender/other",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/financial-need/financial-need-not-required",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/financial-need/financial-need-required",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-1-0-to-2-0",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-2-1-to-2-5",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-2-6-to-3-0",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-3-1-to-3-5",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/grade-point-average/minimum-grade-point-average-from-3-6-to-4-0",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/sat-score/sat-scores-from-400-to-1000",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/sat-score/sat-scores-from-1001-to-1200",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/sat-score/sat-scores-from-1201-to-1400",
    "https://www.scholarships.com/financial-aid/college-scholarships/scholarship-directory/sat-score/sat-scores-from-1401-to-1600"
]

# --- Field mapping ---
field_map = (
    [('academic_major', academic_majors)] * len(academic_majors) +
    [('age', age_ranges)] * len(age_ranges) +
    [('gender', genders)] * len(genders) +
    [('financial_need', financial_needs)] * len(financial_needs) +
    [('grade_point_average', gpa_ranges)] * len(gpa_ranges) +
    [('sat_score', sat_ranges)] * len(sat_ranges)
)

# --- Browser Setup ---
def get_driver():
    browser = platform.system()
    if browser == "Darwin":
        try:
            return webdriver.Safari()
        except WebDriverException:
            print("Safari driver not available, trying Chrome...")
            chrome_options = ChromeOptions()
            chrome_options.add_argument("--headless")
            return webdriver.Chrome(options=chrome_options)
    else:
        chrome_options = ChromeOptions()
        chrome_options.add_argument("--headless")
        try:
            return webdriver.Chrome(options=chrome_options)
        except Exception as e:
            print("Chrome driver not found. Please ensure chromedriver is installed and in PATH.")
            sys.exit(1)

# --- MongoDB Setup ---
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

def extract_description(soup):
    header = soup.find('h2', string=lambda s: s and s.strip() == "Scholarship Description")
    if not header:
        return None
    next_div = header.find_next_sibling('div')
    if next_div:
        ps = next_div.find_all('p', recursive=False)
        return "\n".join(p.get_text(strip=True) for p in ps)
    return None

def extract_section(soup, header_text):
    header = soup.find('h2', string=lambda s: s and s.strip() == header_text)
    if not header:
        return None
    content = []
    next_elem = header.find_next_sibling()
    while next_elem:
        if next_elem.name == 'h2':
            break
        if next_elem.name == 'ul':
            items = [li.get_text(strip=True) for li in next_elem.find_all('li')]
            content.extend(items)
        next_elem = next_elem.find_next_sibling()
    return content if content else None

def upsert_scholarship(scholarship):
    # Separate list fields and scalar fields
    list_fields = {
        'academic_major', 'age', 'financial_need', 'gender',
        'grade_point_average', 'sat_score', 'eligibility_criteria', 'qualified_based_on'
    }
    
    set_data = {}
    add_to_set = {}
    
    for key, value in scholarship.items():
        if value is not None:
            if key in list_fields:
                if isinstance(value, list):
                    add_to_set[key] = {"$each": value}
                else:
                    add_to_set[key] = {"$each": [value]}
            else:
                set_data[key] = value
    
    update_operations = {}
    if set_data:
        update_operations["$set"] = set_data
    if add_to_set:
        update_operations["$addToSet"] = add_to_set
    
    collection.update_one(
        {"link": scholarship["link"]},
        update_operations,
        upsert=True
    )

def scrape_scholarships(url, field_name=None, field_value=None, max_count=25):
    driver = get_driver()
    driver.get(url)
    time.sleep(5)  # Let JS load for list page

    soup = BeautifulSoup(driver.page_source, "lxml")
    rows = soup.find_all('tr')
    count = 0
    
    for row in rows:
        if count >= max_count:
            break
        tds = row.find_all('td')
        if len(tds) >= 4:
            a_tag = tds[1].find('a')
            amount_label = tds[2].find('label')
            amount_span = tds[2].find('span')
            if a_tag and amount_label and "Amount" in amount_label.text:
                title = a_tag.text.strip()
                link = a_tag['href'].strip()
                full_link = "https://www.scholarships.com" + link
                amount = amount_span.text.strip() if amount_span else None
                due_date = tds[3].get_text(strip=True).replace("Due Date:", "").strip()
                
                # Scrape detailed page
                try:
                    driver.get(full_link)
                    time.sleep(3)  # Wait for detail page to load
                    detail_soup = BeautifulSoup(driver.page_source, "lxml")
                    
                    description = extract_description(detail_soup)
                    details = extract_section(detail_soup, "Scholarship Details")
                    eligibility = extract_section(detail_soup, "Eligibility Criteria")
                except Exception as e:
                    print(f"Error scraping details for {title}: {str(e)}")
                    description = details = eligibility = None

                scholarship = {
                    "title": title,
                    "link": full_link,
                    "amount": amount,
                    "due_date": due_date,
                    "description": description,
                    "details": details,
                    "eligibility_criteria": eligibility
                }
                
                if field_name and field_value:
                    scholarship[field_name] = [field_value]
                
                upsert_scholarship(scholarship)
                print(f"Saved: {title} | {field_name}: {field_value}")
                count += 1
                
                # Return to list page
                driver.back()
                time.sleep(2)  # Wait for list page to reload
    driver.quit()

def main():
    print("Starting Scholarship Scraper...")
    for idx, url in enumerate(urls):
        if idx < len(field_map):
            field_name, field_values = field_map[idx]
            # Determine the correct field value based on URL index
            if field_name == "academic_major":
                value = academic_majors[idx]
            elif field_name == "age":
                value = age_ranges[idx - len(academic_majors)]
            elif field_name == "gender":
                value = genders[idx - len(academic_majors) - len(age_ranges)]
            elif field_name == "financial_need":
                value = financial_needs[idx - len(academic_majors) - len(age_ranges) - len(genders)]
            elif field_name == "grade_point_average":
                value = gpa_ranges[idx - len(academic_majors) - len(age_ranges) - len(genders) - len(financial_needs)]
            elif field_name == "sat_score":
                value = sat_ranges[idx - len(academic_majors) - len(age_ranges) - len(genders) - len(financial_needs) - len(gpa_ranges)]
            else:
                value = None
            
            print(f"Scraping {url} with {field_name}={value}")
            scrape_scholarships(url, field_name, value)
        else:
            print(f"Scraping {url} with no extra field")
            scrape_scholarships(url)
    print("Scraping complete. Merged all scholarship attributes.")

if __name__ == "__main__":
    main()
