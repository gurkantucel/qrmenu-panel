import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { Badge, Box, Button, Dialog, DialogActions, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, OutlinedInput, Stack, Switch, Typography } from "@mui/material"
import { CloseSquare, DocumentUpload } from "iconsax-react"
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { Form, Formik } from 'formik';
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';
import Dropzone from 'react-dropzone';
import Avatar from 'components/@extended/Avatar';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';
import AnimateButton from 'components/@extended/AnimateButton';
import { useLocalizedField } from 'hooks/useLocalizedField';
import { UpdateFoodBodyModel } from 'reduxt/features/menu/models/menu-model';
import {useUpdateFoodMutation } from 'reduxt/features/menu/menu-api';
import { addFoodValidationSchema } from 'utils/schemas/food-validation-schema';
import Image from 'next/image'

const UpdateFoodModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const t = useLocalizedField()

    const [selectedFiles, setselectedFiles] = useState([]);

    const [allergens] = useState([
        { "value": "milk", "label": { "tr": "Süt Ürünleri", "en": "Dairy Products" } },
        { "value": "egg", "label": { "tr": "Yumurta", "en": "Egg" } },
        { "value": "gluten", "label": { "tr": "Gluten", "en": "Gluten" } },
        { "value": "peanut", "label": { "tr": "Yer Fıstığı", "en": "Peanuts" } },
        { "value": "nuts", "label": { "tr": "Kabuklu Ağaç Yemişleri", "en": "Tree nuts" } },
        { "value": "fish", "label": { "tr": "Balık", "en": "Fish" } },
        { "value": "shellfish", "label": { "tr": "Kabuklu deniz ürünleri", "en": "Shellfish" } },
        { "value": "soy", "label": { "tr": "Soya", "en": "Soy" } },
        { "value": "sesame", "label": { "tr": "Susam", "en": "Sesame" } },
        { "value": "mustard", "label": { "tr": "Hardal", "en": "Mustard" } },
        { "value": "celery", "label": { "tr": "Kereviz", "en": "Celery" } },
        { "value": "lupin", "label": { "tr": "Lupin", "en": "Lupin" } }
    ])

    const [initialValues, setInitialValues] = useState<UpdateFoodBodyModel | null>({
        food_id: "",
        title_tr: "",
        title_en: "",
        description_tr: "",
        description_en: "",
        allergens: [] as string[],
        property_gr: null,
        property_kcal: null,
        property_protein: null,
        property_carbohydrate: null,
        property_fat: null,
        status: true
    })

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

    const [updateFood, { isLoading: updateFoodIsLoading, data: updateFoodResponse, error: updateFoodError }] = useUpdateFoodMutation();

    useEffect(() => {
        if (open && modalType == ModalEnum.updateFood && data != null) {
            const newModel: UpdateFoodBodyModel = {
                food_id: data?.foodId,
                title_tr: data?.title?.tr,
                title_en: data?.title?.en,
                description_tr: data?.description?.tr,
                description_en: data?.description?.en,
                property_kcal: data?.properties?.kcal,
                property_gr: data?.properties?.gr,
                property_carbohydrate: data?.properties?.carbohydrate,
                property_protein: data?.properties?.protein,
                property_fat: data?.properties?.fat,
                allergens: data?.allergens,
                status: data?.status
            }
            setInitialValues(newModel);
        }
    }, [open, modalType, data])

    useEffect(() => {
        if (updateFoodResponse) {
            enqueueSnackbar(updateFoodResponse.message, {
                variant: updateFoodResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateFoodResponse?.success == true) {
                handleClose();
            }
        }
        if (updateFoodError) {
            const error = updateFoodError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateFoodResponse, updateFoodError])

    const handleClose = () => {
        dispatch(closeModal())
        setselectedFiles([])
        setInitialValues(null)
    };

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.updateFood} onClose={handleClose} maxWidth={"lg"}>
                <Box sx={{ px: 3, py: 3 }}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                    >
                        <Grid item>
                            <Typography variant="h4">{t(data?.title)}</Typography>
                        </Grid>
                        <Grid item sx={{ mr: 1.5 }}>
                            <IconButton color="secondary" onClick={handleClose}>
                                <CloseSquare size={36} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Formik initialValues={initialValues ?? {
                        food_id: "",
                        title_tr: "",
                        title_en: "",
                        description_tr: "",
                        description_en: "",
                        allergens: [] as string[],
                        property_gr: null,
                        property_kcal: null,
                        property_protein: null,
                        property_carbohydrate: null,
                        property_fat: null,
                        status: true
                    }}
                        enableReinitialize
                        validationSchema={addFoodValidationSchema}
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
                            updateFood(formData);
                        }}>
                        {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <Form>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="title_tr">{intl.formatMessage({ id: "titleTr" })}</InputLabel>
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
                                            <InputLabel htmlFor="title_en">{intl.formatMessage({ id: "titleEn" })}</InputLabel>
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
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="description_tr">{intl.formatMessage({ id: "descriptionTr" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.description_tr && errors.description_tr)}
                                                id="description_tr"
                                                type="text"
                                                value={values.description_tr}
                                                name="description_tr"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "descriptionTr" })}
                                            />
                                        </Stack>
                                        {touched.description_tr && errors.description_tr && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.description_tr}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="description_en">{intl.formatMessage({ id: "descriptionEn" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.description_en && errors.description_en)}
                                                id="description_en"
                                                type="text"
                                                value={values.description_en}
                                                name="description_en"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "descriptionEn" })}
                                            />
                                        </Stack>
                                        {touched.description_en && errors.description_en && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.description_en}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <Typography variant="h5" marginY={3}>{"Besin Özellikleri"}</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="title_tr">{intl.formatMessage({ id: "gr" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.property_gr && errors.property_gr)}
                                                id="property_gr"
                                                type="text"
                                                value={values.property_gr}
                                                name="property_gr"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "gr" })}
                                            />
                                        </Stack>
                                        {touched.property_gr && errors.property_gr && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.property_gr}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="property_kcal">{intl.formatMessage({ id: "kcal" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.property_kcal && errors.property_kcal)}
                                                id="property_kcal"
                                                type="text"
                                                value={values.property_kcal}
                                                name="property_kcal"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "kcal" })}
                                            />
                                        </Stack>
                                        {touched.property_kcal && errors.property_kcal && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.property_kcal}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="property_protein">{intl.formatMessage({ id: "protein" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.property_protein && errors.property_protein)}
                                                id="property_protein"
                                                type="text"
                                                value={values.property_protein}
                                                name="property_protein"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "protein" })}
                                            />
                                        </Stack>
                                        {touched.property_protein && errors.property_protein && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.property_protein}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="property_carbohydrate">{intl.formatMessage({ id: "carbohydrate" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.property_carbohydrate && errors.property_carbohydrate)}
                                                id="property_carbohydrate"
                                                type="text"
                                                value={values.property_carbohydrate}
                                                name="property_carbohydrate"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "carbohydrate" })}
                                            />
                                        </Stack>
                                        {touched.property_carbohydrate && errors.property_carbohydrate && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.property_carbohydrate}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="property_fat">{intl.formatMessage({ id: "fat" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.property_fat && errors.property_fat)}
                                                id="property_fat"
                                                type="text"
                                                value={values.property_fat}
                                                name="property_fat"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "fat" })}
                                            />
                                        </Stack>
                                        {touched.property_fat && errors.property_fat && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.property_fat}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <InputLabel htmlFor="allergens">{intl.formatMessage({ id: "allergens" })}</InputLabel>
                                        <CustomFormikSelect
                                            name='allergens'
                                            placeholder="Seçim yapınız..."
                                            isMulti={true}
                                            zIndex={989}
                                            value={allergens
                                                ?.filter((item) =>
                                                    values.allergens?.some((b) => b === item.value)
                                                )
                                                .map((item2) => ({
                                                    value: item2.value,
                                                    label: t(item2.label),
                                                }))}
                                            options={allergens?.map((item) => ({
                                                value: item.value,
                                                label: t(item.label)
                                            }))}
                                            //getOptionValue={(option: any) => option.value.id.toString()}
                                            //getOptionLabel={(option: any) => option.label}
                                            onChange={(val: any) => {
                                                setFieldValue("allergens", val.map((item: any) => (item.value)));
                                            }}
                                        />
                                    </Grid>
                                    {data?.imageUrl && <Grid item xs={12}>
                                        <InputLabel htmlFor="image" sx={{ marginBottom: 2 }}>{intl.formatMessage({ id: "previouslyUploadedImage" })}</InputLabel>
                                        <Image src={data?.imageUrl} alt={data?.title?.tr} width={128} height={128} />
                                    </Grid>}
                                    <Grid item xs={12}>
                                        <InputLabel htmlFor="image">{intl.formatMessage({ id: "newImage" })}</InputLabel>
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
                                            disabled={updateFoodIsLoading}
                                            type="button" variant="contained" color="primary" onClick={() => { handleSubmit() }}>
                                            {(updateFoodIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(updateFoodIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default UpdateFoodModal