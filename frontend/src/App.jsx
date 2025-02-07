import { Routes, Route } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Navbar from './components/Navbar';
import Livesearch from './pages/Livesearch';
import Darknetfeed from './pages/Darknetfeed';
import IPnhash from './pages/IPnhash';
import RansomwarePost from './pages/RansomwarePost';
import CybersecurityNews from './pages/CybersecurityNews';

const Home = () => {
  return (
    <Box sx={{ 
      flex: '1 1 auto', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#2A2A2A', 
      color: '#E0E0E0' 
    }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: '#FF9800' }}>
        Welcome to the Threat Analysis Platform
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: '600px', textAlign: 'center' }}>
        Use the navigation above to explore different features of the platform.
      </Typography>
    </Box>
  );
};

const App = () => {
  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Navbar />
      <Box sx={{ 
        flex: '1 1 auto',
        overflow: 'auto',
        bgcolor: '#2A2A2A'
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/darknet-feed" element={<Darknetfeed />} />
          <Route path="/ip-hash" element={<IPnhash />} />
          <Route path="/live-search" element={<Livesearch />} />
          <Route path="/ransomware-post" element={<RansomwarePost />} />
          <Route path="/cybersecurity-news" element={<CybersecurityNews />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;