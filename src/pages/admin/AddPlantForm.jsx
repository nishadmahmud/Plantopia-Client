import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';

const AddPlantForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    description: '',
    careInstructions: '',
    wateringFrequency: '',
    sunlightRequirements: '',
    imageUrl: ''
  });

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setNotification({
          open: true,
          message: 'Plant added successfully!',
          severity: 'success'
        });
        setFormData({
          name: '',
          scientificName: '',
          description: '',
          careInstructions: '',
          wateringFrequency: '',
          sunlightRequirements: '',
          imageUrl: ''
        });
      } else {
        throw new Error('Failed to add plant');
      }
    } catch (error) {
      setNotification({
        open: true,
        message: 'Failed to add plant. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <Paper elevation={3}>
      <Box p={4}>
        <Typography variant="h5" gutterBottom>
          Add New Plant
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Plant Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Scientific Name"
                name="scientificName"
                value={formData.scientificName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Care Instructions"
                name="careInstructions"
                value={formData.careInstructions}
                onChange={handleChange}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Watering Frequency"
                name="wateringFrequency"
                value={formData.wateringFrequency}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sunlight Requirements"
                name="sunlightRequirements"
                value={formData.sunlightRequirements}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                Add Plant
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AddPlantForm; 