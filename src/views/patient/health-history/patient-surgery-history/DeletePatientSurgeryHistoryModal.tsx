import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePatientSurgeryHistoryMutation } from "reduxt/features/patient/surgery-history-api";

import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientSurgeryHistoryModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deletePatientSurgeryHistory, { isLoading: deletePatientSurgeryHistoryIsLoading, data: deletePatientSurgeryHistoryResponse, error: deletePatientSurgeryHistoryError }] = useDeletePatientSurgeryHistoryMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deletePatientSurgeryHistoryResponse) {
            enqueueSnackbar(deletePatientSurgeryHistoryResponse.message, {
                variant: deletePatientSurgeryHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deletePatientSurgeryHistoryResponse?.status == true) {
                handleClose();
            }
        }
        if (deletePatientSurgeryHistoryError) {
            var error = deletePatientSurgeryHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deletePatientSurgeryHistoryResponse, deletePatientSurgeryHistoryError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePatientSurgeryHistory} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deletePatientSurgeryHistoryIsLoading}
                        onClick={() => {
                            deletePatientSurgeryHistory({ patient_surgery_history_id: data.patient_surgery_history_id, patient_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deletePatientSurgeryHistoryIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientSurgeryHistoryModal