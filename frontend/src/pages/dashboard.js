import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Button,
  Avatar,
  Stack,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Recommend,
  Search,
  Person,
  Logout,
  School,
  Menu as MenuIcon,
  Close
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Recommended from './reco';
import Browse from './browse';
import Profile from './profile';

const apiBaseUrl = process.env.REACT_APP_API_URL;

// Styled components for enhanced customization
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255,255,255,0.1)'
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-indicator': {
    height: 4,
    borderRadius: 2,
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    boxShadow: '0 4px 12px rgba(254, 107, 139, 0.4)'
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    color: 'rgba(255,255,255,0.7)',
    minHeight: 64,
    '&.Mui-selected': {
      color: 'white',
      fontWeight: 700
    },
    '&:hover': {
      color: 'white',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: theme.spacing(1)
    },
    transition: 'all 0.2s ease'
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 3),
  borderRadius: theme.spacing(1),
  margin: theme.spacing(0, 0.5)
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #f44336 30%, #ff5722 90%)',
  color: 'white',
  fontWeight: 600,
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
  '&:hover': {
    background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 16px rgba(244, 67, 54, 0.4)'
  },
  transition: 'all 0.2s ease'
}));

const Dashboard = ({ user, onLogout, onUserUpdate }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const tabs = [
    { label: 'Recommended', icon: <Recommend />, component: 'recommended' },
    { label: 'Browse', icon: <Search />, component: 'browse' },
    { label: 'Profile', icon: <Person />, component: 'profile' }
  ];

  const renderContent = () => {
    switch (tabs[activeTab]?.component) {
      case 'recommended':
        return <Recommended user={user} />;
      case 'browse':
        return <Browse user={user} />;
      case 'profile':
        return <Profile user={user} onLogout={onLogout} onUserUpdate={onUserUpdate} />;
      default:
        return <Recommended user={user} />;
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setMobileMenuAnchor(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    onLogout();
    setMobileMenuAnchor(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      {/* App Bar */}
      <StyledAppBar position="sticky" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          {/* Logo Section */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                fontSize: '1.5rem'
              }}
            >
              <School />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
                Scholarship Finder
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Find your perfect opportunity
              </Typography>
            </Box>
          </Stack>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Stack direction="row" alignItems="center" spacing={3}>
              <StyledTabs
                value={activeTab}
                onChange={handleTabChange}
                variant="standard"
              >
                {tabs.map((tab, index) => (
                  <StyledTab
                    key={index}
                    icon={tab.icon}
                    label={tab.label}
                    iconPosition="start"
                  />
                ))}
              </StyledTabs>
              
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <LogoutButton
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  size="small"
                >
                  Logout
                </LogoutButton>
              </Stack>
            </Stack>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <IconButton
                color="inherit"
                onClick={handleMobileMenuOpen}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
            </Stack>
          )}
        </Toolbar>
      </StyledAppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 200,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }
        }}
      >
        {tabs.map((tab, index) => (
          <MenuItem
            key={index}
            onClick={() => handleTabChange(null, index)}
            selected={activeTab === index}
            sx={{
              py: 1.5,
              px: 3,
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              fontWeight: activeTab === index ? 700 : 500
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              {tab.icon}
              <Typography>{tab.label}</Typography>
            </Stack>
          </MenuItem>
        ))}
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 3,
            borderRadius: 2,
            mx: 1,
            my: 0.5,
            color: 'error.main',
            fontWeight: 600
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Logout />
            <Typography>Logout</Typography>
          </Stack>
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
