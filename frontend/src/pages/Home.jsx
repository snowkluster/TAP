import { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [apiHealth, setApiHealth] = useState(false);

  const checkApiHealth = async () => {
    try {
      const response = await axios.get('http://localhost:9000/health');
      if (response.data.status === 'Alive') {
        setApiHealth(true);
      } else {
        setApiHealth(false);
      }
    } catch (error) {
      console.error('Error checking API health:', error);
      setApiHealth(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const response = await axios.get(`http://localhost:9000/search/${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCardContent = (match, tableName) => {
    const fields = {
      bianlian: {
        "company name": "Company Name",
        "post_date": "Post Date",
        "post url": "Post URL",
        "type": "Type"
      },
      breach: {
        "post_name": "Post Name",
        "post_author": "Author",
        "post_author_url": "Author URL",
        "post_link": "Post Link",
        "post_date": "Date",
        "views": "Views",
        "replies": "Replies",
        "type": "Type"
      },
      cicada3301: {
        "post_name": "Post Name",
        "web url": "Web URL",
        "size data": "Size Data",
        "publication date": "Publication Date",
        "description": "Description",
        "type": "Type"
      },
      cracked: {
        "post_name": "Post Name",
        "post_author": "Author",
        "post_author_url": "Author URL",
        "post_link": "Post Link",
        "post_date": "Date",
        "views": "Views",
        "replies": "Replies",
        "type": "Type"
      },
      darkvault: {
        "post_name": "Post Name",
        "time till post": "Time Till Post",
        "description": "Description",
        "post date": "Post Date",
        "type": "Type"
      },
      doxbin: {
        "ev0 (p0p, xyz)": "Title",
        "8": "ID",
        "234": "Number",
        "leafywashere[criminal]": "Author",
        "aug 19th, 2024": "Date",
        "https://doxbin.org/upload/ev0p0pxyz": "URL",
        "/user/leafywashere": "Author URL",
        "type": "Type"
      },
      onni: {
        "post_name": "Post Name",
        "post_author": "Author",
        "post_author_url": "Author URL",
        "post_link": "Post Link",
        "post_date": "Date",
        "views": "Views",
        "replies": "Replies",
        "type": "Type"
      },
      play: {
        "post_name": "Post Name",
        "location": "Location",
        "post_link": "Post Link",
        "views": "Views",
        "added": "Added",
        "publication date": "Publication Date",
        "type": "Type"
      },
      ransomhub: {
        "post_name": "Post Name",
        "visits": "Visits",
        "data_size": "Data Size",
        "last_view": "Last View",
        "post_date": "Post Date",
        "countdown_time": "Countdown Time",
        "type": "Type"
      }
    };

    const tableFields = fields[tableName.toLowerCase()] || {};

    return (
      <CardContent>
        {Object.entries(tableFields).map(([key, label]) => {
          if (match[key] !== undefined) {
            if (key.includes('url') || key.includes('link')) {
              return (
                <Typography key={key} variant="body2" sx={{ mt: 1 }}>
                  {label}: <a href={match[key]} target="_blank" rel="noopener noreferrer" style={{ color: '#FF9800' }}>
                    {match[key]}
                  </a>
                </Typography>
              );
            }
            return (
              <Typography key={key} variant="body2" sx={{ mt: 1 }}>
                {label}: {match[key]}
              </Typography>
            );
          }
          return null;
        })}
      </CardContent>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: searchResults.length > 0 ? 'flex-start' : 'center',
        bgcolor: '#2A2A2A',
        color: '#E0E0E0',
        height: '98%',
        overflow: 'hidden',
        width: '100%',
        pt: hasSearched ? 0 : 2,
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ color: '#B0B0B0' }}>
          API Status:
        </Typography>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: apiHealth ? '#4CAF50' : '#F44336',
          }}
        />
      </Box>

      {!hasSearched && (
        <>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mb: 1,
              fontWeight: 'bold',
              color: '#FF9800',
            }}
          >
            Threat Search
          </Typography>
          <Typography
            variant="body2"
            sx={{ maxWidth: '600px', textAlign: 'center', color: '#B0B0B0' }}
          >
            Search across multiple threat databases including Bianlian, Breach, Cicada3301, and more.
          </Typography>
        </>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          width: '100%',
          position: 'sticky',
          top: 0,
          bgcolor: '#2A2A2A',
          zIndex: 1000,
          py: 2,
          borderBottom: searchResults.length > 0 ? '1px solid #424242' : 'none',
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{
            backgroundColor: '#424242',
            borderRadius: '4px',
            marginRight: 0,
            width: '600px',
            height: '56px',
          }}
        />
        <IconButton
          onClick={handleSearch}
          sx={{
            backgroundColor: '#FF9800',
            borderRadius: '4px',
            color: '#fff',
            height: '56px',
            width: '56px',
            ml: 1,
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: '#FF9800' }} />
        </Box>
      )}

      {!isLoading && searchResults.length > 0 && (
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            width: '100%',
            px: 2,
            mt: 4,
          }}
        >
          <Grid container spacing={3}>
            {searchResults.map((table, index) => (
              <Grid item xs={12} key={index}>
                <Typography variant="h6" sx={{ color: '#FF9800', mb: 2, textTransform: 'capitalize' }}>
                  {table.table_name}
                </Typography>
                <Grid container spacing={2}>
                  {table.matches?.map((match, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                      <Card sx={{ 
                        backgroundColor: '#424242', 
                        color: '#E0E0E0',
                        height: '100%',
                        '&:hover': {
                          backgroundColor: '#4A4A4A',
                        }
                      }}>
                        {renderCardContent(match, table.table_name)}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {!isLoading && hasSearched && searchResults.length === 0 && (
        <Typography variant="body1" sx={{ mt: 4, color: '#B0B0B0' }}>
          No results found for &quot;{searchQuery}&quot;.
        </Typography>
      )}
    </Box>
  );
};

export default Home;