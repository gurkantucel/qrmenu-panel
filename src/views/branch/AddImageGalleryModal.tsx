import React, { useEffect } from 'react'
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { Badge, Box, Button, Dialog, DialogActions, Grid, IconButton, InputLabel, Stack, Typography } from "@mui/material"
import { CloseSquare, DocumentUpload } from "iconsax-react"
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import Dropzone from 'react-dropzone';
import Avatar from 'components/@extended/Avatar';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';
import AnimateButton from 'components/@extended/AnimateButton';
import useFileUploader from 'utils/useFileUploader';
import { useCreateImageGalleryMutation } from 'reduxt/features/image-gallery/image-gallery-api';

const AddImageGalleryModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const { selectedFiles, setSelectedFiles, handleAcceptedFiles, removeFile } = useFileUploader(true)

    const [createImageGallery, { isLoading: createImageGalleryIsLoading, data: createImageGalleryResponse, error: createImageGalleryError }] = useCreateImageGalleryMutation();

    useEffect(() => {
        if (createImageGalleryResponse) {
            enqueueSnackbar(createImageGalleryResponse.message, {
                variant: createImageGalleryResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createImageGalleryResponse?.success == true) {
                handleClose();
            }
        }
        if (createImageGalleryError) {
            const error = createImageGalleryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createImageGalleryResponse, createImageGalleryError])

    const handleClose = () => {
        dispatch(closeModal())
        setSelectedFiles([])
    };


    const onSubmit = () => {
        if (selectedFiles.length > 0) {
            const MAX_SIZE_MB = 3
            let totalSize = 0;
            selectedFiles.forEach(file => {
                totalSize += file.size; // Dosya boyutu byte cinsindendir
            });
            const totalSizeMB = totalSize / (1024 * 1024);
            if (totalSizeMB > MAX_SIZE_MB) {
                enqueueSnackbar("Toplam dosya boyutu 6MB\'tan büyük olamaz.", { variant: 'error' })
                return;
            }
            const formData = new FormData();
            formData.append("branchId", `${data?.branchId}`);
            formData.append("branchSlug", `${data?.branchSlug}`);
            //formData.append("appointment_id", `${data.appointment_id}`);
            for (let index = 0; index < selectedFiles.length; index++) {
                const element = selectedFiles[index];
                formData.append("images", element)
            }
            createImageGallery(formData);
        }
    }

    return (
        <Dialog open={open && modalType == ModalEnum.addImageGallery} onClose={handleClose} fullWidth>
            <Box sx={{ px: 3, py: 3 }}>
                <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                >
                    <Grid item>
                        <Typography variant="h4">{intl.formatMessage({ id: "newImage" })}</Typography>
                    </Grid>
                    <Grid item sx={{ mr: 1.5 }}>
                        <IconButton color="secondary" onClick={handleClose}>
                            <CloseSquare size={36} />
                        </IconButton>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <InputLabel htmlFor="image">{intl.formatMessage({ id: "image" })}</InputLabel>
                        <Dropzone
                            //maxSize={5242880}
                            multiple={true}
                            accept={{ "image/*": [] }}
                            validator={(file) => {
                                if (file.size > 31457280) {
                                    return {
                                        code: "file-too-large",
                                        message: intl.formatMessage({ id: "largerFile" })
                                    }
                                }
                                return null;
                            }}
                            onDrop={acceptedFiles => {
                                handleAcceptedFiles(acceptedFiles);
                            }}
                        >
                            {({ getRootProps, getInputProps, fileRejections }) => (
                                <Box
                                    sx={{
                                        border: "2px dashed #eff2f7",
                                        borderRadius: "6px",
                                        padding: "18px"
                                    }}>
                                    <Stack
                                        flexDirection="column"
                                        justifyContent="center"
                                        alignItems="center"
                                        {...getRootProps()}
                                    >
                                        <DocumentUpload size={36} />
                                        <input {...getInputProps()} />
                                        <Typography variant='h6' marginTop={2}>{intl.formatMessage({ id: "selectFilesDragginFiles" })}</Typography>
                                    </Stack>
                                    {fileRejections.map(({ file, errors }, index) => <Typography key={index} variant="h6" color="error"> {file.name} - {errors[0].message}</Typography>)}
                                </Box>
                            )}
                        </Dropzone>
                    </Grid>
                    <Grid item xs={12}>
                        {selectedFiles?.map((file: any, index: number) => {
                            return (
                                <Box sx={{
                                    border: "1px solid #eff2f7",
                                    borderRadius: "6px",
                                    padding: "4px"

                                }}
                                    key={index}
                                >
                                    <Stack direction="row" spacing={2}>
                                        <Grid item>
                                            <Button onClick={() => {
                                                removeFile(file)
                                            }}><Badge badgeContent={"x"} color="error" overlap="circular">
                                                    <Avatar size='lg' src={file.preview} alt={file.name} />
                                                </Badge></Button>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='subtitle1'>{file.name}</Typography>
                                            <Typography>{file.formattedSize}</Typography>
                                        </Grid>
                                    </Stack>
                                </Box>
                            )
                        }) ?? []}
                    </Grid>
                </Grid>
                <DialogActions sx={{ marginTop: 5 }}>
                    <Button color="info" onClick={handleClose}>
                        {intl.formatMessage({ id: "close" })}
                    </Button>
                    <AnimateButton>
                        <Button disableElevation
                            disabled={createImageGalleryIsLoading || selectedFiles.length == 0}
                            type="button" variant="contained" color="primary" onClick={onSubmit}>
                            {(createImageGalleryIsLoading) && <PuffLoader size={20} color='white' />}
                            {(createImageGalleryIsLoading == false) && intl.formatMessage({ id: "save" })}
                        </Button>
                    </AnimateButton>
                </DialogActions>
            </Box>
        </Dialog>
    )
}

export default AddImageGalleryModal