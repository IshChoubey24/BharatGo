import React, { useState, useEffect } from 'react';
import {
  Box,
    Grid,
    Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  IconButton,
  Skeleton,
  Alert,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Paper,
  Button,
  CardActions,
  Divider,
  Dialog,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  ViewModule,
  ViewList,
  ViewComfy,
  ShoppingCart,
  Visibility,
} from '@mui/icons-material';
import Filter from './Filter';
import ProductCard from './ProductCard';

const FALLBACK_IMAGE = 'https://via.placeholder.com/400x400?text=No+Image+Available';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [layout, setLayout] = useState('grid'); // 'grid', 'list', or 'compact'
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    sortBy: 'newest',
    priceRange: [0, 100000]
  });

  const handleLayoutChange = (event, newLayout) => {
    if (newLayout !== null) {
      setLayout(newLayout);
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleViewProduct = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
  };

  const handleCloseProductCard = () => {
    setSelectedProduct(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data.slice(5));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const getFilteredProducts = () => {
    return products.filter(product => {
      // Category filter
      if (filters.category !== 'All' && product.category?.name !== filters.category) {
        return false;
      }
      
      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort logic
      switch (filters.sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    // Check if URL is relative (starts with /)
    if (url.startsWith('/')) {
      return true;
    }
    // Check if URL is absolute and has a valid protocol
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  };

  const getValidImageUrl = (product) => {
    if (!Array.isArray(product.images) || product.images.length === 0) {
      return FALLBACK_IMAGE;
    }
    const validImage = product.images.find(img => isValidImageUrl(img));
    return validImage || FALLBACK_IMAGE;
  };

  const renderGridLayout = (product) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
      <Card 
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
          borderRadius: 2,
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={getValidImageUrl(product)}
          alt={product.title}
          sx={{ 
            objectFit: 'contain',
            bgcolor: 'grey.100',
            p: 2
          }}
        />
        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Stack direction="row" spacing={1} mb={1}>
            <Chip 
              label={product.category?.name || 'Uncategorized'}
              size="small"
              color="primary"
              sx={{ borderRadius: 1 }}
            />
          </Stack>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.title}
          </Typography>
          <Typography 
            color="text.secondary" 
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1,
            }}
          >
            {product.description}
          </Typography>
          <Typography 
            variant="h6" 
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            ₹{(product.price || 0).toLocaleString()}
          </Typography>
          <Rating value={4} readOnly size="small" sx={{ mt: 1 }} />
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
          <IconButton 
            size="small" 
            onClick={() => toggleFavorite(product.id)}
            color={favorites.includes(product.id) ? 'primary' : 'default'}
          >
            {favorites.includes(product.id) ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Stack direction="row" spacing={1}>
            <Button 
              size="small" 
              startIcon={<Visibility />}
              sx={{ borderRadius: 1 }}
              onClick={(e) => handleViewProduct(e, product)}
            >
              View
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<ShoppingCart />}
              sx={{ borderRadius: 1 }}
            >
              Add
            </Button>
          </Stack>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderListLayout = (product) => (
    <Grid item xs={12} key={product.id}>
      <Card 
        sx={{ 
          display: 'flex',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: 4,
          },
          borderRadius: 2,
        }}
      >
        <CardMedia
          component="img"
          sx={{ 
            width: 200, 
            objectFit: 'contain',
            bgcolor: 'grey.100',
            p: 2
          }}
          image={getValidImageUrl(product)}
          alt={product.title}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Stack direction="row" spacing={1} mb={1}>
              <Chip 
                label={product.category?.name || 'Uncategorized'}
                size="small"
                color="primary"
                sx={{ borderRadius: 1 }}
              />
              <Rating value={4} readOnly size="small" />
            </Stack>
            <Typography variant="h6" component="h2">
              {product.title}
            </Typography>
            <Typography 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 2,
              }}
            >
              {product.description}
            </Typography>
            <Typography 
              variant="h6" 
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              ₹{(product.price || 0).toLocaleString()}
            </Typography>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end', gap: 1, p: 2 }}>
            <IconButton 
              size="small"
              onClick={() => toggleFavorite(product.id)}
              color={favorites.includes(product.id) ? 'primary' : 'default'}
            >
              {favorites.includes(product.id) ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Button 
              size="small" 
              startIcon={<Visibility />}
              sx={{ borderRadius: 1 }}
              onClick={(e) => handleViewProduct(e, product)}
            >
              View
            </Button>
            <Button 
              variant="contained" 
              size="small" 
              startIcon={<ShoppingCart />}
              sx={{ borderRadius: 1 }}
            >
              Add to Cart
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Grid>
  );

  const renderCompactLayout = (product) => (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product.id}>
      <Card 
        sx={{ 
          height: '100%',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
          borderRadius: 2,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="160"
            image={getValidImageUrl(product)}
            alt={product.title}
            sx={{ 
              objectFit: 'contain',
              bgcolor: 'grey.100',
              p: 2
            }}
          />
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: 'background.paper' },
            }}
            size="small"
            onClick={() => toggleFavorite(product.id)}
            color={favorites.includes(product.id) ? 'primary' : 'default'}
          >
            {favorites.includes(product.id) ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>
        <CardContent sx={{ pt: 1, pb: 1 }}>
          <Typography 
            variant="subtitle1" 
            component="h2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              fontWeight: 500,
            }}
          >
            {product.title}
          </Typography>
          <Stack 
            direction="row" 
            alignItems="center" 
            justifyContent="space-between"
            spacing={1}
            sx={{ mt: 1 }}
          >
            <Typography 
              variant="subtitle1" 
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              ₹{(product.price || 0).toLocaleString()}
            </Typography>
            <Rating value={4} readOnly size="small" />
          </Stack>
        </CardContent>
        <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
          <Button 
            variant="contained" 
            fullWidth
            size="small" 
            startIcon={<ShoppingCart />}
            sx={{ borderRadius: 1 }}
          >
            Add to Cart
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={() => window.location.reload()}>
            Retry
          </Button>
        }
        sx={{ mt: 2 }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Paper 
        sx={{ 
          p: 2, 
          mb: 3, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 2,
        }}
        elevation={0}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Products ({getFilteredProducts().length})
        </Typography>
        <ToggleButtonGroup
          value={layout}
          exclusive
          onChange={handleLayoutChange}
          aria-label="layout"
          size="small"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <ViewModule />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewList />
          </ToggleButton>
          <ToggleButton value="compact" aria-label="compact view">
            <ViewComfy />
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Filter 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {getFilteredProducts().length === 0 ? (
              <Grid item xs={12}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'action.hover'
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    No products found matching your filters
                  </Typography>
                  <Button 
                    onClick={() => setFilters({
                      category: 'All',
                      sortBy: 'newest',
                      priceRange: [0, 100000]
                    })}
                    sx={{ mt: 2 }}
                  >
                    Reset Filters
                  </Button>
                </Paper>
              </Grid>
            ) : (
              getFilteredProducts().map(product => {
                switch (layout) {
                  case 'list':
                    return renderListLayout(product);
                  case 'compact':
                    return renderCompactLayout(product);
                  default:
                    return renderGridLayout(product);
                }
              })
            )}
          </Grid>
        </Grid>
      </Grid>

      {/* Product Details Dialog */}
      <Dialog
        open={Boolean(selectedProduct)}
        onClose={handleCloseProductCard}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <ProductCard 
            product={selectedProduct}
            onClose={handleCloseProductCard}
          />
        )}
      </Dialog>
    </Box>
  );
} 