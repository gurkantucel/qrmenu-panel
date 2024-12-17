import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePatientMutation, useLazyGetPatientListQuery } from "reduxt/features/patient/patient-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deletePatient, { isLoading: deletePatientIsLoading, data: deletePatientResponse, error: deletePatientError }] = useDeletePatientMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    const [getPatientList] = useLazyGetPatientListQuery();

    useEffect(() => {
        if (deletePatientResponse) {
            enqueueSnackbar(deletePatientResponse.message, {
                variant: deletePatientResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deletePatientResponse?.status == true) {
                handleClose();
                getPatientList({});
            }
        }
        if (deletePatientError) {
            var error = deletePatientError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deletePatientResponse, deletePatientError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePatient} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deletePatientIsLoading}
                        onClick={() => {
                            deletePatient({ patient_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deletePatientIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientModal