import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { useRouter } from "next/navigation";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const PassiveBranchModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const router = useRouter();

    const handleClose = () => {
        dispatch(closeModal())
    };

    return (
        <Dialog open={open && modalType == ModalEnum.passiveBranch} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <Box sx={{ p: 1, py: 1.5 }}>
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {intl.formatMessage({ id: "passiveBranchText" })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="info" onClick={handleClose}>
                        {intl.formatMessage({ id: "close" })}
                    </Button>
                    <CustomLoadingButton title={intl.formatMessage({ id: "myPackage" })}
                    isLoading={false}
                        onClick={() => {
                            router.push('/orders')
                        }} autoFocus={true} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default PassiveBranchModal