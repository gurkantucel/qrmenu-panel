import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { useLocalizedField } from "hooks/useLocalizedField";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useUpdateStatusSelectedFoodMutation } from "reduxt/features/selected-food/selected-food-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const UpdateStatusSelectedFoodModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const t = useLocalizedField()

    const [updateStatusSelectedFood, { isLoading: updateStatusSelectedFoodIsLoading, data: updateStatusSelectedFoodResponse, error: updateStatusSelectedFoodError }] = useUpdateStatusSelectedFoodMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (updateStatusSelectedFoodResponse) {
            enqueueSnackbar(updateStatusSelectedFoodResponse.message, {
                variant: updateStatusSelectedFoodResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateStatusSelectedFoodResponse?.success == true) {
                handleClose();
            }
        }
        if (updateStatusSelectedFoodError) {
            var error = updateStatusSelectedFoodError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateStatusSelectedFoodResponse, updateStatusSelectedFoodError])

    return (
        <Dialog open={open && modalType == ModalEnum.updateStatusSelectedFood} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle id="alert-dialog-title">{t(data?.title)}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {intl.formatMessage({ id: "updateStatusText" }, { status: data?.status == true ? "Pasif" : "Aktif" })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="info" onClick={handleClose}>
                        {intl.formatMessage({ id: "close" })}
                    </Button>
                    <CustomLoadingButton title={intl.formatMessage({ id: "ok" })}
                        disabled={updateStatusSelectedFoodIsLoading}
                        onClick={() => {
                            updateStatusSelectedFood({ selectedFoodId: data?.selectedFoodId, status: !data?.status })
                        }} autoFocus={true} isLoading={updateStatusSelectedFoodIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default UpdateStatusSelectedFoodModal