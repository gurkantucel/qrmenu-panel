import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { Badge, Box, Button, Dialog, DialogActions, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, OutlinedInput, Stack, Switch, Typography } from "@mui/material"
import { CloseSquare, DocumentUpload } from "iconsax-react"
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { useFormik } from 'formik';
import Dropzone from 'react-dropzone';
import Avatar from 'components/@extended/Avatar';
import { useUpdateCategoryMutation } from 'reduxt/features/category/category-api';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';
import AnimateButton from 'components/@extended/AnimateButton';
import Image from 'next/image'

const UpdateCategoryModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, data } } = useAppSelector((state: RootState) => state.modal);
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

    useEffect(() => {
        if (open && modalType == ModalEnum.updateCategory && data) {
            formik.setValues({
                categoryId: data?.id,
                title_en: data?.title?.en,
                title_tr: data?.title?.tr,
                status: data?.status
            })
        }
    }, [open, modalType, data])

    const [updateCategory, { isLoading: updateCategoryIsLoading, data: updateCategoryResponse, error: updateCategoryError }] = useUpdateCategoryMutation();

    const formik = useFormik({
        initialValues: {
            categoryId: "",
            title_tr: "",
            title_en: "",
            status: true
        },
        onSubmit: (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        formData.append(key, JSON.stringify(value));
                    }
                } else if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });
            if (selectedFiles.length > 0) {
                formData.append('image', selectedFiles[0]);
            }
            updateCategory(formData);
        },
    });

    useEffect(() => {
        if (updateCategoryResponse) {
            enqueueSnackbar(updateCategoryResponse.message, {
                variant: updateCategoryResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateCategoryResponse?.success == true) {
                handleClose();
            }
        }
        if (updateCategoryError) {
            const error = updateCategoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateCategoryResponse, updateCategoryError])

    const handleClose = () => {
        dispatch(closeModal())
        setselectedFiles([])
        formik.resetForm();
    };

    return (
        <Dialog open={open && modalType == ModalEnum.updateCategory} onClose={handleClose}>
            <Box sx={{ px: 3, py: 3 }}>
                <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                >
                    <Grid item>
                        <Typography variant="h4">{intl.formatMessage({ id: id != null ? "update" : "create" })}</Typography>
                    </Grid>
                    <Grid item sx={{ mr: 1.5 }}>
                        <IconButton color="secondary" onClick={handleClose}>
                            <CloseSquare size={36} />
                        </IconButton>
                    </Grid>
                </Grid>
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="title_tr">{intl.formatMessage({ id: "titleTr" })}</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    error={Boolean(formik.touched.title_tr && formik.errors.title_tr)}
                                    id="title_tr"
                                    type="text"
                                    value={formik.values.title_tr}
                                    name="title_tr"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder={intl.formatMessage({ id: "titleTr" })}
                                />
                            </Stack>
                            {formik.touched.title_tr && formik.errors.title_tr && (
                                <FormHelperText error id="helper-text-lastname-signup">
                                    {formik.errors.title_tr}
                                </FormHelperText>
                            )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={1}>
                                <InputLabel htmlFor="title_en">{intl.formatMessage({ id: "titleEn" })}</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    error={Boolean(formik.touched.title_en && formik.errors.title_en)}
                                    id="title_en"
                                    type="text"
                                    value={formik.values.title_en}
                                    name="title_en"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    placeholder={intl.formatMessage({ id: "titleEn" })}
                                />
                            </Stack>
                            {formik.touched.title_en && formik.errors.title_en && (
                                <FormHelperText error id="helper-text-lastname-signup">
                                    {formik.errors.title_en}
                                </FormHelperText>
                            )}
                        </Grid>
                        {data?.imageUrl && <Grid item xs={12}>
                            <InputLabel htmlFor="image" sx={{ marginBottom: 2 }}>{intl.formatMessage({ id: "previouslyUploadedImage" })}</InputLabel>
                            <Image src={data?.imageUrl} alt={data?.title?.tr} width={128} height={128} />
                        </Grid>}
                        <Grid item xs={12}>
                            <InputLabel htmlFor="image">{intl.formatMessage({ id: "newImage" })}</InputLabel>
                            <Typography>{intl.formatMessage({ id: "newImage" })}</Typography>
                            <Dropzone
                                //maxSize={5242880}
                                multiple={false}
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
                                            <Typography variant='h6' marginTop={2}>{intl.formatMessage({ id: "selectFileDragginFile" })}</Typography>
                                        </Stack>
                                        {fileRejections.map(({ file, errors }, index) => <Typography key={index} variant="h6" color="error"> {file.name} - {errors[0].message}</Typography>)}
                                    </Box>
                                )}
                            </Dropzone>
                        </Grid>
                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel htmlFor="status">{intl.formatMessage({ id: "status" })}</InputLabel>
                            <FormControlLabel control={<Switch
                                checked={formik.values.status}
                                value={formik.values.status} onChange={(e, checked) => {
                                    formik.setFieldValue("status", checked);
                                }} />} label={intl.formatMessage({ id: formik.values.status ? "active" : "passive" })} />
                        </Grid>
                    </Grid>
                    <DialogActions sx={{ marginTop: 5 }}>
                        <Button color="info" onClick={handleClose}>
                            {intl.formatMessage({ id: "close" })}
                        </Button>
                        <AnimateButton>
                            <Button disableElevation
                                disabled={updateCategoryIsLoading}
                                type="submit" variant="contained" color="primary">
                                {(updateCategoryIsLoading) && <PuffLoader size={20} color='white' />}
                                {(updateCategoryIsLoading == false) && intl.formatMessage({ id: "save" })}
                            </Button>
                        </AnimateButton>
                    </DialogActions>
                </form>
            </Box>
        </Dialog>
    )
}

export default UpdateCategoryModal