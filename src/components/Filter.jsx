import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Divider,
} from '@mui/material';

export default function Filter({ filters, onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [localPriceRange, setLocalPriceRange] = useState({
    min: filters.priceRange[0],
    max: filters.priceRange[1]
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api.escuelajs.co/api/v1/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    onFilterChange({ category: event.target.value });
  };

  const handleSortChange = (event) => {
    onFilterChange({ sortBy: event.target.value });
  };

  const handlePriceChange = (type) => (event) => {
    const value = event.target.value === '' ? '' : Number(event.target.value);
    setLocalPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handlePriceRangeApply = () => {
    const min = localPriceRange.min === '' ? 0 : localPriceRange.min;
    const max = localPriceRange.max === '' ? 100000 : localPriceRange.max;
    onFilterChange({ priceRange: [min, max] });
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
        Filters
      </Typography>

      <Stack spacing={3}>
        {/* Category Filter */}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label="Category"
            onChange={handleCategoryChange}
          >
            <MenuItem value="All">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Sort By Filter */}
        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="price_low">Price: Low to High</MenuItem>
            <MenuItem value="price_high">Price: High to Low</MenuItem>
          </Select>
        </FormControl>

        <Divider />

        {/* Price Range Filter */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Price Range
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="From"
              type="number"
              value={localPriceRange.min}
              onChange={handlePriceChange('min')}
              InputProps={{
                startAdornment: '₹',
              }}
              fullWidth
            />
            <TextField
              label="To"
              type="number"
              value={localPriceRange.max}
              onChange={handlePriceChange('max')}
              InputProps={{
                startAdornment: '₹',
              }}
              fullWidth
            />
            <Button 
              variant="contained" 
              onClick={handlePriceRangeApply}
              fullWidth
            >
              Apply Price Range
            </Button>
          </Stack>
        </Box>

        <Divider />

        {/* Reset Filters */}
        <Button 
          variant="outlined" 
          color="inherit"
          onClick={() => onFilterChange({
            category: 'All',
            sortBy: 'newest',
            priceRange: [0, 100000]
          })}
          fullWidth
        >
          Reset All Filters
        </Button>
      </Stack>
    </Paper>
  );
} 