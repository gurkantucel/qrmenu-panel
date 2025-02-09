import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeleteTenantPaymentMutation } from "reduxt/features/patient/tenant-payment-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientPaymentHistoryModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteTenantPayment, { isLoading: deleteTenantPaymentIsLoading, data: deleteTenantPaymentResponse, error: deleteTenantPaymentError }] = useDeleteTenantPaymentMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteTenantPaymentResponse) {
            enqueueSnackbar(deleteTenantPaymentResponse.message, {
                variant: deleteTenantPaymentResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteTenantPaymentResponse?.status == true) {
                handleClose();
            }
        }
        if (deleteTenantPaymentError) {
            var error = deleteTenantPaymentError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteTenantPaymentResponse, deleteTenantPaymentError])

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
                        disabled={deleteTenantPaymentIsLoading}
                        onClick={() => {
                            deleteTenantPayment({ payment_id: data.payment_id, patient_id: data.patient_id ?? 0 })
                        }} autoFocus={true} isLoading={deleteTenantPaymentIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientPaymentHistoryModal