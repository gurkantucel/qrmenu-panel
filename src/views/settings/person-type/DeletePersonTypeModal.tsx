import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePersonTypeMutation } from "reduxt/features/settings/person-type-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePersonTypeModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deletePersonType, { isLoading: deletePersonTypeIsLoading, data: deletePersonTypeResponse, error: deletePersonTypeError }] = useDeletePersonTypeMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deletePersonTypeResponse) {
            enqueueSnackbar(deletePersonTypeResponse.message, {
                variant: deletePersonTypeResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deletePersonTypeResponse?.status == true) {
                handleClose();
                //getPersonList({});
            }
        }
        if (deletePersonTypeError) {
            var error = deletePersonTypeError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deletePersonTypeResponse, deletePersonTypeError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePersonType} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deletePersonTypeIsLoading}
                        onClick={() => {
                            deletePersonType({ person_type_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deletePersonTypeIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePersonTypeModal