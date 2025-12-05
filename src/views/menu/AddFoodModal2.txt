import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { Badge, Box, Button, Collapse, Dialog, DialogActions, Divider, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, OutlinedInput, Stack, Switch, Typography } from "@mui/material"
import { ArrowDown2, ArrowUp2, CloseSquare, DocumentUpload } from "iconsax-react"
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { Field, FieldArray, Form, Formik, FormikErrors } from 'formik';
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';
import { useGetBranchDropdownQuery } from 'reduxt/features/branch/branch-api';
import Dropzone from 'react-dropzone';
import Avatar from 'components/@extended/Avatar';
import { useGetCategoryDropdownQuery } from 'reduxt/features/category/category-api';
import { PuffLoader } from 'react-spinners';
import AnimateButton from 'components/@extended/AnimateButton';
import CurrencyInput from 'react-currency-input-field';
import { useLocalizedField } from 'hooks/useLocalizedField';
import { useGetCurrencyDropdownQuery } from 'reduxt/features/common/common-api';
import { Branch, CreateFoodBodyModel } from 'reduxt/features/menu/models/menu-model';
import { useCreateFoodMutation } from 'reduxt/features/menu/menu-api';
import { addFoodValidationSchema } from 'utils/schemas/food-validation-schema';
import { useAutoTranslate } from 'hooks/useAutoTranslate';
import { useAppSnackbar } from 'hooks/useAppSnackbar';

const AddFoodModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const t = useLocalizedField()

    const { showMessage } = useAppSnackbar();

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

    const [initialValues, setInitialValues] = useState<CreateFoodBodyModel>({
        title_tr: "",
        title_en: "",
        title_es: null,
        title_fr: null,
        description_tr: "",
        description_en: "",
        description_es: null,
        description_fr: null,
        branches: [{
            id: "",
            slug: "",
            categoryId: "",
            currencyCode: "",
            price: "",
        }] as Branch[],
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

    const { isLoading: getBranchDropdownLoading, data: getBranchDropdownData } = useGetBranchDropdownQuery()

    const allBranches = getBranchDropdownData?.data ?? [];

    const { isLoading: getCurrencyDropdownLoading, data: getCurrencyDropdownData } = useGetCurrencyDropdownQuery(undefined, { skip: modalType != ModalEnum.addFood })

    const [createFood, { isLoading: createFoodIsLoading, data: createFoodResponse, error: createFoodError }] = useCreateFoodMutation();

    useEffect(() => {
        if (open && modalType == ModalEnum.addFood) {
            if (getBranchDropdownData?.data != null && getCurrencyDropdownData?.data != null) {
                const branchData = getBranchDropdownData?.data[0];
                const currencyData = getCurrencyDropdownData?.data?.find((item) => item.value == "TRY");
                setInitialValues((prev) => ({
                    ...prev,
                    branches: [{ id: branchData.value, slug: branchData.field ?? "", categoryId: "", currencyCode: currencyData?.value ?? "TRY", price: "" }]
                }));
            }
        }
    }, [open, modalType, getBranchDropdownData, getCurrencyDropdownData])

    useEffect(() => {
        if (createFoodResponse) {
            showMessage(createFoodResponse.message, createFoodResponse?.success);
            if (createFoodResponse?.success == true) {
                handleClose();
            }
        }
        if (createFoodError) {
            const error = createFoodError as any;
            showMessage(error?.data?.message, false);
        }
    }, [createFoodResponse, createFoodError])

    const handleClose = () => {
        dispatch(closeModal())
        setselectedFiles([])
    };

    return (
        <Dialog open={open && modalType == ModalEnum.addFood} onClose={handleClose} maxWidth={"lg"}>
            <Box sx={{ px: 3, py: 3 }}>
                <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                >
                    <Grid item>
                        <Typography variant="h4">{intl.formatMessage({ id: id != null ? "update" : "add" })}</Typography>
                    </Grid>
                    <Grid item sx={{ mr: 1.5 }}>
                        <IconButton color="secondary" onClick={handleClose}>
                            <CloseSquare size={36} />
                        </IconButton>
                    </Grid>
                </Grid>
                <Formik initialValues={initialValues ?? {
                    title_tr: "",
                    title_en: "",
                    title_es: "",
                    title_fr: "",
                    description_tr: "",
                    description_en: "",
                    branches: [{
                        id: "",
                        slug: "",
                        currencyCode: "",
                        categoryId: "",
                        price: "",
                    }] as Branch[],
                    allergens: [] as string[],
                    property_gr: null,
                    property_kcal: null,
                    property_protein: null,
                    property_carbohydrate: null,
                    property_fat: null,
                    status: true
                }}
                    enableReinitialize
                    validationSchema={addFoodValidationSchema(intl)}
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
                        createFood(formData);
                    }}>
                    {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <Form>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Stack direction={"row"} justifyContent={"space-between"}>
                                            <InputLabel htmlFor="title_tr">{intl.formatMessage({ id: "titleTr" })}</InputLabel>
                                            <Button variant="text" size='small' sx={{ padding: 0 }} disabled={values.title_tr.length == 0} onClick={() => autoTranslate({ text: values.title_tr, currentLang: "TR", setFieldValue, prefix: "title" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translateTitles" })}</Button>
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
                                            <Button variant="text" size='small' sx={{ padding: 0 }} disabled={values.title_en.length == 0} onClick={() => autoTranslate({ text: values.title_en, currentLang: "EN", setFieldValue, prefix: "title" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translateTitles" })}</Button>
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
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <Stack direction={"row"} justifyContent={"space-between"}>
                                            <InputLabel htmlFor="description_tr">{`${intl.formatMessage({ id: "description" })} (TR)`}</InputLabel>
                                            <Button variant="text" size='small' sx={{ padding: 0 }} disabled={!values.description_tr || values.description_tr.length === 0} onClick={() => autoTranslate({ text: values.description_tr, currentLang: "TR", setFieldValue, prefix: "description" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translateDescriptions" })}</Button>
                                        </Stack>
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
                                        <Stack direction={"row"} justifyContent={"space-between"}>
                                            <InputLabel htmlFor="description_en">{`${intl.formatMessage({ id: "description" })} (EN)`}</InputLabel>
                                            <Button variant="text" size='small' sx={{ padding: 0 }} disabled={!values.description_en || values.description_en.length === 0} onClick={() => autoTranslate({ text: values.description_en, currentLang: "EN", setFieldValue, prefix: "description" })}>{translateIsLoading ? intl.formatMessage({ id: "loading" }) : intl.formatMessage({ id: "translateDescriptions" })}</Button>
                                        </Stack>
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
                            <Grid spacing={3}>
                                <Grid item xs={12}>
                                    <FieldArray name="branches">
                                        {({ push, remove, form }) => (
                                            <>
                                                {values.branches.map((branch, branchIndex) => {
                                                    // ✅ zaten seçilmiş branchId'leri bul
                                                    const selectedIds = values.branches
                                                        .map((b) => b.id)
                                                        .filter(Boolean);
                                                    // ✅ select için kullanılabilir seçenekleri filtrele
                                                    const availableOptions = allBranches.filter(
                                                        (item) => !selectedIds.includes(item.value) || item.value === branch.id
                                                    );
                                                    const canAdd = values.branches.length < allBranches.length;

                                                    return (<Grid container spacing={3} key={branchIndex} sx={{ borderBottom: "1px solid #dedede", paddingBottom: 3 }}>
                                                        <Grid item xs={12} md={1}>
                                                            <InputLabel htmlFor="title_en" sx={{ fontWeight: 500, marginBottom: 2 }}>{intl.formatMessage({ id: "add" })}</InputLabel>
                                                            <Stack direction="row" spacing={1}>
                                                                <Button disabled={!canAdd} sx={{ minWidth: 40 }} type='button' variant="outlined" onClick={() => push({ id: '', slug: '', currencyCode: '', price: '' })}>{"+"}</Button>
                                                                <Button disabled={values.branches.length === 1} sx={{ minWidth: 40 }} type='button' variant="outlined" color="error" onClick={() => remove(branchIndex)}>{"-"}</Button>
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item xs={12} md={3}>
                                                            <InputLabel htmlFor="branchId" sx={{ fontWeight: 500, marginBottom: 1 }}>{intl.formatMessage({ id: "branch" })}</InputLabel>
                                                            <CustomFormikSelect
                                                                name={`branches.${branchIndex}.id`}
                                                                placeholder={intl.formatMessage({ id: "selectX" }, { "x": intl.formatMessage({ id: "branch" }) })}
                                                                isClearable={true}
                                                                menuPosition={"fixed"}
                                                                isLoading={getBranchDropdownLoading}
                                                                zIndex={9999 - branchIndex}
                                                                menuPortalTarget={document.body}
                                                                value={
                                                                    branch.id
                                                                        ? (() => {
                                                                            const currency = allBranches.find(
                                                                                (item) => item.value === branch.id
                                                                            );
                                                                            return {
                                                                                label: currency?.label ?? "",
                                                                                value: { id: currency?.value, slug: currency?.field },
                                                                            };
                                                                        })()
                                                                        : null
                                                                }
                                                                onChange={(val: any, actionMeta) => {
                                                                    setFieldValue(`branches[${branchIndex}].id`, val?.value?.id ?? "");
                                                                    setFieldValue(`branches[${branchIndex}].slug`, val?.value?.field ?? "");
                                                                    setFieldValue(`branches[${branchIndex}].categoryId`, null);
                                                                }}

                                                                options={availableOptions?.map((item) => ({
                                                                    value: { id: item.value, field: item.field },
                                                                    label: item.label
                                                                }))}
                                                            />
                                                        </Grid>
                                                        <FoodRow branchIndex={branchIndex} branch={branch} setFieldValue={setFieldValue} />
                                                        <Grid item xs={12} md={3}>
                                                            <InputLabel htmlFor="currencyCode" sx={{ fontWeight: 500, marginBottom: 1 }}>{intl.formatMessage({ id: "currencyCode" })}</InputLabel>
                                                            <CustomFormikSelect
                                                                name={`branches[${branchIndex}].currencyCode`}
                                                                placeholder={intl.formatMessage({ id: "selectX" }, { "x": intl.formatMessage({ id: "currency" }) })}
                                                                isClearable={true}
                                                                menuPosition={"fixed"}
                                                                isLoading={getCurrencyDropdownLoading}
                                                                zIndex={9999 - branchIndex}
                                                                menuPortalTarget={document.body}
                                                                //size='sm'
                                                                value={
                                                                    branch.currencyCode
                                                                        ? (() => {
                                                                            const currency = getCurrencyDropdownData?.data?.find(
                                                                                (item) => item.value === branch.currencyCode
                                                                            );
                                                                            return {
                                                                                label: t(currency?.label) ?? "",
                                                                                value: currency?.value ?? "0",
                                                                            };
                                                                        })()
                                                                        : null
                                                                }
                                                                onChange={(val: any, actionMeta) => {
                                                                    setFieldValue(`branches[${branchIndex}].currencyCode`, val?.value ?? "");
                                                                }}

                                                                options={getCurrencyDropdownData?.data?.map((item) => ({
                                                                    value: item.value,
                                                                    label: t(item.label)
                                                                }))}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12} md={2}>
                                                            <InputLabel htmlFor="price" sx={{ fontWeight: 500, marginBottom: 1 }}>{intl.formatMessage({ id: "price" })}</InputLabel>
                                                            <Field name={`price`}>
                                                                {({ field, form, meta }: any) => (
                                                                    <CurrencyInput
                                                                        id="price"
                                                                        name={`branches[${branchIndex}].price`}
                                                                        placeholder={intl.formatMessage({ id: "amount" })}
                                                                        value={values.branches[branchIndex].price}
                                                                        //decimalsLimit={2}
                                                                        onValueChange={(value, name, values2) => {
                                                                            setFieldValue(`branches[${branchIndex}].price`, values2?.value)
                                                                        }}
                                                                        style={{
                                                                            width: "-webkit-fill-available",
                                                                            padding: 14,
                                                                            border: `1px solid ${(touched.branches && touched.branches[branchIndex]?.price) && (errors.branches && (errors.branches as FormikErrors<any>[])[0]?.price) ? "#F04134" : "#BEC8D0"}`,
                                                                            borderRadius: 8,
                                                                            color: "#1D2630",
                                                                            fontSize: "0.875rem",
                                                                            boxSizing: "content-box",
                                                                            height: "1.4375em",
                                                                            font: "inherit"
                                                                        }}
                                                                    />
                                                                )}
                                                            </Field>
                                                        </Grid>
                                                    </Grid>)
                                                })}
                                            </>
                                        )}
                                    </FieldArray>
                                </Grid>
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
                                                placeholder={intl.formatMessage({ id: "makeYourChoice" })}
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
                                        disabled={createFoodIsLoading}
                                        type="button" variant="contained" color="primary" onClick={() => { handleSubmit() }}>
                                        {(createFoodIsLoading) && <PuffLoader size={20} color='white' />}
                                        {(createFoodIsLoading == false) && intl.formatMessage({ id: "save" })}
                                    </Button>
                                </AnimateButton>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Dialog >
    )
}

export default AddFoodModal

const FoodRow = ({ branchIndex, setFieldValue, branch }: { branchIndex: number, setFieldValue: any, branch: Branch }) => {

    const intl = useIntl()
    const t = useLocalizedField()
    const branchSlug = branch.slug
    const {
        data: getCategoryDropdownData,
        isLoading: getCategoryDropdownLoading,
    } = useGetCategoryDropdownQuery(
        { branchSlug: branchSlug },
        { skip: !branchSlug } // branch seçilmeden çağırma
    )

    return (
        <>
            <Grid item xs={12} md={3}>
                <InputLabel htmlFor="branchId" sx={{ fontWeight: 500, marginBottom: 1 }}>{intl.formatMessage({ id: "category" })}</InputLabel>
                <CustomFormikSelect
                    name={`branches.${branchIndex}.categoryId`}
                    placeholder={intl.formatMessage({ id: "selectX" }, { "x": intl.formatMessage({ id: "category" }) })}
                    isClearable={true}
                    menuPosition={"fixed"}
                    isLoading={getCategoryDropdownLoading}
                    zIndex={9999 - branchIndex}
                    menuPortalTarget={document.body}
                    value={
                        branch.categoryId
                            ? (() => {
                                const branchItem = getCategoryDropdownData?.data?.find(
                                    (item) => item.value === branch.categoryId
                                );
                                return {
                                    label: t(branchItem?.label),
                                    value: branchItem?.value
                                };
                            })()
                            : null
                    }
                    onChange={(val: any) => {
                        setFieldValue(`branches[${branchIndex}].categoryId`, val?.value ?? "");
                    }}

                    options={getCategoryDropdownData?.data?.map((item) => ({
                        value: item.value,
                        label: t(item.label)
                    }))}
                />
            </Grid></>
    )
}
