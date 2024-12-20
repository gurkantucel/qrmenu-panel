import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePatientTreatmentHistoryMutation } from "reduxt/features/patient/treatment-history-api";

import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientTreatmentHistoryModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deletePatientTreatmentHistory, { isLoading: deletePatientTreatmentHistoryIsLoading, data: deletePatientTreatmentHistoryResponse, error: deletePatientTreatmentHistoryError }] = useDeletePatientTreatmentHistoryMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deletePatientTreatmentHistoryResponse) {
            enqueueSnackbar(deletePatientTreatmentHistoryResponse.message, {
                variant: deletePatientTreatmentHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deletePatientTreatmentHistoryResponse?.status == true) {
                handleClose();
            }
        }
        if (deletePatientTreatmentHistoryError) {
            var error = deletePatientTreatmentHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deletePatientTreatmentHistoryResponse, deletePatientTreatmentHistoryError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePatientTreatmentHistory} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deletePatientTreatmentHistoryIsLoading}
                        onClick={() => {
                            deletePatientTreatmentHistory({ patient_treatment_history_id: data.patient_treatment_history_id, patient_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deletePatientTreatmentHistoryIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientTreatmentHistoryModal