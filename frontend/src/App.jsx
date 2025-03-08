import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Livesearch from './pages/Livesearch';
import Darknetfeed from './pages/Darknetfeed';
import IPnhash from './pages/IPnhash';
import RansomwarePost from './pages/RansomwarePost';
import CybersecurityNews from './pages/CybersecurityNews';
import Home from './pages/Home';
import UnderConstruction from './pages/UnderConstruction';

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
          <Route path="/" element={<UnderConstruction />} />
          <Route path="/darknet-feed" element={<Darknetfeed />} />
          <Route path="/ip-hash" element={<IPnhash />} />
          <Route path="/live-search" element={<Livesearch />} />
          <Route path="/ransomware-post" element={<UnderConstruction />} />
          <Route path="/cybersecurity-news" element={<CybersecurityNews />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;