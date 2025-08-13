import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

 const fetchLedgerDetails = async (userId) => {
    setLoadingLedger(true);
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    try {
      const payload = {
        is_app: '1',
        login_user_id: dataStored?.user_id,
        auth_key: dataStored?.auth_key,
        user_id: userId,
      };

      const response = await axios.post(
        'http://128.199.126.171/~goldorg/ajaxfiles/get_user_valan_wise_bill',
        payload
      );

      if (response.data.status === 'ok' && Array.isArray(response.data.data)) {
        const filtered = response.data.data.filter(item => item.valan_name !== 'Opening Balance');
        setLedgerDetails(response.data.data);
      } else {
        setLedgerDetails([]);
      }
    } catch (err) {
      console.error('Error fetching ledger details:', err);
      setLedgerDetails([]);
    } finally {
      setLoadingLedger(false);
    }
  };

const LedgerDetailsDialog = ({
  open,
  onClose,
  ledgerDetails = [],
  loading = false,
}) => {
  const handlePdfClick = (entry) => {
    const dataStored = JSON.parse(sessionStorage.getItem("data"));
    if (!dataStored) {
      alert("Session expired. Please log in again.");
      return;
    }

    const BASE_URL = "http://128.199.126.171/~goldorg/";
    const authKey = dataStored.auth_key;
    const loginUserId = dataStored.user_id;

    const filePath = entry.download;
    const fullUrl = filePath.startsWith("http")
      ? filePath
      : `${BASE_URL}${filePath}`;
    const url = new URL(fullUrl);

    url.searchParams.set("is", "1");
    url.searchParams.set("k", authKey);
    url.searchParams.set("lui", loginUserId);

    window.open(url.toString(), "_blank");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Ledger Details</DialogTitle>
      <DialogContent dividers>
  {loading ? (
    <Box sx={{ textAlign: "center", my: 4 }}>
      <CircularProgress />
    </Box>
  ) : ledgerDetails.length > 0 ? (
    <Box sx={{ overflowX: "auto", width: "100%" }}>
      <Table
        size="small"
        sx={{
          minWidth: 650, // ensures table has minimum width
          tableLayout: "auto", // let columns size naturally
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell><strong>Valan Name</strong></TableCell>
            <TableCell><strong>Date</strong></TableCell>
            <TableCell><strong>Debit</strong></TableCell>
            <TableCell><strong>Credit</strong></TableCell>
            <TableCell><strong>Balance</strong></TableCell>
            <TableCell><strong>PDF</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ledgerDetails.map((entry, idx) => {
            const isBuy = Number(entry.credit) > 0;
            const textColor = isBuy ? "#1976d2" : "#d32f2f";

            return (
              <TableRow key={idx}>
                <TableCell sx={{ fontWeight: 600 }}>{entry.valan_name}</TableCell>
                <TableCell sx={{ color: "#666" }}>{entry.date}</TableCell>
                <TableCell sx={{ color: !isBuy ? textColor : "inherit" }}>
                  {entry.debit !== "-"
                    ? `₹${Number(entry.debit).toLocaleString()}`
                    : "-"}
                </TableCell>
                <TableCell sx={{ color: isBuy ? textColor : "inherit" }}>
                  {entry.credit !== "-"
                    ? `₹${Number(entry.credit).toLocaleString()}`
                    : "-"}
                </TableCell>
                <TableCell>
                  ₹{Number(entry.balance).toLocaleString()}
                </TableCell>
                <TableCell>
                  {entry.download && entry.download.trim() !== "" ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePdfClick(entry);
                      }}
                      style={{
                        fontSize: "0.75rem",
                        color: "#1976d2",
                        fontWeight: 500,
                        textDecoration: "none",
                      }}
                    >
                      PDF
                    </a>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      --
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Box>
  ) : (
    <Typography variant="body2" color="text.secondary">
      No ledger data found.
    </Typography>
  )}
</DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LedgerDetailsDialog;





















// import React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Typography,
//   Grid,
//   Box,
//   CircularProgress,
//   Button,
// } from "@mui/material";

// const LedgerDetailsDialog = ({
//   open,
//   onClose,
//   ledgerDetails = [],
//   loading = false,
// }) => {
//   const handlePdfClick = (entry) => {
//     const dataStored = JSON.parse(sessionStorage.getItem("data"));
//     if (!dataStored) {
//       alert("Session expired. Please log in again.");
//       return;
//     }

//     const BASE_URL = "http://128.199.126.171/~goldorg/";
//     const authKey = dataStored.auth_key;
//     const loginUserId = dataStored.user_id;

//     const filePath = entry.download;
//     const fullUrl = filePath.startsWith("http")
//       ? filePath
//       : `${BASE_URL}${filePath}`;
//     const url = new URL(fullUrl);

//     url.searchParams.set("is", "1");
//     url.searchParams.set("k", authKey);
//     url.searchParams.set("lui", loginUserId);

//     window.open(url.toString(), "_blank");
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
//       <DialogTitle>Ledger Details</DialogTitle>
//       <DialogContent dividers sx={{ p: 0.5 }}>
//         {loading ? (
//           <Box sx={{ textAlign: "center", my: 4 }}>
//             <CircularProgress />
//           </Box>
//         ) : ledgerDetails.length > 0 ? (
//           <Grid container spacing={0.5}>
//             {ledgerDetails.map((entry, idx) => {
//               const isBuy = Number(entry.credit) > 0;
//               const borderColor = isBuy ? "#1976d2" : "#d32f2f";

//               return (
//                 <Grid item xs={12} md={6} key={idx}>
//                   <Box
//                     sx={{
//                       border: `2px solid ${borderColor}`,
//                       borderRadius: "8px",
//                       p: 1,
//                       backgroundColor: "#fff",
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: 0,
//                     }}
//                   >
//                     {/* Top Row */}
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                       }}
//                     >
//                       <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                         {entry.valan_name}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: "#999" }}>
//                         {entry.date}
//                       </Typography>
//                     </Box>

//                     {/* Bottom Row */}
//                     <Box
//                       sx={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "center",
//                         mt: 0.5,
//                       }}
//                     >
//                       <Typography variant="body2">
//                         {entry.debit !== "-"
//                           ? `₹${Number(entry.debit).toLocaleString()}`
//                           : "-"}
//                       </Typography>
//                       <Typography variant="body2">
//                         {entry.credit !== "-"
//                           ? `₹${Number(entry.credit).toLocaleString()}`
//                           : "-"}
//                       </Typography>
//                       <Typography variant="body2">
//                         ₹{Number(entry.balance).toLocaleString()}
//                       </Typography>
//                       {entry.download && entry.download.trim() !== "" ? (
//                         <a
//                           href="#"
//                           onClick={(e) => {
//                             e.preventDefault();
//                             handlePdfClick(entry);
//                           }}
//                           style={{
//                             fontSize: "0.75rem",
//                             color: "#1976d2",
//                             fontWeight: 500,
//                             textDecoration: "none",
//                           }}
//                         >
//                           PDF
//                         </a>
//                       ) : (
//                         <Typography
//                           variant="body2"
//                           color="text.secondary"
//                           sx={{ fontSize: "0.75rem" }}
//                         >
//                           No PDF
//                         </Typography>
//                       )}
//                     </Box>
//                   </Box>
//                 </Grid>
//               );
//             })}
//           </Grid>
//         ) : (
//           <Typography variant="body2" color="text.secondary">
//             No ledger data found.
//           </Typography>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default LedgerDetailsDialog;
