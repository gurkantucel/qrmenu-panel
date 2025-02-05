import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePatientAllergyHistoryMutation, useLazyGetPatientAllergyHistoryListQuery } from "reduxt/features/patient/allergy-history-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientAllergyHistoryModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deletePatientAllergyHistory, { isLoading: deletePatientAllergyHistoryIsLoading, data: deletePatientAllergyHistoryResponse, error: deletePatientAllergyHistoryError }] = useDeletePatientAllergyHistoryMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    const [getPatientAllergyHistoryList] = useLazyGetPatientAllergyHistoryListQuery();

    useEffect(() => {
        if (deletePatientAllergyHistoryResponse) {
            enqueueSnackbar(deletePatientAllergyHistoryResponse.message, {
                variant: deletePatientAllergyHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deletePatientAllergyHistoryResponse?.status == true) {
                handleClose();
                getPatientAllergyHistoryList({ patient_id: id });
            }
        }
        if (deletePatientAllergyHistoryError) {
            var error = deletePatientAllergyHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deletePatientAllergyHistoryResponse, deletePatientAllergyHistoryError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePatientAllergyHistory} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deletePatientAllergyHistoryIsLoading}
                        onClick={() => {
                            deletePatientAllergyHistory({ patient_allergy_history_id: data.patient_allergy_history_id, patient_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deletePatientAllergyHistoryIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientAllergyHistoryModal