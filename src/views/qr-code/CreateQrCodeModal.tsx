import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { useDeleteCategoryMutation } from "reduxt/features/category/category-api";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import QRCode from "qrcode";
import { useCreateQrCodeMutation } from "reduxt/features/qr-code/qr-code-api";
import Constants from "utils/Constants";

const CreateQrCodeModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [createQrCode, { isLoading: createQrCodeIsLoading, data: createQrCodeResponse, error: createQrCodeError }] = useCreateQrCodeMutation();

    const validateUrl = (value: string) => {
        if (!value) return false;
        try {
            const url = value.match(/^https?:\/\//) ? value : `https://${value}`;
            new URL(url);
            return url;
        } catch (e) {
            return false;
        }
    };

    const generate = async () => {
        const valid = validateUrl(`https://hgtucel.com/${data?.branchSlug}`);
        if (!valid) {
            enqueueSnackbar("Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            return;
        }

        try {
            // generate a PNG data URL and also draw to canvas for download
            const opts = {
                errorCorrectionLevel: "H" as const, margin: 2, width: 400, color: {
                    dark: "#000000",   // QR kod rengi
                    light: "#0000"     // Transparent arka plan
                }
            };
            const url = await QRCode.toDataURL(valid, opts);

            const response = await fetch(url);
            const blob = await response.blob();

            const file = new File([blob], "qrcode.png", { type: "image/png" });

            const formData = new FormData();
            formData.append("branchId", data?.branchId);
            formData.append("image", file);

            createQrCode(formData);

        } catch (e) {
            console.log(e);
            enqueueSnackbar("Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    };

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (createQrCodeResponse) {
            enqueueSnackbar(createQrCodeResponse.message, {
                variant: createQrCodeResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createQrCodeResponse?.success == true) {
                handleClose();
            }
        }
        if (createQrCodeError) {
            var error = createQrCodeError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createQrCodeResponse, createQrCodeError])

    return (
        <Dialog open={open && modalType == ModalEnum.createQrCode} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {intl.formatMessage({ id: "createQrCodeConfirmText" })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="info" onClick={handleClose}>
                        {intl.formatMessage({ id: "close" })}
                    </Button>
                    <CustomLoadingButton title={intl.formatMessage({ id: "create" })}
                        disabled={createQrCodeIsLoading}
                        onClick={() => { generate() }} autoFocus={true} isLoading={createQrCodeIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default CreateQrCodeModal