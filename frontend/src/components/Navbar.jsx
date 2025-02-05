import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ 
      backgroundColor: '#1A1A1A', 
      boxShadow: 'none',
      borderBottom: '1px solid #333' 
    }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            color: '#FF9800',
            fontWeight: 'bold'
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;