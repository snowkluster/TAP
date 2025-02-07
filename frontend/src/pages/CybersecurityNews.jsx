import { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, Link, CircularProgress, CardMedia } from '@mui/material';

const CybersecurityNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          'https://api.allorigins.win/raw?url=' + 
          encodeURIComponent('https://feeds.feedburner.com/TheHackersNews')
        );
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title')?.textContent || '',
          link: item.querySelector('link')?.textContent || '',
          description: item.querySelector('description')?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '',
          pubDate: item.querySelector('pubDate')?.textContent || '',
          author: item.querySelector('author')?.textContent?.replace('info@thehackernews.com', '').replace('(', '').replace(')', '').trim() || '',
          imageUrl: item.querySelector('enclosure')?.getAttribute('url') || null
        }));

        setNewsItems(items);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#2A2A2A'
      }}>
        <CircularProgress sx={{ color: '#FF9800' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#2A2A2A',
        color: '#FF9800'
      }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      flex: '1 1 auto', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      bgcolor: '#2A2A2A', 
      color: '#E0E0E0',
      p: 3,
      minHeight: '100vh'
    }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: '#FF9800' }}>
        Cybersecurity News
      </Typography>
      <List sx={{ width: '100%', maxWidth: 800 }}>
        {newsItems.map((item, index) => (
          <ListItem 
            key={index} 
            component="div"
            sx={{ 
              mb: 2, 
              bgcolor: '#1A1A1A', 
              borderRadius: 1,
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.1)' 
              },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              p: 2
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              {item.imageUrl && (
                <Box sx={{ width: 120, height: 120, flexShrink: 0 }}>
                  <CardMedia
                    component="img"
                    src={item.imageUrl} // Use the imageUrl from the RSS feed
                    alt={item.title}
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <Link 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  sx={{ 
                    color: '#FF9800', 
                    textDecoration: 'none', 
                    '&:hover': { textDecoration: 'underline' },
                    display: 'block',
                    mb: 1
                  }}
                >
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {item.title}
                  </Typography>
                </Link>
                <Box sx={{ mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    component="div" 
                    sx={{ 
                      color: '#9E9E9E', 
                      display: 'flex', 
                      gap: 2 
                    }}
                  >
                    <span>{new Date(item.pubDate).toLocaleDateString('en-US', { 
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                    {item.author && (
                      <span>by {item.author}</span>
                    )}
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  component="div"
                  sx={{ 
                    color: '#E0E0E0',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CybersecurityNews;