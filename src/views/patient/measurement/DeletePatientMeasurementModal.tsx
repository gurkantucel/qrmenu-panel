import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeleteDieticianMeasurementMutation } from "reduxt/features/patient/patient-measurement-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePatientMeasurementModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, data, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteMeasurement, { isLoading: deleteMeasurementIsLoading, data: deleteMeasurementResponse, error: deleteMeasurementError }] = useDeleteDieticianMeasurementMutation();


    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteMeasurementResponse) {
            enqueueSnackbar(deleteMeasurementResponse.message, {
                variant: deleteMeasurementResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteMeasurementResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (deleteMeasurementError) {
            var error = deleteMeasurementError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteMeasurementResponse, deleteMeasurementError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteMeasurement} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deleteMeasurementIsLoading}
                        onClick={() => {
                            deleteMeasurement({ measurement_id: data?.measurement_id, patient_id: data?.patient_id })
                        }} autoFocus={true} isLoading={deleteMeasurementIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePatientMeasurementModal