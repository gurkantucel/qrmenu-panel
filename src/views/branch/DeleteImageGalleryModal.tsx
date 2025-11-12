import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeleteImageGalleryMutation } from "reduxt/features/image-gallery/image-gallery-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeleteImageGalleryModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteImageGallery, { isLoading: deleteImageGalleryIsLoading, data: deleteImageGalleryResponse, error: deleteImageGalleryError }] = useDeleteImageGalleryMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteImageGalleryResponse) {
            enqueueSnackbar(deleteImageGalleryResponse.message, {
                variant: deleteImageGalleryResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteImageGalleryResponse?.success == true) {
                handleClose();
            }
        }
        if (deleteImageGalleryError) {
            var error = deleteImageGalleryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteImageGalleryResponse, deleteImageGalleryError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteImageGallery} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle id="alert-dialog-title">{"Resim Sil"}</DialogTitle>
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
                        disabled={deleteImageGalleryIsLoading}
                        onClick={() => {
                            deleteImageGallery({ imageId: `${id}` })
                        }} autoFocus={true} isLoading={deleteImageGalleryIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeleteImageGalleryModal