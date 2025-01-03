import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeleteAppointmentProcessMutation } from "reduxt/features/settings/appointment-process-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeleteAppointmentProcessModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteAppointmentProcess, { isLoading: deleteAppointmentProcessIsLoading, data: deleteAppointmentProcessResponse, error: deleteAppointmentProcessError }] = useDeleteAppointmentProcessMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteAppointmentProcessResponse) {
            enqueueSnackbar(deleteAppointmentProcessResponse.message, {
                variant: deleteAppointmentProcessResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteAppointmentProcessResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (deleteAppointmentProcessError) {
            var error = deleteAppointmentProcessError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteAppointmentProcessResponse, deleteAppointmentProcessError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteAppointmentProcess} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deleteAppointmentProcessIsLoading}
                        onClick={() => {
                            deleteAppointmentProcess({ appointment_process_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deleteAppointmentProcessIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeleteAppointmentProcessModal