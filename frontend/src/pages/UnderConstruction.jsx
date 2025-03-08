import { Box, Typography, Container, CircularProgress } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';

const UnderConstruction = () => {
  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        padding: 2,
        height: '93vh',
        paddingTop: 2,
        paddingBottom: 2,
        px: 0,
        border: 'none',
        overflow: 'hidden',
        backgroundColor: '#1E1E1E',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#E0E0E0',
        }}
      >
        <ConstructionIcon sx={{ fontSize: 100, color: '#FF9800', mb: 4 }} />
        
        <Typography variant="h2" component="h1" align="center" sx={{ mb: 3, fontWeight: 'bold', color: '#FF9800' }}>
          Under Construction
        </Typography>
        
        <Typography 
          variant="h5"
          sx={{ maxWidth: '600px', textAlign: 'center', color: '#B0B0B0', mb: 4 }}
        >
          This feature is currently being built and will be available soon
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress sx={{ color: '#FF9800' }} />
          <Typography variant="body1" sx={{ color: '#E0E0E0' }}>
            We&apos;re working on it...
          </Typography>
        </Box>

        <Box 
          sx={{ 
            mt: 8, 
            p: 3, 
            borderRadius: 2, 
            backgroundColor: '#2C2C2C',
            maxWidth: '600px'
          }}
        >
          <Typography variant="body2" sx={{ color: '#B0B0B0', textAlign: 'center' }}>
            Check back later for our new tools and features. This page will provide advanced security analysis capabilities similar to our IP and Hash reputation checkers.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default UnderConstruction;