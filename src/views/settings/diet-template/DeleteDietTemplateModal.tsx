import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeleteDieticianDietTemplateMutation } from "reduxt/features/settings/diet-template-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeleteDietTemplateModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteDietTemplate, { isLoading: deleteDietTemplateIsLoading, data: deleteDietTemplateResponse, error: deleteDietTemplateError }] = useDeleteDieticianDietTemplateMutation();


    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteDietTemplateResponse) {
            enqueueSnackbar(deleteDietTemplateResponse.message, {
                variant: deleteDietTemplateResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteDietTemplateResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (deleteDietTemplateError) {
            var error = deleteDietTemplateError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteDietTemplateResponse, deleteDietTemplateError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteDietTemplate} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deleteDietTemplateIsLoading}
                        onClick={() => {
                            deleteDietTemplate({ diet_template_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deleteDietTemplateIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeleteDietTemplateModal