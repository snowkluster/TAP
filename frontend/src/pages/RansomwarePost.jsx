import { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Grid,
  CircularProgress,
  Alert,
  Link
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const RansomwarePost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingCache, setIsUsingCache] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Try to get cached posts first
        const cachedPosts = localStorage.getItem('ransomwarePosts');
        const cachedTimestamp = localStorage.getItem('postsTimestamp');
        
        // Check if cache is less than 5 minutes old
        if (cachedPosts && cachedTimestamp) {
          const now = new Date().getTime();
          if (now - parseInt(cachedTimestamp) < 5 * 60 * 1000) {
            setPosts(JSON.parse(cachedPosts));
            setLoading(false);
            return;
          }
        }

        const response = await fetch('http://127.0.0.1:8009/scrape');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();

        localStorage.setItem('ransomwarePosts', JSON.stringify(data));
        localStorage.setItem('postsTimestamp', new Date().getTime().toString());
        
        setPosts(data);
        setIsUsingCache(false);
      } catch (err) {
        setError(err.message);
        const cachedPosts = localStorage.getItem('ransomwarePosts');
        if (cachedPosts) {
          setPosts(JSON.parse(cachedPosts));
          setIsUsingCache(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getGroupFromUrl = (url) => {
    const match = url.match(/id=([^&]+)/);
    return match ? match[1].toUpperCase() : 'Unknown Group';
  };

  const formatTitle = (title) => {
    return title
      .replace(/\\&lt;/g, '<')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&')
      .replace(/\\/g, ' | ');
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#2A2A2A'
      }}>
        <CircularProgress sx={{ color: '#FF9800' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      flex: '1 1 auto', 
      p: 3, 
      bgcolor: '#2A2A2A', 
      minHeight: '100vh'
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold', 
          color: '#FF9800',
          textAlign: 'center' 
        }}
      >
        Ransomware Posts
      </Typography>

      {error && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 2,
            bgcolor: '#332D24',
            color: '#FFB74D',
            '& .MuiAlert-icon': {
              color: '#FFB74D'
            }
          }}
        >
          {error} {isUsingCache ? '- Showing cached data' : ''}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        {posts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              bgcolor: '#1A1A1A', 
              color: '#E0E0E0',
              height: '100%',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }
            }}>
              <CardHeader
                sx={{
                  borderBottom: '1px solid #333',
                  '& .MuiCardHeader-content': { width: '100%' }
                }}
                title={
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                  }}>
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      {post.date}
                    </Typography>
                    <Link
                      href={post.group_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#FF9800',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#FFB74D'
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {getGroupFromUrl(post.group_url)}
                      </Typography>
                      <OpenInNewIcon sx={{ fontSize: 16 }} />
                    </Link>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                  {formatTitle(post.title)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RansomwarePost;