import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeleteDieticianPatientDietTemplateMutation } from "reduxt/features/patient/dietician-patient-diet-template-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeleteDietTemplateModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteDieticianPatientDietTemplate, { isLoading: deleteDieticianPatientDietTemplateIsLoading, data: deleteDieticianPatientDietTemplateResponse, error: deleteDieticianPatientDietTemplateError }] = useDeleteDieticianPatientDietTemplateMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteDieticianPatientDietTemplateResponse) {
            enqueueSnackbar(deleteDieticianPatientDietTemplateResponse.message, {
                variant: deleteDieticianPatientDietTemplateResponse?.status == true ? 'success' : 'error'
            })
            if (deleteDieticianPatientDietTemplateResponse?.status == true) {
                handleClose();
            }
        }
        if (deleteDieticianPatientDietTemplateError) {
            var error = deleteDieticianPatientDietTemplateError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error'
            })
        }
    }, [deleteDieticianPatientDietTemplateResponse, deleteDieticianPatientDietTemplateError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteDieticianPatientDietTemplate} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deleteDieticianPatientDietTemplateIsLoading}
                        onClick={() => {
                            deleteDieticianPatientDietTemplate({ patient_diet_template_id: id ?? 0, person_id: data?.person_id, patient_id: data?.patient_id })
                        }} autoFocus={true} isLoading={deleteDieticianPatientDietTemplateIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeleteDietTemplateModal