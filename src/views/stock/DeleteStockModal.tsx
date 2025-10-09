import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeleteStockMutation } from "reduxt/features/stock/stock-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeleteStockModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteStock, { isLoading: deleteStockIsLoading, data: deleteStockResponse, error: deleteStockError }] = useDeleteStockMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    //const [getPersonList] = useLazyGetPersonListQuery();

    useEffect(() => {
        if (deleteStockResponse) {
            enqueueSnackbar(deleteStockResponse.message, {
                variant: deleteStockResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteStockResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (deleteStockError) {
            var error = deleteStockError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteStockResponse, deleteStockError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteStock} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle id="alert-dialog-title">{`${title} ${data?.movement_type == true ? 'Artış' : 'Azalış'}`}</DialogTitle>
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
                        disabled={deleteStockIsLoading}
                        onClick={() => {
                            deleteStock({ stock_id: data?.stock_id, appointment_process_id: data?.appointment_process_id })
                        }} autoFocus={true} isLoading={deleteStockIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeleteStockModal