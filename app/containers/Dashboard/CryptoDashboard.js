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
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'; // LHS icon


function CryptoDahboard() {
  const title = brand.name + ' - Cryptocurrency Dashboard';
  const description = brand.desc;
  const { classes } = useStyles();
  const [searchText, setSearchText] = useState('');

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
      <FilterComponent searchText={searchText} setSearchText={setSearchText}/>
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
                <StockTable searchText={searchText} setSearchText={setSearchText} />
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
      </Box>
    </>
  );
}

export default CryptoDahboard;
