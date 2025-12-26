import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Paper, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Sending to the In-house CRM API via Nginx Proxy
      await axios.post('/crm/leads/', {
        ...formData,
        status: 'NEW'
      });
      setStatus({ type: 'success', message: 'Thank you! Our team will contact you shortly.' });
      setFormData({ company_name: '', contact_person: '', email: '', phone: '', notes: '' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to submit. Please try again or email support@hostamar.com' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom align="center" color="primary">
        Partner with Hostamar
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Get enterprise hosting and AI-driven asset management for your business.
      </Typography>

      {status.message && (
        <Alert severity={status.type} sx={{ mb: 3 }}>
          {status.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Company Name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Contact Person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Project Requirements (Optional)"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={<SendIcon />}
              sx={{ mt: 1 }}
            >
              {loading ? 'Submitting...' : 'Request Consultation'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
