import { Badge, Box, Button, Dialog, DialogActions, Grid, IconButton, InputLabel, Stack, Typography } from '@mui/material'
import React from 'react'
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useIntl } from 'react-intl';
import { CloseSquare, DocumentUpload } from 'iconsax-react';
import Dropzone from "react-dropzone";
import Avatar from 'components/@extended/Avatar';
import { useCreatePatientFileMutation } from 'reduxt/features/patient/patient-file-api';
import { enqueueSnackbar } from 'notistack';

const AddPatientFileModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [selectedFiles, setselectedFiles] = useState([]);

    function formatBytes(bytes: any, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    }

    function handleAcceptedFiles(files: any) {

        files.map((file: any) => {
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        }
        );
        setselectedFiles(files);
    }

    const handleClose = () => {
        dispatch(closeModal())
        setselectedFiles([])
    };

    const [createPatientFile, { isLoading: createPatientFileIsLoading, data: createPatientFileResponse, error: createPatientFileError }] = useCreatePatientFileMutation();

    const onSubmit = () => {
        if (selectedFiles.length > 0) {
            const formData = new FormData();
            formData.append("patient_id", `${id}`);
            for (let index = 0; index < selectedFiles.length; index++) {
                const element = selectedFiles[index];
                formData.append("files[]", element)
            }
            createPatientFile(formData);
        }
    }

    useEffect(() => {
        if (createPatientFileResponse) {
            enqueueSnackbar(createPatientFileResponse.message, {
                variant: createPatientFileResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createPatientFileResponse?.status == true) {
                handleClose();
            }
        }
        if (createPatientFileError) {
            var error = createPatientFileError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createPatientFileResponse, createPatientFileError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.newPatientFile} onClose={handleClose} fullWidth maxWidth="md">
                <Formik
                    initialValues={{}}
                    onSubmit={(val) => { }}
                >
                    {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <Form>
                            <Box sx={{ px: 3, py: 3 }}>
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 4 }}
                                >
                                    <Grid item>
                                        <Typography variant="h4">{intl.formatMessage({ id: "uploadFile" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={48} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "name" })}{"*"}</InputLabel>
                                            <Dropzone
                                                //maxSize={5242880}
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
                                                        {fileRejections.map(({ file, errors },index) => <Typography key={index} variant="h6" color="error"> {file.name} - {errors[0].message}</Typography>)}
                                                    </Box>
                                                )}
                                            </Dropzone>
                                            {selectedFiles.map((f: any, i: number) => {
                                                return (
                                                    <Box sx={{
                                                        border: "1px solid #eff2f7",
                                                        borderRadius: "6px",
                                                        padding: "4px"
                                                        
                                                    }}
                                                    key={i}
                                                    >
                                                        <Stack direction="row" spacing={2}>
                                                            <Grid item>
                                                                <Button onClick={() => {
                                                                    setselectedFiles(selectedFiles.filter((item: any) => item.name != f.name))
                                                                }}><Badge badgeContent={"x"} color="error" overlap="circular">
                                                                        <Avatar size='lg' src={f.preview} alt={f.name} />
                                                                    </Badge></Button>
                                                            </Grid>
                                                            <Grid item>
                                                                <Typography variant='subtitle1'>{f.name}</Typography>
                                                                <Typography>{f.formattedSize}</Typography>
                                                            </Grid>
                                                        </Stack>
                                                    </Box>
                                                )
                                            })}
                                            <DialogActions sx={{ marginTop: 5 }}>
                                                <Button color="info" onClick={handleClose}>
                                                    {intl.formatMessage({ id: "close" })}
                                                </Button>
                                                <AnimateButton>
                                                    <Button disableElevation disabled={selectedFiles.length == 0 || createPatientFileIsLoading} type="submit" variant="contained" color="primary" onClick={onSubmit}>
                                                        {(createPatientFileIsLoading) && <PuffLoader size={20} color='white' />}
                                                        {(createPatientFileIsLoading == false) && intl.formatMessage({ id: "save" })}
                                                    </Button>
                                                </AnimateButton>
                                            </DialogActions>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </>
    )
}

export default AddPatientFileModal