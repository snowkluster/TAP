import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid2, 
  CircularProgress, 
  Snackbar, 
  Alert 
} from '@mui/material';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';

const Livesearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSearch = async (searchTerm) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/search/?search_term=${searchTerm}`);
      const data = await response.json();
      if (data.successful) {
        const allResults = [
          ...(data.successful.nulled || []).map(item => ({ ...item, platform: 'Nulled' })),
          ...(data.successful.doxbin || []).map(item => ({ ...item, platform: 'Doxbin' })),
        ];
        setResults(allResults);
      } else {
        setError('No results found.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      setError('An error occurred while fetching the results.');
      setOpenSnackbar(true);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      height: '100%', 
      bgcolor: '#2A2A2A', 
      color: '#E0E0E0', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden' 
    }}>
      <Container maxWidth="xl" disableGutters sx={{ flex: '0 0 auto' }}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h3" component="h1" align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#FF9800' }}>
            Live Search
          </Typography>

          <SearchBar onSearch={handleSearch} />

          {loading && (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <CircularProgress sx={{ color: '#FF9800' }} />
            </Box>
          )}

          {error && !loading && (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Alert severity="error" sx={{ backgroundColor: '#D32F2F', color: '#fff' }}>{error}</Alert>
            </Box>
          )}
        </Box>
      </Container>

      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        // Hide scrollbar for Chrome, Safari and Opera
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        // Hide scrollbar for IE, Edge and Firefox
        '-ms-overflow-style': 'none',
        scrollbarWidth: 'none'
      }}>
        <Container maxWidth="xl" disableGutters>
          <Grid2 
            container 
            spacing={7} 
            sx={{ 
              mt: 1, 
              border: '2px solid #3C3C3C', // Add a border
              borderRadius: '8px', // Optional: rounded corners
              margin: '10px', // Adds some space around the border
              padding: '10px', // Adds some internal padding
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)' // Optional: subtle shadow
            }}
          >
            {results.map((item, index) => (
              <Grid2 item key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  title={item.text || item.Title}
                  url={item.url || item.Title_url}
                  date={item.date || item.Added}
                  views={item.views || item.Views}
                  replies={item.replies || item.Comments}
                  platform={item.platform}
                  sx={{
                    height: 'auto',
                    width: '100%',
                  }}
                />
              </Grid2>
            ))}
          </Grid2>
        </Container>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%', backgroundColor: '#D32F2F', color: '#fff' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Livesearch;