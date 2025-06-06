import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Stack,
  Paper,
  Checkbox,
  CircularProgress,
  Divider,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Container,
  Fade,
  TextField
} from '@mui/material';
import { 
  CalendarMonth, 
  School, 
  MonetizationOn, 
  FilterList, 
  Search,
  Clear,
  Launch,
  Info,
  CheckCircle,
  TuneRounded,
  AttachMoney,
  AccessTime,
  Person,
  Business,
  Grade,
  Assessment
} from '@mui/icons-material';
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';
const apiBaseUrl = process.env.REACT_APP_API_URL;
// Define enums as JS arrays
const AcademicMajor = [
  "Aerospace Technologies and Engineering", "Art", "Business Management", "Chemical Engineering",
  "Civil Engineering", "Communications", "Chemistry", "Biochemistry", "Computer Science",
  "Cybersecurity", "Dentistry", "Design", "Electrical Engineering", "Electronics", "Finance",
  "Humanities", "Mechanical Engineering", "Mathematics", "Medicine", "Statistics"
];

const AgeRange = [
  "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25",
  "26", "27", "28", "29", "30", "Age Greater than 30"
];

const GenderOptions = ["Male", "Female", "Other"];
const FinancialNeedOptions = ["Financial Need Required", "Financial Need not Required"];

// Styled components
const CompactHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(3),
  color: 'white',
  textAlign: 'center',
  marginBottom: theme.spacing(3)
}));

const FilterCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(3),
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(3)
}));

const ScholarshipCard = styled(Card)(({ theme, expanded }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(3),
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  border: '2px solid transparent',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2, #4caf50)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': { 
    boxShadow: expanded ? theme.shadows[16] : theme.shadows[8],
    transform: expanded ? 'scale(1.01)' : 'translateY(-4px)',
    borderColor: theme.palette.primary.light,
    '&::before': {
      opacity: expanded ? 1 : 0.7,
    }
  },
  ...(expanded && {
    boxShadow: theme.shadows[20],
    transform: 'scale(1.02)',
    zIndex: 10,
    borderColor: theme.palette.primary.main,
    '&::before': {
      opacity: 1,
    }
  })
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    background: 'rgba(255,255,255,0.9)',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(255,255,255,1)',
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      }
    },
    '&.Mui-focused': {
      background: 'rgba(255,255,255,1)',
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
      }
    }
  }
}));

const Browse = ({ user }) => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [filters, setFilters] = useState({
    academic_majors: [],
    age_ranges: [],
    genders: [],
    financial_needs: [],
    min_amount: '',
    max_amount: '',
    min_gpa: '',
    max_gpa: '',
    min_sat: '',
    max_sat: '',
    deadline_range: 'all'
  });
  const [sortBy, setSortBy] = useState('amount');
  const [visibleCount, setVisibleCount] = useState(20);

  // Add Enter key handler
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Trigger filter update by calling fetchScholarships directly
      fetchScholarships();
    }
  };

  const fetchScholarships = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.academic_majors.length)
        filters.academic_majors.forEach(m => params.append('academic_majors', m));
      if (filters.age_ranges.length)
        filters.age_ranges.forEach(a => params.append('age_ranges', a));
      if (filters.genders.length)
        filters.genders.forEach(g => params.append('genders', g));
      if (filters.financial_needs.length)
        filters.financial_needs.forEach(f => params.append('financial_needs', f));
      
      const response = await fetch(`${apiBaseUrl}/scholarships/search?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch scholarships');
      const data = await response.json();
      setScholarships(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [filters.academic_majors, filters.age_ranges, filters.genders, filters.financial_needs, filters.deadline_range]);

  const handleFilterChange = (filterType) => (event) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: event.target.value
    }));
  };

  const clearFilters = () => {
    setFilters({
      academic_majors: [],
      age_ranges: [],
      genders: [],
      financial_needs: [],
      min_amount: '',
      max_amount: '',
      min_gpa: '',
      max_gpa: '',
      min_sat: '',
      max_sat: '',
      deadline_range: 'all'
    });
  };

  const parseAmount = (amountStr) => {
    const match = amountStr?.match(/\$?([\d,]+)/);
    return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
  };

  const filterByAmount = (scholarship) => {
    if (!filters.min_amount && !filters.max_amount) return true;
    const amount = parseAmount(scholarship.amount);
    const min = filters.min_amount ? parseFloat(filters.min_amount) : 0;
    const max = filters.max_amount ? parseFloat(filters.max_amount) : Infinity;
    return amount >= min && amount <= max;
  };

  const filterByGPA = (scholarship) => {
    if (!filters.min_gpa && !filters.max_gpa) return true;
    if (!scholarship.grade_point_average) return true;
    
    const scholarshipGPA = Array.isArray(scholarship.grade_point_average) 
      ? Math.min(...scholarship.grade_point_average.map(range => parseFloat(range.split('-')[0]) || 0))
      : parseFloat(scholarship.grade_point_average) || 0;
    
    const min = filters.min_gpa ? parseFloat(filters.min_gpa) : 0;
    const max = filters.max_gpa ? parseFloat(filters.max_gpa) : 4;
    return scholarshipGPA >= min && scholarshipGPA <= max;
  };

  const filterBySAT = (scholarship) => {
    if (!filters.min_sat && !filters.max_sat) return true;
    if (!scholarship.sat_score) return true;
    
    const scholarshipSAT = Array.isArray(scholarship.sat_score) 
      ? Math.min(...scholarship.sat_score.map(range => parseInt(range.split('-')[0]) || 0))
      : parseInt(scholarship.sat_score) || 0;
    
    const min = filters.min_sat ? parseInt(filters.min_sat) : 0;
    const max = filters.max_sat ? parseInt(filters.max_sat) : 1600;
    return scholarshipSAT >= min && scholarshipSAT <= max;
  };

  const filterByDeadline = (scholarship) => {
    if (filters.deadline_range === 'all') return true;
    if (!scholarship.due_date) return false;
    
    const deadline = new Date(scholarship.due_date);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch (filters.deadline_range) {
      case 'week': return diffDays <= 7 && diffDays > 0;
      case 'month': return diffDays <= 30 && diffDays > 0;
      case 'quarter': return diffDays <= 90 && diffDays > 0;
      default: return true;
    }
  };
  
  const filteredScholarships = scholarships
    .filter(filterByAmount)
    .filter(filterByGPA)
    .filter(filterBySAT)
    .filter(filterByDeadline);

  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    if (sortBy === 'amount') {
      return parseAmount(b.amount) - parseAmount(a.amount);
    }
    if (sortBy === 'deadline') {
      return new Date(a.due_date) - new Date(b.due_date);
    }
    return (a.title || '').localeCompare(b.title || '');
  });

  const getActiveFilterCount = () => {
    return filters.academic_majors.length + filters.age_ranges.length + 
           filters.genders.length + filters.financial_needs.length +
           (filters.min_amount ? 1 : 0) + (filters.max_amount ? 1 : 0) +
           (filters.min_gpa ? 1 : 0) + (filters.max_gpa ? 1 : 0) +
           (filters.min_sat ? 1 : 0) + (filters.max_sat ? 1 : 0) +
           (filters.deadline_range !== 'all' ? 1 : 0);
  };

  const handleCardClick = (scholarshipId) => {
    setExpandedCard(expandedCard === scholarshipId ? null : scholarshipId);
  };

  const ScholarshipCardComponent = ({ scholarship, index }) => {
    const isExpanded = expandedCard === (scholarship.id || index);
    
    return (
      <Fade in={true} timeout={300 + index * 50}>
        <ScholarshipCard 
          elevation={isExpanded ? 12 : 3}
          expanded={isExpanded}
          onClick={() => handleCardClick(scholarship.id || index)}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Header with title and academic majors */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack spacing={1.5}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'primary.main',
                      fontSize: '1.2rem',
                      lineHeight: 1.3,
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {scholarship.title}
                  </Typography>
                  
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    {scholarship.academic_major?.slice(0, 2).map(major => (
                      <Chip
                        key={major}
                        label={major}
                        icon={<School sx={{ fontSize: 16 }} />}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          fontSize: '0.75rem', 
                          height: 28,
                          borderRadius: 2,
                          fontWeight: 600,
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': { 
                            backgroundColor: 'primary.light',
                            color: 'white'
                          }
                        }}
                      />
                    ))}
                    {scholarship.academic_major?.length > 2 && (
                      <Chip
                        label={`+${scholarship.academic_major.length - 2} more`}
                        size="small"
                        variant="filled"
                        color="secondary"
                        sx={{ fontSize: '0.75rem', height: 28, borderRadius: 2 }}
                      />
                    )}
                  </Stack>
                  
                  {!isExpanded && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {scholarship.description}
                    </Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>

            {/* Horizontal line with amount, deadline, and view details */}
            <Box sx={{ mt: 2 }}>
              <Stack 
                direction="row" 
                spacing={2} 
                alignItems="center" 
                justifyContent="space-between"
                sx={{ width: '100%' }}
              >
                {/* Amount and Deadline in horizontal line */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    icon={<MonetizationOn sx={{ fontSize: 20 }} />}
                    label={scholarship.amount || 'Variable Amount'}
                    color="success"
                    variant="filled"
                    sx={{ 
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      height: 32,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                      boxShadow: '0 2px 8px rgba(76,175,80,0.3)'
                    }}
                  />
                  
                  {scholarship.due_date && (
                    <Chip
                      icon={<CalendarMonth sx={{ fontSize: 18 }} />}
                      label={format(new Date(scholarship.due_date), 'MMM dd, yyyy')}
                      color={new Date(scholarship.due_date) < new Date() ? 'error' : 'info'}
                      variant="filled"
                      sx={{ 
                        fontSize: '0.8rem', 
                        height: 28,
                        borderRadius: 2,
                        fontWeight: 600
                      }}
                    />
                  )}
                </Stack>

                {/* View Details Button */}
                <Button
                  variant="text"
                  size="small"
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)'
                    }
                  }}
                >
                  {isExpanded ? 'Hide Details' : 'View Details'}
                </Button>
              </Stack>
            </Box>

            {/* Expanded Content */}
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Divider sx={{ my: 3, background: 'linear-gradient(90deg, transparent, #1976d2, transparent)' }} />
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                        <Info sx={{ mr: 1, fontSize: 22 }} />
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
                        {scholarship.description}
                      </Typography>
                    </Box>

                    {scholarship.details && scholarship.details.length > 0 && (
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
                          Additional Details
                        </Typography>
                        <List dense sx={{ bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2, p: 1 }}>
                          {scholarship.details.map((detail, idx) => (
                            <ListItem key={idx} sx={{ px: 2, py: 1 }}>
                              <ListItemText 
                                primary={detail}
                                primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  {scholarship.eligibility_criteria && scholarship.eligibility_criteria.length > 0 && (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <CheckCircle sx={{ mr: 1, fontSize: 22 }} />
                        Eligibility Requirements
                      </Typography>
                      <List dense sx={{ bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: 2, p: 1 }}>
                        {scholarship.eligibility_criteria.map((criteria, idx) => (
                          <ListItem key={idx} sx={{ px: 2, py: 1 }}>
                            <CheckCircle sx={{ mr: 1, fontSize: 16, color: 'success.main' }} />
                            <ListItemText 
                              primary={criteria}
                              primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      href={scholarship.link}
                      target="_blank"
                      startIcon={<Launch />}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        borderRadius: 4,
                        textTransform: 'none',
                        fontWeight: 700,
                        px: 6,
                        py: 2,
                        fontSize: '1.1rem',
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        boxShadow: '0 6px 20px rgba(25, 118, 210, .4)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(25, 118, 210, .5)'
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      Apply for This Scholarship
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Collapse>
          </CardContent>
        </ScholarshipCard>
      </Fade>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Stack alignItems="center" spacing={3}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>
            Loading scholarships...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3, fontSize: '1rem', p: 3 }}>
          <Typography variant="h6" gutterBottom>Oops! Something went wrong</Typography>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <CompactHeader>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            Browse Scholarships
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Discover opportunities tailored to your academic journey
          </Typography>
        </CompactHeader>

        <FilterCard elevation={0}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={2}>
                <TuneRounded sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Smart Filters
                </Typography>
                {getActiveFilterCount() > 0 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    ({getActiveFilterCount()} active)
                  </Typography>
                )}
              </Stack>
              
              {getActiveFilterCount() > 0 && (
                <Button
                  startIcon={<Clear />}
                  onClick={clearFilters}
                  variant="outlined"
                  color="error"
                  sx={{ 
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </Stack>

            <Divider />

            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <School sx={{ mr: 1, color: 'primary.main' }} />
                    Academic Major
                  </Typography>
                  <StyledFormControl fullWidth size="small">
                    <InputLabel>Select Majors</InputLabel>
                    <Select
                      multiple
                      value={filters.academic_majors}
                      onChange={handleFilterChange('academic_majors')}
                      renderValue={(selected) => 
                        selected.length > 0 ? `${selected.length} major${selected.length > 1 ? 's' : ''} selected` : 'Select majors'
                      }
                    >
                      {AcademicMajor.map(major => (
                        <MenuItem key={major} value={major}>
                          <Checkbox checked={filters.academic_majors.includes(major)} />
                          <Typography variant="body2">{major}</Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={2}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    Age Range
                  </Typography>
                  <StyledFormControl fullWidth size="small">
                    <InputLabel>Select Ages</InputLabel>
                    <Select
                      multiple
                      value={filters.age_ranges}
                      onChange={handleFilterChange('age_ranges')}
                      renderValue={(selected) => 
                        selected.length > 0 ? `${selected.length} selected` : 'Select ages'
                      }
                    >
                      {AgeRange.map(age => (
                        <MenuItem key={age} value={age}>
                          <Checkbox checked={filters.age_ranges.includes(age)} />
                          <Typography variant="body2">{age}</Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={2}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1, color: 'primary.main' }} />
                    Gender
                  </Typography>
                  <StyledFormControl fullWidth size="small">
                    <InputLabel>Select Gender</InputLabel>
                    <Select
                      multiple
                      value={filters.genders}
                      onChange={handleFilterChange('genders')}
                      renderValue={(selected) => 
                        selected.length > 0 ? `${selected.length} selected` : 'Any gender'
                      }
                    >
                      {GenderOptions.map(gender => (
                        <MenuItem key={gender} value={gender}>
                          <Checkbox checked={filters.genders.includes(gender)} />
                          <Typography variant="body2">{gender}</Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={2}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <Business sx={{ mr: 1, color: 'primary.main' }} />
                    Financial Need
                  </Typography>
                  <StyledFormControl fullWidth size="small">
                    <InputLabel>Select Need</InputLabel>
                    <Select
                      multiple
                      value={filters.financial_needs}
                      onChange={handleFilterChange('financial_needs')}
                      renderValue={(selected) => 
                        selected.length > 0 ? `${selected.length} selected` : 'Any need'
                      }
                    >
                      {FinancialNeedOptions.map(need => (
                        <MenuItem key={need} value={need}>
                          <Checkbox checked={filters.financial_needs.includes(need)} />
                          <Typography variant="body2">{need}</Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={3}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <AccessTime sx={{ mr: 1, color: 'primary.main' }} />
                    Deadline
                  </Typography>
                  <StyledFormControl fullWidth size="small">
                    <InputLabel>Select Range</InputLabel>
                    <Select
                      value={filters.deadline_range}
                      onChange={handleFilterChange('deadline_range')}
                    >
                      <MenuItem value="all">All Deadlines</MenuItem>
                      <MenuItem value="week">Within 1 Week</MenuItem>
                      <MenuItem value="month">Within 1 Month</MenuItem>
                      <MenuItem value="quarter">Within 3 Months</MenuItem>
                    </Select>
                  </StyledFormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={2}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <FilterList sx={{ mr: 1, color: 'primary.main' }} />
                    Sort By
                  </Typography>
                  <StyledFormControl fullWidth size="small">
                    <InputLabel>Sort Options</InputLabel>
                    <Select 
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="amount">💰 Highest Amount</MenuItem>
                      <MenuItem value="deadline">📅 Earliest Deadline</MenuItem>
                      <MenuItem value="title">📝 Alphabetical</MenuItem>
                    </Select>
                  </StyledFormControl>
                </Stack>
              </Grid>

              <Grid item xs={12} md={2}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <AttachMoney sx={{ mr: 1, color: 'primary.main' }} />
                    Amount Range
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      label="Min $"
                      type="number"
                      value={filters.min_amount}
                      onChange={(e) => setFilters(prev => ({ ...prev, min_amount: e.target.value }))}
                      onKeyPress={handleKeyPress}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Max $"
                      type="number"
                      value={filters.max_amount}
                      onChange={(e) => setFilters(prev => ({ ...prev, max_amount: e.target.value }))}
                      onKeyPress={handleKeyPress}
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} md={2}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <Grade sx={{ mr: 1, color: 'primary.main' }} />
                    GPA Range
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      label="Min GPA"
                      type="number"
                      inputProps={{ min: 0, max: 4, step: 0.1 }}
                      value={filters.min_gpa}
                      onChange={(e) => setFilters(prev => ({ ...prev, min_gpa: e.target.value }))}
                      onKeyPress={handleKeyPress}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Max GPA"
                      type="number"
                      inputProps={{ min: 0, max: 4, step: 0.1 }}
                      value={filters.max_gpa}
                      onChange={(e) => setFilters(prev => ({ ...prev, max_gpa: e.target.value }))}
                      onKeyPress={handleKeyPress}
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} md={2}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <Assessment sx={{ mr: 1, color: 'primary.main' }} />
                    SAT Score Range
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      size="small"
                      label="Min SAT"
                      type="number"
                      inputProps={{ min: 0, max: 1600, step: 10 }}
                      value={filters.min_sat}
                      onChange={(e) => setFilters(prev => ({ ...prev, min_sat: e.target.value }))}
                      onKeyPress={handleKeyPress}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      size="small"
                      label="Max SAT"
                      type="number"
                      inputProps={{ min: 0, max: 1600, step: 10 }}
                      value={filters.max_sat}
                      onChange={(e) => setFilters(prev => ({ ...prev, max_sat: e.target.value }))}
                      onKeyPress={handleKeyPress}
                      sx={{ flex: 1 }}
                    />
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </FilterCard>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.95)',
            textAlign: 'center'
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              mb: 1
            }}
          >
            {sortedScholarships.length} Scholarships Found
          </Typography>
          {getActiveFilterCount() > 0 && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary'
              }}
            >
              Filtered by {getActiveFilterCount()} criteria
            </Typography>
          )}
        </Paper>

        <Grid container spacing={2}>
          {sortedScholarships.slice(0, visibleCount).map((scholarship, index) => (
            <Grid item xs={12} key={scholarship.id || index}>
              <ScholarshipCardComponent scholarship={scholarship} index={index} />
            </Grid>
          ))}
        </Grid>

        {visibleCount < sortedScholarships.length && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setVisibleCount(prev => prev + 20)}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Load More Scholarships
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Browse;
