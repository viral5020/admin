import React, { useState } from 'react';
import { Paper, useMediaQuery, useTheme, Box } from '@mui/material';
import Addscriptfilter from './Utility/Addscriptfilter';
import Editscriptfilter from './Utility/Editscriptfilter';

const Editscript = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Filters
    const [market, setMarket] = useState('');
    const [script, setScript] = useState('');
    const [end1_date, setEnd1_date] = useState('');
    const [start1_date, setStart1_date] = useState('');
    const [is_updated, setIs_updated] = useState(false);
    const [is_deleted, setIs_deleted] = useState(false);
    const [valanId, setValanId] = useState(null);

    function onFilterApply() {
        // you can add API calls or filter logic here
    }

    return (
        <>
            {!isMobile ? (
                <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Editscriptfilter
                        market={market}
                        script={script}
                        setScript={setScript}
                        setMarket={setMarket}
                        valanId={valanId}
                        setValanId={setValanId}
                        setStart1_date={setStart1_date}
                        setEnd1_date={setEnd1_date}
                        start1_date={start1_date}
                        end1_date={end1_date}
                        is_deleted={is_deleted}
                        setIs_deleted={setIs_deleted}
                        is_updated={is_updated}
                        setIs_updated={setIs_updated}
                        onApply={onFilterApply}
                    />
                </Paper>
            ) : (
                <Box sx={{ p: 2 }}>
                    <Editscriptfilter
                        market={market}
                        script={script}
                        setScript={setScript}
                        setMarket={setMarket}
                        valanId={valanId}
                        setValanId={setValanId}
                        setStart1_date={setStart1_date}
                        setEnd1_date={setEnd1_date}
                        start1_date={start1_date}
                        end1_date={end1_date}
                        is_deleted={is_deleted}
                        setIs_deleted={setIs_deleted}
                        is_updated={is_updated}
                        setIs_updated={setIs_updated}
                        onApply={onFilterApply}
                    />
                </Box>
            )}
        </>
    );
};


export default Editscript