import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeleteMakeAnOfferMutation } from "reduxt/features/make-an-offer/make-an-offer-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeleteMakeAnOfferModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteMakeAnOffer, { isLoading: deleteMakeAnOfferIsLoading, data: deleteMakeAnOfferResponse, error: deleteMakeAnOfferError }] = useDeleteMakeAnOfferMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteMakeAnOfferResponse) {
            enqueueSnackbar(deleteMakeAnOfferResponse.message, {
                variant: deleteMakeAnOfferResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteMakeAnOfferResponse?.status == true) {
                handleClose();
                //getPatientList({});
            }
        }
        if (deleteMakeAnOfferError) {
            var error = deleteMakeAnOfferError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteMakeAnOfferResponse, deleteMakeAnOfferError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteMakeAnOffer} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deleteMakeAnOfferIsLoading}
                        onClick={() => {
                            deleteMakeAnOffer({ quote_id: id ?? "0", })
                        }} autoFocus={true} isLoading={deleteMakeAnOfferIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeleteMakeAnOfferModal