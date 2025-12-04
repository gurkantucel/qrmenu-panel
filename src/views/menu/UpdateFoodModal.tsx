import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { Badge, Box, Button, Collapse, Dialog, DialogActions, Divider, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, OutlinedInput, Stack, Switch, Typography } from "@mui/material"
import { ArrowDown2, ArrowUp2, CloseSquare, DocumentUpload } from "iconsax-react"
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
import { useUpdateFoodMutation } from 'reduxt/features/menu/menu-api';
import { addFoodValidationSchema } from 'utils/schemas/food-validation-schema';
import Image from 'next/image'
import { useAutoTranslate } from 'hooks/useAutoTranslate';
import { Modal2Enum, setModal2 } from 'reduxt/features/definition/modalSlice2';

const UpdateFoodModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const t = useLocalizedField()

    const { autoTranslate, translateIsLoading } = useAutoTranslate();

    const [selectedFiles, setselectedFiles] = useState([]);

    const [acik, setAcik] = useState(false);

    const [benefitsShow, setBenefitsShow] = useState(false);

    const handleToggle = () => {
        setAcik((prev) => !prev);
    };

    const handleBenefistToggle = () => {
        setBenefitsShow((prev) => !prev);
    };

    const [allergens] = useState([
        { "value": "milk", "label": intl.formatMessage({ id: "allergens.milk" }) },
        { "value": "egg", "label": intl.formatMessage({ id: "allergens.egg" }) },
        { "value": "gluten", "label": intl.formatMessage({ id: "allergens.gluten" }) },
        { "value": "peanut", "label": intl.formatMessage({ id: "allergens.peanut" }) },
        { "value": "nuts", "label": intl.formatMessage({ id: "allergens.nuts" }) },
        { "value": "fish", "label": intl.formatMessage({ id: "allergens.fish" }) },
        { "value": "shellfish", "label": intl.formatMessage({ id: "allergens.shellfish" }) },
        { "value": "soy", "label": intl.formatMessage({ id: "allergens.soy" }) },
        { "value": "sesame", "label": intl.formatMessage({ id: "allergens.sesame" }) },
        { "value": "mustard", "label": intl.formatMessage({ id: "allergens.mustard" }) },
        { "value": "celery", "label": intl.formatMessage({ id: "allergens.celery" }) },
        { "value": "lupin", "label": intl.formatMessage({ id: "allergens.lupin" }) }
    ])

    const [initialValues, setInitialValues] = useState<UpdateFoodBodyModel | null>({
        food_id: "",
        title_tr: "",
        title_en: "",
        title_es: null,
        title_fr: null,
        description_tr: "",
        description_en: "",
        description_es: null,
        description_fr: null,
        allergens: [] as string[],
        property_gr: null,
        property_kcal: null,
        property_protein: null,
        property_carbohydrate: null,
        property_fat: null,
        image_url: null,
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
                title_es: data?.title?.es,
                title_fr: data?.title?.fr,
                description_tr: data?.description?.tr,
                description_en: data?.description?.en,
                description_es: data?.description?.es,
                description_fr: data?.description?.fr,
                property_kcal: data?.properties?.kcal,
                property_gr: data?.properties?.gr,
                property_carbohydrate: data?.properties?.carbohydrate,
                property_protein: data?.properties?.protein,
                property_fat: data?.properties?.fat,
                allergens: data?.allergens,
                image_url: null, //BURA NULL KALACAK    
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
                        title_es: null,
                        title_fr: null,
                        description_tr: "",
                        description_en: "",
                        description_es: null,
                        description_fr: null,
                        allergens: [] as string[],
                        property_gr: null,
                        property_kcal: null,
                        property_protein: null,
                        property_carbohydrate: null,
                        property_fat: null,
                        image_url: null,
                        status: true
                    }}
                        enableReinitialize
                        validationSchema={addFoodValidationSchema(intl)}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            if(!selectedFiles && values.image_url == null && data?.imageUrl){
                                values.image_url = data.imageUrl;
                            }
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
                                                    <Button variant="text" size='small' sx={{ padding: 0 }} disabled={!values.title_es || values.title_es.length === 0} onClick={() => autoTranslate({ text: values.title_es, currentLang: "ES", setFieldValue, prefix: "title" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translateTitles" })}</Button>
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
                                                    <Button variant="text" size='small' sx={{ padding: 0 }} disabled={!values.title_fr || values.title_fr.length === 0} onClick={() => autoTranslate({ text: values.title_fr, currentLang: "FR", setFieldValue, prefix: "title" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translateTitles" })}</Button>
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
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={1}>
                                                <Stack direction={"row"} justifyContent={"space-between"}>
                                                    <InputLabel htmlFor="description_es">{`${intl.formatMessage({ id: "description" })} (ES)`}</InputLabel>
                                                    <Button variant="text" size='small' sx={{ padding: 0 }} disabled={!values.description_es || values.description_es.length === 0} onClick={() => autoTranslate({ text: values.description_es, currentLang: "ES", setFieldValue, prefix: "description" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translateDescriptions" })}</Button>
                                                </Stack>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.description_es && errors.description_es)}
                                                    id="description_es"
                                                    type="text"
                                                    value={values.description_es}
                                                    name="description_es"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={`${intl.formatMessage({ id: "description" })} (ES)`}
                                                />
                                            </Stack>
                                            {touched.description_es && errors.description_es && (
                                                <FormHelperText error id="helper-text-lastname-signup">
                                                    {errors.description_es}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={1}>
                                                <Stack direction={"row"} justifyContent={"space-between"}>
                                                    <InputLabel htmlFor="description_fr">{`${intl.formatMessage({ id: "description" })} (FR)`}</InputLabel>
                                                    <Button variant="text" size='small' sx={{ padding: 0 }} disabled={!values.description_fr || values.description_fr.length === 0} onClick={() => autoTranslate({ text: values.description_fr, currentLang: "FR", setFieldValue, prefix: "description" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translateDescriptions" })}</Button>
                                                </Stack>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.description_fr && errors.description_fr)}
                                                    id="description_fr"
                                                    type="text"
                                                    value={values.description_fr}
                                                    name="description_fr"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={`${intl.formatMessage({ id: "description" })} (FR)`}
                                                />
                                            </Stack>
                                            {touched.description_fr && errors.description_fr && (
                                                <FormHelperText error id="helper-text-lastname-signup">
                                                    {errors.description_fr}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ marginBottom: 2 }} />
                                </Collapse>
                                <Stack alignContent={"center"} alignItems={"center"} justifyContent={"center"} marginTop={1}>
                                    <Button
                                        variant="text"
                                        size="medium"
                                        color="secondary"
                                        onClick={handleBenefistToggle}
                                        sx={{ width: 'fit-content', fontWeight: "500" }}
                                        startIcon={benefitsShow ? <ArrowUp2 /> : <ArrowDown2 />}
                                    >
                                        {intl.formatMessage({ id: "addNutritionFactsText" })}
                                    </Button>
                                </Stack>
                                <Collapse in={benefitsShow}>
                                    <Grid item xs={12} sx={{ paddingTop: "0 !important", paddingBottom: 0 }}>
                                        <Typography variant="h5" marginTop={3}>{intl.formatMessage({ id: "nutritionalProperties" })}</Typography>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ marginTop: "1px", marginBottom: 2 }}>
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
                                                        label: item2.label,
                                                    }))}
                                                options={allergens?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                                //getOptionValue={(option: any) => option.value.id.toString()}
                                                //getOptionLabel={(option: any) => option.label}
                                                onChange={(val: any) => {
                                                    setFieldValue("allergens", val.map((item: any) => (item.value)));
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Collapse>
                                {data?.imageUrl && <Box sx={{
                                    border: "1px solid #eff2f7",
                                    borderRadius: "6px",
                                    px: 2,
                                    py: 0.5,
                                    my: 2,
                                }}><Grid item xs={12}>
                                        <InputLabel htmlFor="image" sx={{ marginBottom: 2, fontWeight: 500 }}>{intl.formatMessage({ id: "previouslyUploadedImage" })}</InputLabel>
                                        <Image src={data?.imageUrl} alt={data?.title?.tr} width={128} height={128} />
                                    </Grid></Box>}
                                <Grid item xs={12}>
                                    <Stack direction={"row"} justifyContent={"space-between"}>
                                        <InputLabel htmlFor="description_es">{`${intl.formatMessage({ id: "newImage" })}`}</InputLabel>
                                        <Button variant="text" size='small' sx={{ padding: 0 }} onClick={() => {
                                            dispatch(setModal2({ open: true, modalType: Modal2Enum.imageSelect, data: { setFieldValue } }))
                                        }}>{intl.formatMessage({ id: "chooseFromStockImageGallery" })}</Button>
                                    </Stack>
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
                                            setFieldValue("image_url", null);
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
                                {values.image_url?.includes("stockImageGallery") && <Grid item xs={12}>
                                    <Box sx={{
                                        border: "1px solid #eff2f7",
                                        borderRadius: "6px",
                                        px: 2,
                                        py: 0.5,
                                        my: 2,
                                    }}>
                                        <InputLabel htmlFor="stockImage" sx={{ fontWeight: 500, marginBottom: 1 }}>{`${intl.formatMessage({ id: "stockImage" })}`}</InputLabel>
                                        <Grid item>
                                            <Button 
                                                sx={{padding: 0}}
                                            onClick={() => {
                                                setFieldValue("image_url", null)
                                            }}><Badge badgeContent={"x"} color="error" overlap="circular">
                                                    <Image src={values.image_url} alt={"selectedStockImage"} width={128} height={128} />
                                                </Badge></Button>
                                        </Grid>
                                    </Box>
                                </Grid>}
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