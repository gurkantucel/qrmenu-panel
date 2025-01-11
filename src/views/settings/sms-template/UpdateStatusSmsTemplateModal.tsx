import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useUpdateStatusSmsTemplateMutation } from "reduxt/features/sms-template/sms-template-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const UpdateStatusSmsTemplateModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [updateStatusSmsTemplate, { isLoading: updateStatusSmsTemplateIsLoading, data: updateStatusSmsTemplateResponse, error: updateStatusSmsTemplateError }] = useUpdateStatusSmsTemplateMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (updateStatusSmsTemplateResponse) {
            enqueueSnackbar(updateStatusSmsTemplateResponse.message, {
                variant: updateStatusSmsTemplateResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateStatusSmsTemplateResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (updateStatusSmsTemplateError) {
            var error = updateStatusSmsTemplateError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateStatusSmsTemplateResponse, updateStatusSmsTemplateError])

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <Dialog open={open && modalType == ModalEnum.smsTemplateUpdateStatus} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {intl.formatMessage({ id: "updateStatusText" })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="info" onClick={handleClose}>
                        {intl.formatMessage({ id: "close" })}
                    </Button>
                    <CustomLoadingButton title={intl.formatMessage({ id: "yes" })}
                        disabled={updateStatusSmsTemplateIsLoading}
                        onClick={() => {
                            updateStatusSmsTemplate({ sms_template_id: data.sms_template_id, status: !data.status })
                        }} autoFocus={true} isLoading={updateStatusSmsTemplateIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default UpdateStatusSmsTemplateModal