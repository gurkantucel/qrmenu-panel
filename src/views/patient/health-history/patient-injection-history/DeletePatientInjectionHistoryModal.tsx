import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePatientInjectionHistoryMutation } from "reduxt/features/patient/injection-history-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientInjectionHistoryModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deletePatientInjectionHistory, { isLoading: deletePatientInjectionHistoryIsLoading, data: deletePatientInjectionHistoryResponse, error: deletePatientInjectionHistoryError }] = useDeletePatientInjectionHistoryMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deletePatientInjectionHistoryResponse) {
            enqueueSnackbar(deletePatientInjectionHistoryResponse.message, {
                variant: deletePatientInjectionHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deletePatientInjectionHistoryResponse?.status == true) {
                handleClose();
            }
        }
        if (deletePatientInjectionHistoryError) {
            var error = deletePatientInjectionHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deletePatientInjectionHistoryResponse, deletePatientInjectionHistoryError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePatientInjectionHistory} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deletePatientInjectionHistoryIsLoading}
                        onClick={() => {
                            deletePatientInjectionHistory({ patient_injection_history_id: data.patient_injection_history_id, patient_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deletePatientInjectionHistoryIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientInjectionHistoryModal