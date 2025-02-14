import { Box, Typography, Container, Button, Card, CardContent, Grid2, CircularProgress, Snackbar, Alert, Tooltip } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FlagIcon from '@mui/icons-material/Flag';
import StorageIcon from '@mui/icons-material/Storage';
import CodeIcon from '@mui/icons-material/Code';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LabelIcon from '@mui/icons-material/Label';

const Darknetfeed = () => {
  const [data, setData] = useState([]); // No TypeScript interface, just an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false); // State for copied feedback

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://127.0.0.1:8008/');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError(null);
  };

  // Function to copy value to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  // Map keys to their corresponding icons
  const keyToIcon = {
    'IOC Name': <FingerprintIcon sx={{ fontSize: 16, mr: 1 }} />,
    'file_name': <FileIcon sx={{ fontSize: 16, mr: 1 }} />,
    'sha3_384_hash': <CodeIcon sx={{ fontSize: 16, mr: 1 }} />,
    'sha256_hash': <CodeIcon sx={{ fontSize: 16, mr: 1 }} />,
    'sha1_hash': <CodeIcon sx={{ fontSize: 16, mr: 1 }} />,
    'md5_hash': <CodeIcon sx={{ fontSize: 16, mr: 1 }} />,
    'first_seen': <CalendarTodayIcon sx={{ fontSize: 16, mr: 1 }} />,
    'origin_country': <FlagIcon sx={{ fontSize: 16, mr: 1 }} />,
    'file_size': <StorageIcon sx={{ fontSize: 16, mr: 1 }} />,
    'file_type_mime': <CodeIcon sx={{ fontSize: 16, mr: 1 }} />,
    'intelligence': <CloudDownloadIcon sx={{ fontSize: 16, mr: 1 }} />,
    'tags': <LabelIcon sx={{ fontSize: 16, mr: 1 }} />,
  };

  // Function to safely convert values to strings for the Tooltip title
  const getTooltipTitle = (value) => {
    if (value === null || value === undefined) {
      return ''; // Fallback for null/undefined
    }
    if (typeof value === 'object') {
      return JSON.stringify(value); // Convert objects to strings
    }
    return value.toString(); // Convert numbers, booleans, etc., to strings
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4, color: '#E0E0E0' }}>
        <Typography variant="h4" component="h1" sx={{ color: '#FF9800', mb: 3, textAlign: 'center' }}>
          Darknet Feed
        </Typography>
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            onClick={fetchData}
            disabled={loading}
            sx={{ 
              backgroundColor: '#FF9800',
              '&:hover': { backgroundColor: '#F57C00' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Refresh IOCs'}
          </Button>
        </Box>

        {/* Grid for Cards */}
        <Grid2 container spacing={3}>
          {data.map((ioc) => (
            <Grid2 item key={ioc.sha256_hash} size={{xs:12, sm:6, md:4, lg:3}}>
              <Card sx={{ backgroundColor: '#2C2C2C', color: '#E0E0E0', boxShadow: 3, borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)', boxShadow: 6 } }}>
                <CardContent>
                  {/* Display each key-value pair */}
                  {Object.entries(ioc).map(([key, value]) => (
                    <Box key={key} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      {keyToIcon[key] || <CodeIcon sx={{ fontSize: 16, mr: 1 }} />} {/* Default icon */}
                      <Tooltip title={getTooltipTitle(value)} placement="top" arrow>
                        <Typography
                          variant="body2"
                          sx={{ 
                            cursor: 'pointer',
                            color: '#FF9800',
                            '&:hover': { textDecoration: 'underline', color: '#FF5722' }
                          }}
                          onClick={() => copyToClipboard(value)}
                        >
                          <strong>{key}</strong>
                        </Typography>
                      </Tooltip>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>

        {/* Error Snackbar */}
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Copied Feedback Snackbar */}
        <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)}>
          <Alert severity="success" sx={{ width: '100%' }}>
            Copied to clipboard!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Darknetfeed;
