import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl';
import { useAppDispatch, useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { Box, Button, Dialog, DialogActions, FormHelperText, Grid, IconButton, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material"
import { CloseSquare, Facebook, Instagram, Whatsapp } from "iconsax-react"
import { closeModal, ModalEnum } from 'reduxt/features/definition/modalSlice';
import { Form, Formik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';
import AnimateButton from 'components/@extended/AnimateButton';
import { useLocalizedField } from 'hooks/useLocalizedField';
import { UpdateBranchBodyModel } from 'reduxt/features/branch/models/branch-model';
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';
import { useGetCountryDropdownQuery } from 'reduxt/features/common/common-api';
import CustomFormikPhone from 'components/third-party/formik/custom-formik-phone';
import XIcon from 'components/XIcon';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import { useUpdateBranchMutation } from 'reduxt/features/branch/branch-api';
import { updateBranchValidationSchema } from 'utils/schemas/branch-validation-schema';

const UpdateBranchModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const t = useLocalizedField()

    const [initialValues, setInitialValues] = useState<UpdateBranchBodyModel | null>({
        branchId: "",
        title: "",
        country: "",
        province: "",
        district: "",
        address: "",
        phoneCode: "",
        phone: "",
        email: "",
        description: "",
    })

    const { isLoading: getCountryDropdownLoading, data: getCountryDropdownData } = useGetCountryDropdownQuery(undefined, { skip: modalType != ModalEnum.updateBranch })


    const [updateBranch, { isLoading: updateBranchIsLoading, data: updateBranchResponse, error: updateBranchError }] = useUpdateBranchMutation();

    useEffect(() => {
        if (open && modalType == ModalEnum.updateBranch && data != null) {
            const newModel: UpdateBranchBodyModel = {
                branchId: data?.id,
                title: data?.title,
                country: data?.country,
                province: data?.province,
                district: data?.district,
                address: data?.address,
                phoneCode: data?.phoneCode,
                phone: data?.phone,
                email: data?.email,
                description: data?.description,
                social: !data?.social ||
                    Object.values(data.social).every((v) => v == null || v === undefined)
                    ? null
                    : {
                        whatsapp: data?.social?.whatsapp,
                        facebook: data?.social?.facebook,
                        instagram: data?.social?.instagram,
                        x: data?.social?.x,
                    }
            }
            setInitialValues(newModel);
        }
    }, [open, modalType, data])

    useEffect(() => {
        if (updateBranchResponse) {
            enqueueSnackbar(updateBranchResponse.message, {
                variant: updateBranchResponse?.success == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateBranchResponse?.success == true) {
                handleClose();
            }
        }
        if (updateBranchError) {
            const error = updateBranchError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateBranchResponse, updateBranchError])

    const handleClose = () => {
        dispatch(closeModal())
        setInitialValues(null)
    };

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.updateBranch} onClose={handleClose} maxWidth={"lg"}>
                <Box sx={{ px: 3, py: 3 }}>
                    <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                    >
                        <Grid item>
                            <Typography variant="h4">{`${data?.title} - ${intl.formatMessage({ id: "update" })}`}</Typography>
                        </Grid>
                        <Grid item sx={{ mr: 1.5 }}>
                            <IconButton color="secondary" onClick={handleClose}>
                                <CloseSquare size={36} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Formik initialValues={initialValues ?? {
                        "branchId": "",
                        "title": "",
                        "country": "",
                        "province": "",
                        "district": "",
                        "address": "",
                        "phoneCode": "",
                        "phone": "",
                        "email": "",
                        "description": "",
                        "social": {
                            "instagram": "",
                            "facebook": "",
                            "x": "",
                            "whatsapp": "",
                            "youtube": ""
                        },
                        "status": true
                    }}
                        enableReinitialize
                        validationSchema={updateBranchValidationSchema(intl)}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            updateBranch(values);
                        }}>
                        {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <Form>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="title">{intl.formatMessage({ id: "title" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.title && errors.title)}
                                                id="title"
                                                type="text"
                                                value={values.title}
                                                name="title"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "title" })}
                                            />
                                        </Stack>
                                        {touched.title && errors.title && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.title}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="title">{intl.formatMessage({ id: "country" })}</InputLabel>
                                            <CustomFormikSelect
                                                name='country'
                                                placeholder="Ülke Seçin"
                                                isClearable={true}
                                                isLoading={getCountryDropdownLoading}
                                                zIndex={998}
                                                value={getCountryDropdownData?.data?.filter((item) =>
                                                    values.country == item.label
                                                )
                                                    .map((item2) => ({
                                                        value: item2.value,
                                                        label: item2.label,
                                                    }))}
                                                onChange={(val: any) => {
                                                    setFieldValue("country", val?.label ?? "0");
                                                }}

                                                options={getCountryDropdownData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="province">{intl.formatMessage({ id: "province" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.province && errors.province)}
                                                id="province"
                                                type="text"
                                                value={values.province}
                                                name="province"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "province" })}
                                            />
                                        </Stack>
                                        {touched.province && errors.province && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.province}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="district">{intl.formatMessage({ id: "district" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.district && errors.district)}
                                                id="district"
                                                type="text"
                                                value={values.district}
                                                name="district"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "district" })}
                                            />
                                        </Stack>
                                        {touched.district && errors.district && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.district}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="province">{intl.formatMessage({ id: "address" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.address && errors.address)}
                                                id="address"
                                                rows={2}
                                                type="text"
                                                value={values.address}
                                                name="address"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "address" })}
                                            />
                                        </Stack>
                                        {touched.address && errors.address && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.address}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <CustomFormikPhone
                                            label={`${intl.formatMessage({ id: "phone" })}*`}
                                            handleBlur={handleBlur}
                                            handleChange={handleChange}
                                            namePhoneCode="phoneCode"
                                            valuePhoneCode={values.phoneCode}
                                            namePhoneNumber="phone"
                                            valuePhoneNumber={values.phone}
                                            touchedPhoneNumber={touched.phone}
                                            errorPhoneNumber={errors.phone}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="email">{intl.formatMessage({ id: "email" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.email && errors.email)}
                                                id="email"
                                                type="text"
                                                value={values.email}
                                                name="email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "email" })}
                                            />
                                        </Stack>
                                        {touched.email && errors.email && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {errors.email}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <Typography marginY={3} variant='h5'>Sosyal Medya Hesapları</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <Stack direction={"row"} spacing={1}>
                                                <Whatsapp />
                                                <InputLabel htmlFor="whatsapp">{"WhatsApp"}</InputLabel>
                                            </Stack>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean((touched.social as any)?.whatsapp && (errors.social as any)?.whatsapp)}
                                                id="social.whatsapp"
                                                type="phone"
                                                value={values.social?.whatsapp}
                                                name="social.whatsapp"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={"WhatsApp"}
                                            />
                                        </Stack>
                                        {(touched.social as any)?.whatsapp && (errors.social as any)?.whatsapp && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {(errors.social as any).whatsapp}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <Stack direction={"row"} spacing={1}>
                                                <Facebook />
                                                <InputLabel htmlFor="email">{"Facebook"}</InputLabel>
                                            </Stack>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean((touched.social as any)?.facebook && (errors.social as any)?.facebook)}
                                                id="social.facebook"
                                                type="text"
                                                value={values.social?.facebook}
                                                name="social.facebook"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={"https://facebook.com/...."}
                                            />
                                        </Stack>
                                        {(touched.social as any)?.facebook && (errors.social as any)?.facebook && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {(errors.social as any).facebook}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <Stack direction={"row"} spacing={1}>
                                                <Instagram />
                                                <InputLabel htmlFor="email">{"Instagram"}</InputLabel>
                                            </Stack>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean((touched.social as any)?.instagram && (errors.social as any)?.instagram)}
                                                id="social.instagram"
                                                type="text"
                                                value={values.social?.instagram}
                                                name="social.instagram"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={"https://instagram.com/...."}
                                            />
                                        </Stack>
                                        {(touched.social as any)?.instagram && (errors.social as any)?.instagram && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {(errors.social as any).instagram}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <Stack direction={"row"} spacing={1}>
                                                <XIcon width='22' height='24' />
                                                <InputLabel htmlFor="x">{"X"}</InputLabel>
                                            </Stack>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean((touched.social as any)?.x && (errors.social as any)?.x)}
                                                id="social.x"
                                                type="text"
                                                value={values.social?.x}
                                                name="social.x"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={"https://x.com/...."}
                                            />
                                        </Stack>
                                        {(touched.social as any)?.x && (errors.social as any)?.x && (
                                            <FormHelperText error id="helper-text-lastname-signup">
                                                {(errors.social as any).x}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <InputLabel htmlFor="description">{intl.formatMessage({ id: "aboutUs" })}</InputLabel>
                                        <ReactQuill theme="snow" value={values.description}
                                            modules={{
                                                toolbar: [
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                                                ]
                                            }}
                                            onChange={(value, delta, source, editor) => {
                                                setFieldValue("description", editor.getHTML());
                                            }} />
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation
                                            disabled={updateBranchIsLoading}
                                            type="button" variant="contained" color="primary" onClick={() => { handleSubmit() }}>
                                            {(updateBranchIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(updateBranchIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default UpdateBranchModal