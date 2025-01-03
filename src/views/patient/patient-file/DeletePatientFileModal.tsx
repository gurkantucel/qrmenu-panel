import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePatientFileMutation } from "reduxt/features/patient/patient-file-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientFileModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteFilePatient, { isLoading: deleteFilePatientIsLoading, data: deleteFilePatientResponse, error: deleteFilePatientError }] = useDeletePatientFileMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    //const [getPatientList] = useLazyGetPatientListQuery();

    useEffect(() => {
        if (deleteFilePatientResponse) {
            enqueueSnackbar(deleteFilePatientResponse.message, {
                variant: deleteFilePatientResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteFilePatientResponse?.status == true) {
                handleClose();
                //getPatientList({});
            }
        }
        if (deleteFilePatientError) {
            var error = deleteFilePatientError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteFilePatientResponse, deleteFilePatientError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePatientFile} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deleteFilePatientIsLoading}
                        onClick={() => {
                            deleteFilePatient({ patient_file_id: data.patient_file_id ?? 0, patient_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deleteFilePatientIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientFileModal