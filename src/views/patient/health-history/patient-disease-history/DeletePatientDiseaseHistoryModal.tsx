import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePatientDiseaseHistoryMutation, useLazyGetPatientDiseaseHistoryListQuery } from "reduxt/features/patient/disease-history-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientDiseaseHistoryModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deletePatientDiseaseHistory, { isLoading: deletePatientDiseaseHistoryIsLoading, data: deletePatientDiseaseHistoryResponse, error: deletePatientDiseaseHistoryError }] = useDeletePatientDiseaseHistoryMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    const [getPatientDiseaseHistoryList] = useLazyGetPatientDiseaseHistoryListQuery();

    useEffect(() => {
        if (deletePatientDiseaseHistoryResponse) {
            enqueueSnackbar(deletePatientDiseaseHistoryResponse.message, {
                variant: deletePatientDiseaseHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deletePatientDiseaseHistoryResponse?.status == true) {
                handleClose();
                getPatientDiseaseHistoryList({ patient_id: id });
            }
        }
        if (deletePatientDiseaseHistoryError) {
            var error = deletePatientDiseaseHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deletePatientDiseaseHistoryResponse, deletePatientDiseaseHistoryError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePatientDiseaseHistory} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deletePatientDiseaseHistoryIsLoading}
                        onClick={() => {
                            deletePatientDiseaseHistory({ patient_disease_history_id: data.patient_disease_history_id, patient_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deletePatientDiseaseHistoryIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientDiseaseHistoryModal