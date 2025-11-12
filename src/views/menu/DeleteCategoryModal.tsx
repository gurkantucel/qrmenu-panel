import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"
import CustomLoadingButton from "components/CustomLoadingButton";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDeleteCategoryMutation } from "reduxt/features/category/category-api";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";

const DeleteCategoryModal = () => {
    const dispatch = useAppDispatch();
    const { data: { open, modalType, title, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [deleteCategory, { isLoading: deleteCategoryIsLoading, data: deleteCategoryResponse, error: deleteCategoryError }] = useDeleteCategoryMutation();

    const handleClose = () => {
        dispatch(closeModal())
    };

    useEffect(() => {
        if (deleteCategoryResponse) {
            enqueueSnackbar(deleteCategoryResponse.message, {
                variant: deleteCategoryResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (deleteCategoryResponse?.success == true) {
                handleClose();
            }
        }
        if (deleteCategoryError) {
            var error = deleteCategoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [deleteCategoryResponse, deleteCategoryError])

    return (
        <Dialog open={open && modalType == ModalEnum.deleteCategory} onClose={handleClose} fullWidth maxWidth="sm" aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
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
                        disabled={deleteCategoryIsLoading}
                        onClick={() => {
                            deleteCategory({ categoryId: `${id}` })
                        }} autoFocus={true} isLoading={deleteCategoryIsLoading} />
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default DeleteCategoryModal