import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { useLocalizedField } from "hooks/useLocalizedField";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeleteSelectedFoodMutation } from "reduxt/features/selected-food/selected-food-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeleteSelectedFoodModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const t = useLocalizedField()

    const [deleteSelectedFood, { isLoading: deleteSelectedFoodIsLoading, data: deleteSelectedFoodResponse, error: deleteSelectedFoodError }] = useDeleteSelectedFoodMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteSelectedFoodResponse) {
            enqueueSnackbar(deleteSelectedFoodResponse.message, {
                variant: deleteSelectedFoodResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteSelectedFoodResponse?.success == true) {
                handleClose();
            }
        }
        if (deleteSelectedFoodError) {
            var error = deleteSelectedFoodError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteSelectedFoodResponse, deleteSelectedFoodError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteSelectedFood} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deleteSelectedFoodIsLoading}
                        onClick={() => {
                            deleteSelectedFood({ selectedFoodId: data?.selectedFoodId })
                        }} autoFocus={true} isLoading={deleteSelectedFoodIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeleteSelectedFoodModal