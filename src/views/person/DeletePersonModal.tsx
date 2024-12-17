import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useDeletePersonMutation, useLazyGetPersonListQuery } from "reduxt/features/person/person-api";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeletePersonModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deletePerson, { isLoading: deletePersonIsLoading, data: deletePersonResponse, error: deletePersonError }] = useDeletePersonMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    const [getPersonList] = useLazyGetPersonListQuery();

    useEffect(() => {
        if (deletePersonResponse) {
            enqueueSnackbar(deletePersonResponse.message, {
                variant: deletePersonResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deletePersonResponse?.status == true) {
                handleClose();
                getPersonList({});
            }
        }
        if (deletePersonError) {
            var error = deletePersonError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deletePersonResponse, deletePersonError])

    return (
        <Dialog open={open && modalType == ModalEnum.deletePerson} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deletePersonIsLoading}
                        onClick={() => {
                            deletePerson({ person_id: id ?? 0 })
                        }} autoFocus={true} isLoading={deletePersonIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeletePersonModal