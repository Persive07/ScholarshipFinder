import React, { useState } from 'react';
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
  Container,
  Fade,
  Divider,
  Collapse,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  CalendarMonth, 
  School, 
  MonetizationOn, 
  Sort,
  Star,
  TrendingUp,
  AccessTime,
  Recommend,
  Launch,
  Info,
  CheckCircle,
  TuneRounded
} from '@mui/icons-material';
import { format } from 'date-fns';
import { styled } from '@mui/material/styles';
const apiBaseUrl = process.env.REACT_APP_API_URL;
// Styled components matching Browse tab
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

const sortOptions = [
  { value: 'amount', label: 'Highest Amount', icon: <TrendingUp /> },
  { value: 'deadline', label: 'Earliest Deadline', icon: <AccessTime /> },
  { value: 'title', label: 'Alphabetical', icon: <Sort /> }
];

const getAmountNumber = (amountStr) => {
  const match = amountStr?.replace(/,/g, '').match(/[\d.]+/g);
  return match ? parseFloat(match[0]) : 0;
};

const getAmount = (amountStr) => {
  const match = amountStr?.match(/\$?[\d,]+/);
  return match ? match[0] : 'Variable amount';
};

const Recommended = ({ user }) => {
  const scholarships = user?.recommend || [];
  const [sortBy, setSortBy] = useState('amount');
  const [expandedCard, setExpandedCard] = useState(null);

  const sortedScholarships = [...scholarships].sort((a, b) => {
    if (sortBy === 'amount') {
      return getAmountNumber(b.amount) - getAmountNumber(a.amount);
    }
    if (sortBy === 'deadline') {
      return new Date(a.due_date) - new Date(b.due_date);
    }
    if (sortBy === 'title') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return 0;
  });

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
            {/* Recommended Badge */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1
              }}
            >
              <Chip
                icon={<Star sx={{ fontSize: 18 }} />}
                label="Recommended"
                color="warning"
                variant="filled"
                size="small"
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #ff9800, #ffc107)',
                  color: 'white'
                }}
              />
            </Box>

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
                      pr: 8 // Space for recommended chip
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
                    label={getAmount(scholarship.amount)}
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        {/* Compact Header Section */}
        <CompactHeader>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
            Your Recommendations
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Personalized scholarship opportunities curated just for you
          </Typography>
        </CompactHeader>

        {/* Controls Section with Results Info Centered and Sort on Right */}
        <FilterCard elevation={0}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              {/* Left side - Icon and title */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <TuneRounded sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Sort & Filter
                </Typography>
              </Stack>
              
              {/* Center - Results Info */}
              <Stack alignItems="center" spacing={0.5}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'primary.main'
                  }}
                >
                  {scholarships.length} Recommendations Found
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary'
                  }}
                >
                  Personalized based on your profile and preferences
                </Typography>
              </Stack>

              {/* Right side - Sort option */}
              <Stack spacing={1} sx={{ minWidth: 250 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <Sort sx={{ mr: 1, color: 'primary.main' }} />
                  Sort By
                </Typography>
                <StyledFormControl fullWidth size="small">
                  <InputLabel>Sort Options</InputLabel>
                  <Select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort Options"
                  >
                    {sortOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {opt.icon}
                          <Typography>{opt.label}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </StyledFormControl>
              </Stack>
            </Stack>

            <Divider />
          </Stack>
        </FilterCard>

        {/* Scholarship Cards */}
        {sortedScholarships.length === 0 ? (
          <Paper
            elevation={2}
            sx={{
              p: 6,
              borderRadius: 4,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.9)'
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 3,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #ff9800, #ffc107)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Star sx={{ fontSize: 50, color: 'white' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
              No Recommendations Yet
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
              Complete your profile to get personalized scholarship recommendations
            </Typography>
            <Alert severity="info" sx={{ borderRadius: 2, maxWidth: 600, mx: 'auto' }}>
              Update your academic major, GPA, interests, and other profile details to receive tailored scholarship suggestions.
            </Alert>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {sortedScholarships.map((scholarship, index) => (
              <Grid item xs={12} key={scholarship.id || index}>
                <ScholarshipCardComponent scholarship={scholarship} index={index} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Recommended;
