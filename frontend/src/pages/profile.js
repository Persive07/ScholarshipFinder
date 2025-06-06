import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
  Alert,
  Stack,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Fade,
  Divider
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Delete,
  Person,
  Email,
  School,
  Grade,
  Assessment,
  AccountBalance,
  Cake,
  Wc,
  Interests,
  TuneRounded
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
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
const financialNeedOptions = ["Financial Need Required", "Financial Need not Required"];

// Styled components matching Browse and Recommended tabs
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

const StyledTextField = styled(TextField)(({ theme }) => ({
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

// Move ProfileField component OUTSIDE of the main component
const ProfileField = React.memo(({ icon, label, value, name, type = "text", options = null, required = false, isEditing, editedUser, handleChange, handleInterestsChange }) => (
  <Card elevation={2} sx={{ mb: 2, borderRadius: 3 }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>
          {icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
            {label}
          </Typography>
          {isEditing ? (
            options ? (
              <StyledFormControl fullWidth size="small">
                <Select
                  name={name}
                  value={editedUser[name] || ''}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select {label}</em>
                  </MenuItem>
                  {options.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </StyledFormControl>
            ) : (
              <StyledTextField
                fullWidth
                size="small"
                type={type}
                name={name}
                value={name === 'interests' ? (editedUser[name] || '') : (editedUser[name] || '')}
                onChange={name === 'interests' ? handleInterestsChange : handleChange}
                placeholder={
                  name === 'interests' 
                    ? "e.g., Robotics, ML, AI, Data Science" 
                    : `Enter ${label.toLowerCase()}`
                }
                helperText={name === 'interests' ? "Enter interests separated by commas" : ""}
                inputProps={
                  type === "number" 
                    ? { min: name === "grade_point_average" ? 0 : 0, 
                        max: name === "grade_point_average" ? 4 : 1600,
                        step: name === "grade_point_average" ? 0.01 : 1 }
                    : {}
                }
              />
            )
          ) : (
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {value || <em style={{ color: '#999' }}>Not specified</em>}
            </Typography>
          )}
        </Box>
      </Stack>
    </CardContent>
  </Card>
));

const Profile = ({ user, onLogout, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Helper to format interests array to string
  const formatInterests = React.useCallback((interests) => {
    if (Array.isArray(interests)) {
      return interests.join(', ');
    }
    return interests || '';
  }, []);

  const [editedUser, setEditedUser] = useState(() => ({ 
    ...user,
    interests: formatInterests(user.interests)
  }));

  // Update editedUser when user prop changes
  useEffect(() => {
    setEditedUser({
      ...user,
      interests: formatInterests(user.interests)
    });
  }, [user, formatInterests]);

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (["academic_major", "age", "gender", "financial_need"].includes(name) && value === "") {
      newValue = null;
    }

    if (["grade_point_average", "sat_score"].includes(name) && value === "") {
      newValue = null;
    }

    setEditedUser(prev => ({ ...prev, [name]: newValue }));
  }, []);

  // Special handler for interests input
  const handleInterestsChange = React.useCallback((e) => {
    setEditedUser(prev => ({ ...prev, interests: e.target.value }));
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updateData = {};
      Object.keys(editedUser).forEach(key => {
        if (key !== 'email' && key !== 'id' && key !== '_id' && key !== 'recommend') {
          if (key === "grade_point_average" && editedUser[key] !== undefined && editedUser[key] !== "") {
            updateData[key] = parseFloat(editedUser[key]);
          } else if (key === "sat_score" && editedUser[key] !== undefined && editedUser[key] !== "") {
            updateData[key] = parseInt(editedUser[key]);
          } else if (key === "interests" && editedUser[key] !== undefined && editedUser[key] !== "") {
            // Convert comma-separated string to array
            updateData[key] = editedUser[key].split(',').map(interest => interest.trim()).filter(interest => interest !== '');
          } else if (key === "password" && editedUser[key] === "") {
            // Don't send empty password
          } else if (editedUser[key] !== null && editedUser[key] !== undefined && editedUser[key] !== "") {
            updateData[key] = editedUser[key];
          }
        }
      });

      const response = await axios.put(
        `${apiBaseUrl}/users/${user._id || user.id}`,
        updateData
      );
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setError('');
      
      const updatedUserData = {
        ...response.data,
        interests: formatInterests(response.data.interests)
      };
      setEditedUser(updatedUserData);
      
      if (onUserUpdate) onUserUpdate(response.data);
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(e => e.msg || JSON.stringify(e)));
      } else if (typeof detail === 'object') {
        setError([detail.msg || JSON.stringify(detail)]);
      } else {
        setError(detail || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${apiBaseUrl}/users/${user._id || user.id}`);
      setSuccess('Profile deleted. Logging out...');
      setTimeout(() => {
        onLogout();
      }, 1200);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to delete profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = React.useCallback(() => {
    setIsEditing(false);
    setEditedUser({
      ...user,
      interests: formatInterests(user.interests)
    });
    setError('');
    setSuccess('');
  }, [user, formatInterests]);

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
            Your Profile
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Manage your account information and preferences
          </Typography>
        </CompactHeader>

        {/* Profile Header Card */}
        <FilterCard elevation={0}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              {/* Left side - Icon and title */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <TuneRounded sx={{ color: 'primary.main', fontSize: 28 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Profile Settings
                </Typography>
              </Stack>
              
              {/* Center - User Info */}
              <Stack alignItems="center" spacing={0.5}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: '2rem',
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    mb: 1
                  }}
                >
                  {user.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'primary.main'
                  }}
                >
                  {user.name}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary'
                  }}
                >
                  {user.email}
                </Typography>
              </Stack>

              {/* Right side - Action buttons */}
              <Stack direction="row" spacing={2}>
                {!isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      onClick={() => setIsEditing(true)}
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Delete />}
                      onClick={handleDelete}
                      disabled={loading}
                      color="error"
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      onClick={handleSave}
                      disabled={loading}
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)',
                        }
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      disabled={loading}
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>

            <Divider />

            {/* Profile Stats */}
            <Stack direction="row" spacing={2} justifyContent="center">
              {user.academic_major && (
                <Chip 
                  icon={<School />} 
                  label={user.academic_major} 
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
              {user.age && (
                <Chip 
                  icon={<Cake />} 
                  label={`Age ${user.age}`} 
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
              {user.interests && Array.isArray(user.interests) && user.interests.length > 0 && (
                <Chip 
                  icon={<Interests />} 
                  label={`${user.interests.length} interests`} 
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Stack>
          </Stack>
        </FilterCard>

        {/* Alerts */}
        {error && (
          <Fade in={!!error}>
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {Array.isArray(error) ? error.map((err, idx) => <div key={idx}>{err}</div>) : error}
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

        {/* Profile Fields */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.95)'
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'primary.main' }}>
            Profile Information
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ProfileField
                icon={<Person />}
                label="Full Name"
                value={user.name}
                name="name"
                required
                isEditing={isEditing}
                editedUser={editedUser}
                handleChange={handleChange}
                handleInterestsChange={handleInterestsChange}
              />
            </Grid>

            {isEditing && (
              <Grid item xs={12}>
                <ProfileField
                  icon={<Email />}
                  label="New Password"
                  value=""
                  name="password"
                  type="password"
                  isEditing={isEditing}
                  editedUser={editedUser}
                  handleChange={handleChange}
                  handleInterestsChange={handleInterestsChange}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <ProfileField
                icon={<School />}
                label="Academic Major"
                value={user.academic_major}
                name="academic_major"
                options={academicMajorOptions}
                isEditing={isEditing}
                editedUser={editedUser}
                handleChange={handleChange}
                handleInterestsChange={handleInterestsChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ProfileField
                icon={<Cake />}
                label="Age"
                value={user.age}
                name="age"
                options={ageOptions}
                isEditing={isEditing}
                editedUser={editedUser}
                handleChange={handleChange}
                handleInterestsChange={handleInterestsChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ProfileField
                icon={<Wc />}
                label="Gender"
                value={user.gender}
                name="gender"
                options={genderOptions}
                isEditing={isEditing}
                editedUser={editedUser}
                handleChange={handleChange}
                handleInterestsChange={handleInterestsChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ProfileField
                icon={<AccountBalance />}
                label="Financial Need"
                value={user.financial_need}
                name="financial_need"
                options={financialNeedOptions}
                isEditing={isEditing}
                editedUser={editedUser}
                handleChange={handleChange}
                handleInterestsChange={handleInterestsChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ProfileField
                icon={<Grade />}
                label="GPA"
                value={user.grade_point_average}
                name="grade_point_average"
                type="number"
                isEditing={isEditing}
                editedUser={editedUser}
                handleChange={handleChange}
                handleInterestsChange={handleInterestsChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <ProfileField
                icon={<Assessment />}
                label="SAT Score"
                value={user.sat_score}
                name="sat_score"
                type="number"
                isEditing={isEditing}
                editedUser={editedUser}
                handleChange={handleChange}
                handleInterestsChange={handleInterestsChange}
              />
            </Grid>

            {/* Interests Field */}
            <Grid item xs={12}>
              <ProfileField
                icon={<Interests />}
                label="Interests"
                value={formatInterests(user.interests)}
                name="interests"
                isEditing={isEditing}
                editedUser={editedUser}
                handleChange={handleChange}
                handleInterestsChange={handleInterestsChange}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
