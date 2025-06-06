import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  Avatar,
  Stack,
  InputAdornment,
  CircularProgress,
  Container,
  Fade
} from '@mui/material';
import {
  Person,
  Email,
  Lock,
  School,
  Cake,
  Wc,
  AccountBalance,
  Grade,
  Assessment,
  Interests
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
const apiBaseUrl = process.env.REACT_APP_API_URL;
const academicMajorOptions = [
  "Aerospace Technologies and Engineering", "Art", "Business Management", "Chemical Engineering",
  "Civil Engineering", "Communications", "Chemistry", "Biochemistry", "Computer Science",
  "Cybersecurity", "Dentistry", "Design", "Electrical Engineering", "Electronics", "Finance",
  "Humanities", "Mechanical Engineering", "Mathematics", "Medicine", "Statistics"
];

const ageOptions = [
  "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25",
  "26", "27", "28", "29", "30", "Age Greater than 30"
];

const genderOptions = ["Male", "Female", "Other"];
const financialNeedOptions = [
  "Financial Need Required",
  "Financial Need not Required"
];

// Styled components
const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    animation: 'float 8s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
    '50%': { transform: 'translateY(-30px) rotate(180deg)' },
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  maxWidth: 600,
  width: '100%',
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    background: 'rgba(255,255,255,0.8)',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    }
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    background: 'rgba(255,255,255,0.8)',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    }
  }
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 700,
  textTransform: 'none',
  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
  '&:hover': {
    background: 'linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.5)'
  },
  '&:disabled': {
    background: 'linear-gradient(45deg, #a0aec0 30%, #cbd5e0 90%)',
    transform: 'none',
    boxShadow: 'none'
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
}));

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    academic_major: '',
    age: '',
    gender: '',
    financial_need: '',
    grade_point_average: '',
    sat_score: '',
    interests: '' // Added interests field
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const payload = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '') {
        if (key === "grade_point_average") {
          payload[key] = parseFloat(formData[key]);
        } else if (key === "sat_score") {
          payload[key] = parseInt(formData[key]);
        } else if (key === "interests") {
          // Convert comma-separated string to array and filter empty values
          payload[key] = formData[key]
            .split(',')
            .map(interest => interest.trim())
            .filter(interest => interest !== '');
        } else {
          payload[key] = formData[key];
        }
      }
    });

    try {
      const response = await axios.post(`${apiBaseUrl}/register`, payload);
      if (response.data && response.data.email) {
        setSuccess('Registration successful! Logging you in...');
        const loginResponse = await axios.post(`${apiBaseUrl}/login`, {
          email: payload.email,
          password: payload.password
        });
        if (loginResponse.data && (loginResponse.data.email || loginResponse.data.user)) {
          onRegister(loginResponse.data.email ? loginResponse.data : loginResponse.data.user);
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBox>
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <StyledPaper elevation={0}>
            {/* Header */}
            <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                  fontSize: '2rem'
                }}
              >
                <School sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                Join Scholarship Finder
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Create your account to discover personalized scholarship opportunities
              </Typography>
            </Stack>

            {/* Alerts */}
            {error && (
              <Fade in={!!error}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {success && (
              <Fade in={!!success}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  {success}
                </Alert>
              </Fade>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Academic Information */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main', mt: 2 }}>
                    Academic Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledFormControl fullWidth>
                    <InputLabel>Academic Major</InputLabel>
                    <Select
                      name="academic_major"
                      value={formData.academic_major}
                      onChange={handleChange}
                      label="Academic Major"
                      startAdornment={
                        <InputAdornment position="start">
                          <School color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Select Academic Major</em>
                      </MenuItem>
                      {academicMajorOptions.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledFormControl fullWidth>
                    <InputLabel>Age</InputLabel>
                    <Select
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      label="Age"
                      startAdornment={
                        <InputAdornment position="start">
                          <Cake color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Select Age</em>
                      </MenuItem>
                      {ageOptions.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledFormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      label="Gender"
                      startAdornment={
                        <InputAdornment position="start">
                          <Wc color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Select Gender</em>
                      </MenuItem>
                      {genderOptions.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledFormControl fullWidth>
                    <InputLabel>Financial Need</InputLabel>
                    <Select
                      name="financial_need"
                      value={formData.financial_need}
                      onChange={handleChange}
                      label="Financial Need"
                      startAdornment={
                        <InputAdornment position="start">
                          <AccountBalance color="primary" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Select Financial Need</em>
                      </MenuItem>
                      {financialNeedOptions.map(option => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </StyledFormControl>
                </Grid>

                {/* Interests Field */}
                <Grid item xs={12}>
                  <StyledTextField
                    fullWidth
                    label="Interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    placeholder="e.g., Robotics, ML, AI, Data Science, Engineering"
                    helperText="Enter your interests separated by commas"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Interests color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Academic Scores */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main', mt: 2 }}>
                    Academic Scores (Optional)
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="GPA"
                    name="grade_point_average"
                    type="number"
                    value={formData.grade_point_average}
                    onChange={handleChange}
                    inputProps={{ min: 0, max: 4, step: 0.01 }}
                    helperText="Scale: 0.0 - 4.0"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Grade color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <StyledTextField
                    fullWidth
                    label="SAT Score"
                    name="sat_score"
                    type="number"
                    value={formData.sat_score}
                    onChange={handleChange}
                    inputProps={{ min: 0, max: 1600, step: 1 }}
                    helperText="Scale: 0 - 1600"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Assessment color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <GradientButton
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={{ mt: 3 }}
                  >
                    {loading ? (
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <CircularProgress size={24} color="inherit" />
                        <Typography>Creating Account...</Typography>
                      </Stack>
                    ) : (
                      'Create Account'
                    )}
                  </GradientButton>
                </Grid>

                {/* Login Link */}
                <Grid item xs={12}>
                  <Typography variant="body1" sx={{ textAlign: 'center', mt: 2 }}>
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      style={{ 
                        color: '#667eea', 
                        textDecoration: 'none',
                        fontWeight: 600
                      }}
                    >
                      Login here
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </StyledPaper>
        </Fade>
      </Container>
    </GradientBox>
  );
};

export default Register;
