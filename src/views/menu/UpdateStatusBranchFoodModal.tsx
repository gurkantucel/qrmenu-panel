import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { useAppSnackbar } from "hooks/useAppSnackbar";
import { useLocalizedField } from "hooks/useLocalizedField";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useUpdateStatusBranchFoodMutation } from "reduxt/features/menu/menu-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const UpdateStatusBranchFoodModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const t = useLocalizedField()

    const { showMessage } = useAppSnackbar();

    const [updateStatusBranchFood, { isLoading: updateStatusBranchFoodIsLoading, data: updateStatusBranchFoodResponse, error: updateStatusBranchFoodError }] = useUpdateStatusBranchFoodMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (updateStatusBranchFoodResponse) {
            showMessage(updateStatusBranchFoodResponse.message, updateStatusBranchFoodResponse?.success);
            if (updateStatusBranchFoodResponse?.success == true) {
                handleClose();
            }
        }
        if (updateStatusBranchFoodError) {
            var error = updateStatusBranchFoodError as any;
            showMessage(error?.data?.message, false);
        }
    }, [updateStatusBranchFoodResponse, updateStatusBranchFoodError])

    return (
        <Dialog open={open && modalType == ModalEnum.updateStatusBranchFood} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle id="alert-dialog-title">{t(data?.title)}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {intl.formatMessage({ id: "updateStatusText" }, { status: data?.status == true ? intl.formatMessage({ id: "passive" }) : intl.formatMessage({ id: "active" }) })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="info" onClick={handleClose}>
                        {intl.formatMessage({ id: "close" })}
                    </Button>
                    <CustomLoadingButton title={intl.formatMessage({ id: "ok" })}
                        disabled={updateStatusBranchFoodIsLoading}
                        onClick={() => {
                            updateStatusBranchFood({ branchFoodId: data?.branchFoodId, status: !data?.status })
                        }} autoFocus={true} isLoading={updateStatusBranchFoodIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default UpdateStatusBranchFoodModal