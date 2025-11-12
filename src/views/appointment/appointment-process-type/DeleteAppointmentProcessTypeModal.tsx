import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDeleteAppointmentProcessTypeMutation } from "reduxt/features/branch/appointment-process-type-api";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeleteAppointmentProcessTypeModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteAppointmentProcessType, { isLoading: deleteAppointmentProcessTypeIsLoading, data: deleteAppointmentProcessTypeResponse, error: deleteAppointmentProcessTypeError }] = useDeleteAppointmentProcessTypeMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteAppointmentProcessTypeResponse) {
            enqueueSnackbar(deleteAppointmentProcessTypeResponse.message, {
                variant: deleteAppointmentProcessTypeResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteAppointmentProcessTypeResponse?.status == true) {
                handleClose();
            }
        }
        if (deleteAppointmentProcessTypeError) {
            var error = deleteAppointmentProcessTypeError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteAppointmentProcessTypeResponse, deleteAppointmentProcessTypeError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteAppointmentProcessType} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deleteAppointmentProcessTypeIsLoading}
                        onClick={() => {
                            deleteAppointmentProcessType({ appointment_process_history_id: data.appointment_process_history_id ?? 0, appointment_id: data.appointment_id ?? 0 })
                        }} autoFocus={true} isLoading={deleteAppointmentProcessTypeIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeleteAppointmentProcessTypeModal