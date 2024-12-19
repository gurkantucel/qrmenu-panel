import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePatientMedicineHistoryMutation, useLazyGetPatientMedicineHistoryListQuery } from "reduxt/features/patient/medicine-history-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientMedicineHistoryModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deletePatientMedicineHistory, { isLoading: deletePatientMedicineHistoryIsLoading, data: deletePatientMedicineHistoryResponse, error: deletePatientMedicineHistoryError }] = useDeletePatientMedicineHistoryMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    const [getPatientMedicineHistoryList] = useLazyGetPatientMedicineHistoryListQuery();

    useEffect(() => {
        if (deletePatientMedicineHistoryResponse) {
            enqueueSnackbar(deletePatientMedicineHistoryResponse.message, {
                variant: deletePatientMedicineHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deletePatientMedicineHistoryResponse?.status == true) {
                handleClose();
                getPatientMedicineHistoryList({ patient_id: id });
            }
        }
        if (deletePatientMedicineHistoryError) {
            var error = deletePatientMedicineHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deletePatientMedicineHistoryResponse, deletePatientMedicineHistoryError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePatientMedicineHistory} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deletePatientMedicineHistoryIsLoading}
                        onClick={() => {
                            deletePatientMedicineHistory({ patient_medicine_history_id: data.patient_medicine_history_id, patient_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deletePatientMedicineHistoryIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientMedicineHistoryModal