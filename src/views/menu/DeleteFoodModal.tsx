import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { useLocalizedField } from "hooks/useLocalizedField";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeleteFoodMutation } from "reduxt/features/menu/menu-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeleteFoodModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const t = useLocalizedField()

    const [deleteFood, { isLoading: deleteFoodIsLoading, data: deleteFoodResponse, error: deleteFoodError }] = useDeleteFoodMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteFoodResponse) {
            enqueueSnackbar(deleteFoodResponse.message, {
                variant: deleteFoodResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteFoodResponse?.success == true) {
                handleClose();
            }
        }
        if (deleteFoodError) {
            var error = deleteFoodError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteFoodResponse, deleteFoodError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteFood} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle id="alert-dialog-title">{t(data?.title)}</DialogTitle>
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
                        disabled={deleteFoodIsLoading}
                        onClick={() => {
                            deleteFood({ foodId: data?.foodId, branchFoodId: data?.branchFoodId })
                        }} autoFocus={true} isLoading={deleteFoodIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeleteFoodModal