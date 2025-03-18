import { Card as MuiCard, CardContent, Typography, Box, Link } from '@mui/material';
import PropTypes from 'prop-types';

const Card = ({ title, url, author, date, views, replies, platform, sx }) => {
  return (
    <MuiCard 
      sx={{ 
        ...sx, 
        display: 'flex', 
        flexDirection: 'column', 
        height: 'auto', 
        minHeight: '350px', 
        padding: 2, 
        backgroundColor: '#1E1E1E', // Dark background for aesthetic
        color: 'white', // Light text color for contrast
        borderRadius: 1,
        boxShadow: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        width: '90%',
        '&:hover': {
          transform: 'scale(1.02)', // Subtle zoom effect on hover
          boxShadow: 6, // Elevate shadow on hover
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            mb: 1, 
            fontWeight: 'bold', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'normal', 
            color: '#FFB74D',
          }}
        >
          {title}
        </Typography>
      </CardContent>
      
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="gray">
          <strong>URL: </strong>
          <Link href={url} target="_blank" rel="noopener noreferrer" sx={{ color: '#81D4FA' }}>
            View Link
          </Link>
        </Typography>
        <Typography variant="body2" color="gray">
          <strong>Author: </strong>{author} 
        </Typography>
        <Typography variant="body2" color="gray">
          <strong>Date Added: </strong>{date}
        </Typography>
        <Typography variant="body2" color="gray">
          <strong>Views: </strong>{views} views
        </Typography>
        <Typography variant="body2" color="gray">
          <strong>Replies: </strong>{replies} replies
        </Typography>
        <Typography variant="body2" color="gray" sx={{ mt: 1 }}>
          <strong>Platform: </strong>{platform}
        </Typography>
      </Box>
    </MuiCard>
  );
};

// Prop validation using PropTypes
Card.propTypes = {
  author: PropTypes.string,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  views: PropTypes.number.isRequired,
  replies: PropTypes.number.isRequired,
  platform: PropTypes.string.isRequired,
  sx: PropTypes.object,
};

export default Card;
