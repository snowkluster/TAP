import { Box, Typography } from '@mui/material';

const RansomwarePost = () => {
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
        Ransomware Post
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: '600px', textAlign: 'center' }}>
        This is the Ransomware Post page.
      </Typography>
    </Box>
  );
};

export default RansomwarePost;