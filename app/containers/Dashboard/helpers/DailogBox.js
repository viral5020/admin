import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React, { useEffect } from 'react'

const DailogBox = ({
    isOpen,
    handleClose,
    handleAction,
    title,
    line_1,
    line_2,
    Line_3,
    cancelBtnText = 'Cancel',
    actionBtnText = 'Okay',
    tone = 'primary'
}) => {

    return (
        <Dialog open={isOpen} onClose={handleClose} >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {line_1}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} sx={{ color: 'gray' }}>{cancelBtnText}</Button>
                <Button onClick={handleAction} color={tone} variant="contained">{actionBtnText}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DailogBox