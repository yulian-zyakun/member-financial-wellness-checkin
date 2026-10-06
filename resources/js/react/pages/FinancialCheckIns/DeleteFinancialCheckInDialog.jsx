import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export default function DeleteFinancialCheckInDialog({
    open,
    onClose,
    onConfirm,
    checkIn,
    formatMonthYear,
    isDeleting,
}) {
    if (!checkIn) {
        return null;
    }
    return (
        <Dialog open={open} onClose={onClose}>
            {" "}
            <DialogTitle>Delete Check-In?</DialogTitle>{" "}
            <DialogContent>
                {" "}
                <DialogContentText>
                    {" "}
                    Are you sure you want to delete the check-in for{" "}
                    <strong> {formatMonthYear(checkIn.check_in_date)} </strong> ?{" "}
                </DialogContentText>{" "}
            </DialogContent>{" "}
            <DialogActions>
                {" "}
                <Button onClick={onClose} disabled={isDeleting}>
                    {" "}
                    Cancel{" "}
                </Button>{" "}
                <Button onClick={onConfirm} color="error" variant="contained" disabled={isDeleting}>
                    {" "}
                    {isDeleting ? "Deleting..." : "Delete"}{" "}
                </Button>{" "}
            </DialogActions>{" "}
        </Dialog>
    );
}
