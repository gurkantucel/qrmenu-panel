import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePatientPaymentHistoryMutation } from "reduxt/features/patient/patient-payment-history-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientPaymentHistoryModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deletePatientPaymentHistory, { isLoading: deletePatientPaymentHistoryIsLoading, data: deletePatientPaymentHistoryResponse, error: deletePatientPaymentHistoryError }] = useDeletePatientPaymentHistoryMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deletePatientPaymentHistoryResponse) {
            enqueueSnackbar(deletePatientPaymentHistoryResponse.message, {
                variant: deletePatientPaymentHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deletePatientPaymentHistoryResponse?.status == true) {
                handleClose();
            }
        }
        if (deletePatientPaymentHistoryError) {
            var error = deletePatientPaymentHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deletePatientPaymentHistoryResponse, deletePatientPaymentHistoryError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePatientPaymentHistory} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {intl.formatMessage({ id: "deleteText" })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="info" onClick={handleClose}>
                        {intl.formatMessage({ id: "close" })}
                    </Button>
                    <CustomLoadingButton title={intl.formatMessage({ id: "delete" })}
                        disabled={deletePatientPaymentHistoryIsLoading}
                        onClick={() => {
                            deletePatientPaymentHistory({ patient_payment_history_id: data.patient_payment_history_id, patient_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deletePatientPaymentHistoryIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientPaymentHistoryModal