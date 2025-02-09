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
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/"
            onClick={handleTitleClick}
            sx={{ 
              flexGrow: 1, 
              color: '#FF9800',
              fontWeight: 'bold',
              textDecoration: 'none'
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