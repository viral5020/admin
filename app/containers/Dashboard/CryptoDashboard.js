import React, { useState } from 'react';
import brand from 'dan-api/dummy/brand';
import { Helmet } from 'react-helmet';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import useStyles from './dashboard-jss';
import StockTable from 'dan-components/Tables/StockTable';
import FilterComponent from './FilterComponent';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  DialogContent,
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'; // LHS icon
import ApexCharts from './Apexcharts';
import { useTheme } from '@mui/material/styles';

const generateCandleData = (name) => {
  const base = 1000 + Math.random() * 100;
  const data = Array.from({ length: 10 }, (_, i) => {
    const open = base + Math.random() * 10;
    const close = open + (Math.random() - 0.5) * 20;
    const high = Math.max(open, close) + Math.random() * 5;
    const low = Math.min(open, close) - Math.random() * 5;
    return {
      x: new Date(2025, 5, 20 + i),
      y: [open.toFixed(2), high.toFixed(2), low.toFixed(2), close.toFixed(2)],
    };
  });
  return data;
};


function CryptoDahboard() {
  const theme = useTheme();
  const title = brand.name + ' - Cryptocurrency Dashboard';
  const description = brand.desc;
  const { classes } = useStyles();
  const [searchText, setSearchText] = useState('');
  const [isStockOpen, setIsStockOpen] = useState();

  const sections = [
    { title: 'Nifty 50 Stocks', key: 'nifty' },
    { title: 'Banking Sector', key: 'banking' },
    { title: 'Commodities Market', key: 'commodities' },
    { title: 'Currency Derivatives', key: 'currency' }
  ];

  // Manage expanded state for all sections
  const [expanded, setExpanded] = useState(() => new Set(sections.map(s => s.key)));

  const toggleExpand = (key) => {
    setExpanded(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return newSet;
    });
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      {/* <MarketPlaceWIdget /> */}
      <FilterComponent searchText={searchText} setSearchText={setSearchText} />
      {/* <StockTable /> */}
      <Box>
        {sections.map((section, index) => (
          <Box key={section.key} mb={2}>
            <Accordion
              expanded={expanded.has(section.key)}
              onChange={() => toggleExpand(section.key)}
              disableGutters
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1}>
                  {/* <ArrowRightAltIcon fontSize="small" color="action" /> */}
                  <Typography variant="subtitle1" fontWeight="bold">
                    {section.title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <StockTable searchText={searchText} setIsStockOpen={setIsStockOpen} />
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
      </Box>




      <Dialog open={isStockOpen} onClose={() => setIsStockOpen(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">{isStockOpen?.scriptName}</Typography>
            <Chip label="NSE" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 'bold' }} />
          </Box>
          <Box>
            <Typography variant="h6" color="green" fontWeight="bold">
              ₹164.85 ▲ +4.80 (+3.00%)
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 2 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Button variant="contained" color="success">BUY</Button>
            <Button variant="contained" color="error">SELL</Button>
          </Box>

          {/* Placeholder empty space */}
          <Box
            sx={{
              height: 350,
              border: '1px dashed #ccc',
              borderRadius: 2,
              backgroundColor: '#f9f9f9'
            }}
          ><ApexCharts name={isStockOpen?.scriptName} data={generateCandleData()} theme={theme} /></Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsStockOpen(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CryptoDahboard;
