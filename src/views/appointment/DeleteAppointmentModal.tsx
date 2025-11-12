import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDeleteAppointmentMutation } from "reduxt/features/branch/appointment-api";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeleteAppointmentModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteAppointment, { isLoading: deleteAppointmentIsLoading, data: deleteAppointmentResponse, error: deleteAppointmentError }] = useDeleteAppointmentMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteAppointmentResponse) {
            enqueueSnackbar(deleteAppointmentResponse.message, {
                variant: deleteAppointmentResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteAppointmentResponse?.status == true) {
                handleClose();
                //getPatientList({});
            }
        }
        if (deleteAppointmentError) {
            var error = deleteAppointmentError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteAppointmentResponse, deleteAppointmentError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteAppointment} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deleteAppointmentIsLoading}
                        onClick={() => {
                            deleteAppointment({ appointment_id: data.appointment_id ?? 0, patient_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deleteAppointmentIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeleteAppointmentModal