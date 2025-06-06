import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  Stack,
  InputAdornment,
  CircularProgress,
  Container,
  Fade,
  Divider
} from '@mui/material';
import {
  Email,
  Lock,
  School,
  Login as LoginIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
const apiBaseUrl = process.env.REACT_APP_API_URL;
// Styled components for enhanced customization
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
  padding: theme.spacing(5),
  borderRadius: theme.spacing(3),
  maxWidth: 450,
  width: '100%',
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    borderRadius: '12px 12px 0 0'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
    background: 'rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'rgba(255,255,255,0.9)',
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
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500
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

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${apiBaseUrl}/login`, formData);
      if (response.data && response.data.email) {
        onLogin(response.data);
      } else if (response.data && response.data.user) {
        onLogin(response.data.user);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Login failed. Please check your credentials and try again.'
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
                Welcome Back
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                Sign in to access your scholarship opportunities
              </Typography>
            </Stack>

            {/* Error Alert */}
            {error && (
              <Fade in={!!error}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    background: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.2)'
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <StyledTextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <StyledTextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />

                <GradientButton
                  type="submit"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                  sx={{ mt: 3 }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </GradientButton>
              </Stack>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary">
                New to Scholarship Finder?
              </Typography>
            </Divider>

            {/* Register Link */}
            <Stack alignItems="center">
              <Typography variant="body1" sx={{ textAlign: 'center' }}>
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#667eea', 
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1.1rem'
                  }}
                >
                  Create Account
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Join thousands of students finding their perfect scholarships
              </Typography>
            </Stack>
          </StyledPaper>
        </Fade>
      </Container>
    </GradientBox>
  );
};

export default Login;
