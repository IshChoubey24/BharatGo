import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Rating,
  Stack,
  Chip,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  Security,
  Assignment,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Image as ImageIcon,
} from '@mui/icons-material';

// Fallback image URL - replace with your actual fallback image
const FALLBACK_IMAGE = 'https://via.placeholder.com/400x400?text=No+Image+Available';

export default function ProductCard({ product, onClose }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  const handleImageError = (imageUrl) => {
    setFailedImages(prev => new Set([...prev, imageUrl]));
  };

  const getValidImageUrl = (imageUrl) => {
    if (!imageUrl || failedImages.has(imageUrl) || !isValidImageUrl(imageUrl)) {
      return FALLBACK_IMAGE;
    }
    return imageUrl;
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

  // Validate and filter images array
  const validImages = React.useMemo(() => {
    const images = Array.isArray(product?.images) ? product.images : [];
    return images
      .filter(img => img && !failedImages.has(img) && isValidImageUrl(img))
      .map(img => getValidImageUrl(img));
  }, [product?.images, failedImages]);

  // Reset selected image if current selection is invalid
  React.useEffect(() => {
    if (selectedImage >= validImages.length) {
      setSelectedImage(0);
    }
  }, [validImages.length, selectedImage]);

  const handlePrevImage = () => {
    setSelectedImage((prev) => 
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => 
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };


  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // If no valid images, use fallback
  if (validImages.length === 0) {
    validImages.push(FALLBACK_IMAGE);
  }

  return (
    <>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            {product.title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Paper 
                elevation={0} 
                sx={{ 
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  aspectRatio: '1',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100'
                }}
              >
                <img
                  src={validImages[selectedImage]}
                  alt={product.title}
                  onError={() => handleImageError(validImages[selectedImage])}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    backgroundColor: 'rgb(245, 245, 245)',
                  }}
                />
                {validImages.length > 1 && (
                  <>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'background.paper' },
                      }}
                      onClick={handlePrevImage}
                    >
                      <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'background.paper' },
                      }}
                      onClick={handleNextImage}
                    >
                      <KeyboardArrowRight />
                    </IconButton>
                  </>
                )}
              </Paper>
              
              {/* Thumbnail Images */}
              {validImages.length > 1 && (
                <Stack 
                  direction="row" 
                  spacing={1} 
                  sx={{ 
                    overflowX: 'auto',
                    pb: 1,
                    '&::-webkit-scrollbar': { height: 6 },
                    '&::-webkit-scrollbar-thumb': { backgroundColor: 'grey.300', borderRadius: 3 }
                  }}
                >
                  {validImages.map((image, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 60,
                        height: 60,
                        flexShrink: 0,
                        cursor: 'pointer',
                        borderRadius: 1,
                        border: index === selectedImage ? 2 : 0,
                        borderColor: 'primary.main',
                        overflow: 'hidden',
                        bgcolor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        onError={() => handleImageError(image)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          backgroundColor: 'rgb(245, 245, 245)',
                        }}
                      />
                    </Paper>
                  ))}
                </Stack>
              )}
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* Price and Rating */}
              <Box>
                <Typography variant="h4" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
                  ₹{(product.price || 0).toLocaleString()}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={4} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    (128 reviews)
                  </Typography>
                </Stack>
              </Box>

              <Divider />

              {/* Category */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Category
                </Typography>
                <Chip 
                  label={product.category?.name || 'Uncategorized'} 
                  color="primary" 
                  variant="outlined" 
                  size="small"
                />
              </Box>

              {/* Description */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body2">
                  {product.description || 'No description available'}
                </Typography>
              </Box>

              {/* Features */}
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Key Features
                </Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ border: 'none', pl: 0, py: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocalShipping color="primary" fontSize="small" />
                          <Typography variant="body2">Free Delivery</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ border: 'none', py: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Security color="primary" fontSize="small" />
                          <Typography variant="body2">1 Year Warranty</Typography>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ border: 'none', pl: 0, py: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Assignment color="primary" fontSize="small" />
                          <Typography variant="body2">Easy Returns</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ border: 'none', py: 1 }}>
                        <Typography variant="body2" color="success.main">
                          In Stock
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <IconButton onClick={toggleFavorite} color={isFavorite ? 'primary' : 'default'}>
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<ShoppingCart />}
            
            sx={{ flexGrow: 1 }}
          >
            Add to Cart
          </Button>
        </Stack>
      </DialogActions>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success" 
          variant="filled"
        >
          Added to cart successfully!
        </Alert>
      </Snackbar>
    </>
  );
} 