import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePatientFamilyDiseaseHistoryMutation } from "reduxt/features/patient/family-disease-history-api";

import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientFamilyDiseaseHistoryModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deletePatientFamilyHistoryDisease, { isLoading: deletePatientFamilyHistoryDiseaseIsLoading, data: deletePatientFamilyHistoryDiseaseResponse, error: deletePatientFamilyHistoryDiseaseError }] = useDeletePatientFamilyDiseaseHistoryMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deletePatientFamilyHistoryDiseaseResponse) {
            enqueueSnackbar(deletePatientFamilyHistoryDiseaseResponse.message, {
                variant: deletePatientFamilyHistoryDiseaseResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deletePatientFamilyHistoryDiseaseResponse?.status == true) {
                handleClose();
            }
        }
        if (deletePatientFamilyHistoryDiseaseError) {
            var error = deletePatientFamilyHistoryDiseaseError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deletePatientFamilyHistoryDiseaseResponse, deletePatientFamilyHistoryDiseaseError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePatientFamilyDiseaseHistory} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deletePatientFamilyHistoryDiseaseIsLoading}
                        onClick={() => {
                            deletePatientFamilyHistoryDisease({ patient_family_disease_history_id: data.patient_family_disease_history_id, patient_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deletePatientFamilyHistoryDiseaseIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientFamilyDiseaseHistoryModal