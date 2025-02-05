import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button, Box } from '@mui/material';

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
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 2 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleChange}
          sx={{
            marginBottom: 2,
            bgcolor: '#424242', // Darker background for input field
            '& .MuiInputBase-root': {
              color: '#fff', // White text color inside the search box
            },
            // Default border color
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#616161', // Default border color (gray)
            },
            // Hover state border color
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF9800', // Orange border on hover
            },
            // Focus state border color
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FF9800', // Orange border on focus
            },
            // Label color when not focused
            '& .MuiInputLabel-root': {
              color: '#fff', // White label text when not focused
            },
            // Placeholder text color
            '& .MuiInputBase-input::placeholder': {
              color: '#ffffff', // White placeholder text
            },
          }}
          placeholder="Search"
        />
        <Button
          type="submit"
          variant="contained"
          color="warning"
          fullWidth
          sx={{
            height: '100%',
            bgcolor: '#FF9800', // Button color
            '&:hover': {
              bgcolor: '#FB8C00', // Button hover effect
            }
          }}
        >
          Search
        </Button>
      </form>
    </Box>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
