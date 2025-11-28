import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { Badge, Box, Button, Collapse, Dialog, DialogActions, Divider, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, OutlinedInput, Paper, Stack, Switch, Typography } from "@mui/material"
import { Add, ArrowDown2, ArrowUp2, CloseSquare, DocumentUpload } from "iconsax-react"
import { closeModal, ModalEnum, setModal } from 'reduxt/features/definition/modalSlice';
import { Form, Formik } from 'formik';
import { Branches } from 'reduxt/features/category/models/category-model';
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';
import { useGetBranchDropdownQuery } from 'reduxt/features/branch/branch-api';
import Dropzone from 'react-dropzone';
import Avatar from 'components/@extended/Avatar';
import { useCreateCategoryMutation } from 'reduxt/features/category/category-api';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';
import AnimateButton from 'components/@extended/AnimateButton';
import { useAutoTranslate } from 'hooks/useAutoTranslate';
import { categoryValidationSchema } from 'utils/schemas/category-validation-schema';

interface FormValues {
    title_tr: string;
    title_en: string;
    title_es: string | null;
    title_fr: string | null;
    branches: Branches[];
    status: boolean;
}

const AddCategoryModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const { autoTranslate, translateIsLoading } = useAutoTranslate();

    const [selectedFiles, setselectedFiles] = useState([]);

    const [acik, setAcik] = useState(false);

    const handleToggle = () => {
        setAcik((prev) => !prev);
    };

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

    const { isLoading: getBranchDropdownLoading, data: getBranchDropdownData } = useGetBranchDropdownQuery()

    const [createCategory, { isLoading: createCategoryIsLoading, data: createCategoryResponse, error: createCategoryError }] = useCreateCategoryMutation();

    useEffect(() => {
        if (createCategoryResponse) {
            enqueueSnackbar(createCategoryResponse.message, {
                variant: createCategoryResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createCategoryResponse?.success == true) {
                handleClose();
            }
        }
        if (createCategoryError) {
            const error = createCategoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createCategoryResponse, createCategoryError])

    const handleClose = () => {
        dispatch(closeModal())
        setselectedFiles([])
    };

    return (
        <>
            <Button variant="dashed" startIcon={<Add />} onClick={() => {
                dispatch(setModal({
                    open: true,
                    modalType: ModalEnum.addCategory
                }))
            }}>{intl.formatMessage({ id: "add" })}</Button>
            <Dialog open={open && modalType == ModalEnum.addCategory} onClose={handleClose}>
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
                    <Formik<FormValues> initialValues={{
                        title_tr: "",
                        title_en: "",
                        title_es: null,
                        title_fr: null,
                        branches: [],
                        status: true
                    }}
                        validationSchema={categoryValidationSchema(intl)}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
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
                            if (selectedFiles) {
                                formData.append('image', selectedFiles[0]);
                            }
                            createCategory(formData);
                        }}>
                        {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <Form>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <Stack direction={"row"} justifyContent={"space-between"}>
                                                <InputLabel htmlFor="title_tr">{intl.formatMessage({ id: "titleTr" })}</InputLabel>
                                                <Button variant="text" size='small' sx={{ padding: 0 }} disabled={values.title_tr.length == 0} onClick={() => autoTranslate({ text: values.title_tr, currentLang: "TR", setFieldValue, prefix: "title" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translate" })}</Button>
                                            </Stack>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.title_tr && errors.title_tr)}
                                                id="title_tr"
                                                type="text"
                                                value={values.title_tr}
                                                name="title_tr"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "titleTr" })}
                                            />
                                        </Stack>
                                        {touched.title_tr && errors.title_tr && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.title_tr}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <Stack direction={"row"} justifyContent={"space-between"}>
                                                <InputLabel htmlFor="title_en">{intl.formatMessage({ id: "titleEn" })}</InputLabel>
                                                <Button variant="text" size='small' sx={{ padding: 0 }} disabled={values.title_en.length == 0} onClick={() => autoTranslate({ text: values.title_en, currentLang: "EN", setFieldValue, prefix: "title" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translate" })}</Button>
                                            </Stack>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.title_en && errors.title_en)}
                                                id="title_en"
                                                type="text"
                                                value={values.title_en}
                                                name="title_en"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "titleEn" })}
                                            />
                                        </Stack>
                                        {touched.title_en && errors.title_en && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.title_en}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <Stack alignContent={"center"} alignItems={"center"} justifyContent={"center"} marginTop={1}>
                                    <Button
                                        variant="text"
                                        size='small'
                                        onClick={handleToggle}
                                        sx={{ width: 'fit-content' }}
                                        startIcon={acik ? <ArrowUp2 /> : <ArrowDown2 />}
                                    >
                                        {acik ? intl.formatMessage({ id: "hideOtherLanguages" }) : intl.formatMessage({ id: "showOtherLanguages" })}
                                    </Button>
                                </Stack>
                                <Collapse in={acik}>
                                    <Divider sx={{ marginBottom: 0.5 }} />
                                    <Grid container spacing={3} sx={{ marginTop: "1px", marginBottom: 2 }}>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={1}>
                                                <Stack direction={"row"} justifyContent={"space-between"}>
                                                    <InputLabel htmlFor="title_es">{`${intl.formatMessage({ id: "title" })} (ES)`}</InputLabel>
                                                    <Button variant="text" size='small' sx={{ padding: 0 }} disabled={!values.title_es || values.title_es.length === 0} onClick={() => autoTranslate({ text: values.title_es, currentLang: "ES", setFieldValue, prefix: "title" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translate" })}</Button>
                                                </Stack>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.title_es && errors.title_es)}
                                                    id="title_es"
                                                    type="text"
                                                    value={values.title_es}
                                                    name="title_es"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={`${intl.formatMessage({ id: "title" })} (ES)`}
                                                />
                                            </Stack>
                                            {touched.title_es && errors.title_es && (
                                                <FormHelperText error id="helper-text-lastname-signup">
                                                    {errors.title_es}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={1}>
                                                <Stack direction={"row"} justifyContent={"space-between"}>
                                                    <InputLabel htmlFor="title_es">{`${intl.formatMessage({ id: "title" })} (FR)`}</InputLabel>
                                                    <Button variant="text" size='small' sx={{ padding: 0 }} disabled={!values.title_fr || values.title_fr.length === 0} onClick={() => autoTranslate({ text: values.title_fr, currentLang: "FR", setFieldValue, prefix: "title" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translate" })}</Button>
                                                </Stack>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.title_fr && errors.title_fr)}
                                                    id="title_fr"
                                                    type="text"
                                                    value={values.title_fr}
                                                    name="title_fr"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={`${intl.formatMessage({ id: "title" })} (FR)`}
                                                />
                                            </Stack>
                                            {touched.title_fr && errors.title_fr && (
                                                <FormHelperText error id="helper-text-lastname-signup">
                                                    {errors.title_fr}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ marginBottom: 2 }} />
                                </Collapse>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12}>
                                        <InputLabel htmlFor="title_en">{intl.formatMessage({ id: "branches" })}</InputLabel>
                                        <CustomFormikSelect
                                            name='branches'
                                            placeholder="Seçim yapınız..."
                                            isMulti={true}
                                            isLoading={getBranchDropdownLoading}
                                            zIndex={989}
                                            value={getBranchDropdownData?.data
                                                ?.filter((item) =>
                                                    values.branches?.some((b) => b.id === item.value)
                                                )
                                                .map((item2) => ({
                                                    value: { id: item2.value, slug: item2.field },
                                                    label: item2.label,
                                                }))}
                                            options={getBranchDropdownData?.data?.map((item) => ({
                                                value: { id: item.value, slug: item.field },
                                                label: item.label
                                            }))}
                                            getOptionValue={(option: any) => option.value.id.toString()}
                                            getOptionLabel={(option: any) => option.label}
                                            onChange={(val: any) => {
                                                //setSelectModules(val);
                                                setFieldValue("branches", val.map((item: any) => ({ id: item.value.id, slug: item.value.slug })));
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputLabel htmlFor="image">{intl.formatMessage({ id: "image" })}</InputLabel>
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
                                                        <Typography variant='h6' marginTop={2}>{intl.formatMessage({ id: "selectFilesDragginFiles" })}</Typography>
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
                                            checked={values.status}
                                            value={values.status} onChange={(e, checked) => {
                                                setFieldValue("status", checked);
                                            }} />} label={intl.formatMessage({ id: values.status ? "active" : "passive" })} />
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation
                                            disabled={createCategoryIsLoading}
                                            type="button" variant="contained" color="primary" onClick={() => { handleSubmit() }}>
                                            {(createCategoryIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createCategoryIsLoading == false) && intl.formatMessage({ id: "save" })}
                                        </Button>
                                    </AnimateButton>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Dialog >
        </>
    )
}

export default AddCategoryModal