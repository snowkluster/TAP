import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText 
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const handleTitleClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.location.reload();
    }
    // If not on home page, let RouterLink handle the navigation naturally
  };

  const menuItems = [
    { text: 'Home', link: '/' },
    { text: 'Darknet Feed', link: '/darknet-feed' },
    { text: 'IP & Hash', link: '/ip-hash' },
    { text: 'Live Search', link: '/live-search' },
    { text: 'Admin Panel', link: 'http://dashboard.localhost', external: true },
    { text: 'Ransomware Post', link: '/ransomware-post' },
    { text: 'Cybersecurity News', link: '/cybersecurity-news' }
  ];

  return (
    <>
      <AppBar position="static" sx={{ 
        backgroundColor: '#1A1A1A', 
        boxShadow: 'none',
        borderBottom: '1px solid #333' 
      }}>
        <Toolbar>
          {/* SVG Logo wrapped with RouterLink */}
          <RouterLink to="/" onClick={handleTitleClick}>
            <Box
              component="svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 200"
              width="1.5em" // Match the height of the text
              height="1.5em" // Match the height of the text
              sx={{ 
                mr: 1, // Add some margin to the right
                verticalAlign: 'middle' // Align with the text
              }}
            >
              {/* Background shield */}
              <path d="M100 10 L180 50 L180 120 C180 160 140 190 100 190 C60 190 20 160 20 120 L20 50 Z" 
                    fill="#2C2C2C" 
                    stroke="#404040" 
                    strokeWidth="2"/>
              
              {/* Radar sweep animation */}
              <circle cx="100" cy="100" r="70" 
                      fill="none" 
                      stroke="#FF9800" 
                      strokeWidth="2">
                <animate attributeName="stroke-dasharray"
                         values="0,440;440,440"
                         dur="3s"
                         repeatCount="indefinite"/>
              </circle>
              
              {/* Center eye/lens */}
              <circle cx="100" cy="100" r="30" 
                      fill="#FF9800"/>
              <circle cx="100" cy="100" r="25" 
                      fill="#F57C00"/>
              
              {/* Digital dots */}
              <circle cx="145" cy="75" r="5" fill="#FF5722"/>
              <circle cx="55" cy="125" r="5" fill="#FF9800"/>
              <circle cx="130" cy="145" r="5" fill="#FFA726"/>
            </Box>
          </RouterLink>

          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/"
            onClick={handleTitleClick}
            sx={{ 
              flexGrow: 1, 
              color: '#FF9800',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-flex', // Use inline-flex to align SVG and text
              alignItems: 'center', // Vertically center the SVG and text
              lineHeight: '1.5em' // Match the SVG height
            }}
          >
            Threat Analysis Platform
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/"
              sx={{ 
                color: '#E0E0E0',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                }
              }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/darknet-feed"
              sx={{ 
                color: '#E0E0E0',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                }
              }}
            >
              Darknet Feed
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/ip-hash"
              sx={{ 
                color: '#E0E0E0',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                }
              }}
            >
              IP & Hash
            </Button>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/live-search"
              sx={{ 
                color: '#E0E0E0',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                }
              }}
            >
              Live Search
            </Button>
          </Box>
          <IconButton 
            edge="end" 
            color="inherit" 
            aria-label="menu" 
            onClick={() => toggleDrawer(true)}
            sx={{ ml: 'auto' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#1A1A1A',
            color: '#E0E0E0'
          }
        }}
      >
        <List sx={{ width: 250 }}>
          {menuItems.map((item, index) => (
            <ListItem 
              key={index} 
              component={item.external ? 'a' : RouterLink}
              href={item.external ? item.link : undefined}
              to={item.external ? undefined : item.link}
              onClick={() => toggleDrawer(false)}
              sx={{
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.1)' 
                },
                cursor: 'pointer'
              }}
            >
              <ListItemText primary={item.text} sx={{ color: '#E0E0E0' }} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;