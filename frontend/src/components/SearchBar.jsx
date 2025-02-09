import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <Box
      sx={{
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#2A2A2A',
        color: '#E0E0E0',
        padding: 4,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px', // Added gap between elements
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleChange}
          sx={{
            backgroundColor: '#424242',
            borderRadius: '4px',
            width: '600px',
            height: '56px',
            '& .MuiInputBase-root': {
              color: '#fff',
              height: '56px', // Explicitly set height to match IconButton
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#616161',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF9800',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF9800',
            },
            '& .MuiInputLabel-root': {
              color: '#fff',
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#ffffff',
              opacity: 0.7, // Made placeholder slightly more visible
            },
          }}
        />
        <IconButton
          type="submit"
          sx={{
            backgroundColor: '#FF9800',
            borderRadius: '4px',
            color: '#fff',
            height: '56px',
            width: '56px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transition: 'background-color 0.2s', // Added transition for hover effect
            '&:hover': {
              backgroundColor: '#F57C00', // Darker orange on hover
            },
          }}
        >
          <SearchIcon sx={{ fontSize: '24px' }} />
        </IconButton>
      </form>
    </Box>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;