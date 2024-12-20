import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { Form, Formik } from 'formik';
import { useLazyReadPatientQuery, useUpdatePatientMutation } from 'reduxt/features/patient/patient-api';
import CustomScaleLoader from 'components/CustomScaleLoader';
import { newPatientValidationSchema } from 'utils/schemas/patient-validation-schema';
import { Box, Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, TextField, Typography } from "@mui/material"
import { useIntl } from 'react-intl';
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';
import CustomFormikPhone from 'components/third-party/formik/custom-formik-phone';
import AnimateButton from 'components/@extended/AnimateButton';
import { PuffLoader } from 'react-spinners';
import { useLazyGetCityDropdownQuery, useLazyGetCountryDropdownQuery, useLazyGetDistrictDropdownQuery, useLazyGetGenderDropdownQuery } from 'reduxt/features/definition/definition-api';
import { useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';
import { PatientTabEnum } from 'reduxt/features/definition/patientTabSlice';
import { PatientCreateBodyModel } from 'reduxt/features/patient/models/patient-list-model';
import dayjs from 'dayjs';

const PatientPersonalInformation = ({ params }: { params: { slug: string } }) => {

    const intl = useIntl()
    const { data: { selectTab } } = useAppSelector((state: RootState) => state.patientTab);

    const [initialData, setInitialData] = useState<PatientCreateBodyModel>();

    const [getGenderList, {
        data: getGenderListData,
        isLoading: getGenderListLoading
    }] = useLazyGetGenderDropdownQuery();

    const [getCountryList, { data: getCountryListData,
        isLoading: getCountryLoading
    }] = useLazyGetCountryDropdownQuery();

    const [getCityList, {
        data: getCityListData,
        isLoading: getCityListLoading
    }] = useLazyGetCityDropdownQuery();

    const [getDistrictList, {
        data: getDistrictListData,
        isLoading: getDistrictListLoading
    }] = useLazyGetDistrictDropdownQuery();

    const [readPatient, {
        data: readPatientData,
        isLoading: readPatientLoading,
        isFetching: readPatientFetching
    }] = useLazyReadPatientQuery();

    const [updatePatient, { isLoading: updatePatientIsLoading, data: updatePatientResponse, error: updatePatientError }] = useUpdatePatientMutation();

    useEffect(() => {
        if (selectTab == PatientTabEnum.kisisel_bilgiler && params.slug) {
            var patientId = params.slug
            getGenderList();
            getCountryList();
            readPatient({ patient_id: patientId })
        }
    }, [params.slug])

    useEffect(() => {
        if (readPatientData?.data != null) {
            const model: PatientCreateBodyModel = {
                patient_id: readPatientData.data.patient_id,
                gender_id: readPatientData.data.gender_id,
                name: readPatientData.data.name,
                surname: readPatientData.data.surname,
                identity_number: readPatientData.data.identity_number,
                phone_code: readPatientData.data.phone_code,
                phone_number: readPatientData.data.phone_number,
                email: readPatientData.data.email,
                birthdate: readPatientData.data.birthdate,
                country_id: readPatientData.data.country_id,
                city_id: readPatientData.data.city_id,
                district_id: readPatientData.data.district_id,
                address: readPatientData.data.address,
                emergency_full_name: readPatientData.data.emergency_full_name,
                emergency_phone_code: readPatientData.data.emergency_phone_code,
                emergency_phone_number: readPatientData.data.emergency_phone_number,
                status: readPatientData.data.status
            }
            if (readPatientData.data.country_id != null) {
                getCityList({ country_id: readPatientData.data.country_id });
            }
            if (readPatientData.data.city_id != null) {
                getDistrictList({ city_id: readPatientData.data.city_id })
            }
            setInitialData(model);
        }
    }, [readPatientData])

    useEffect(() => {
        if (updatePatientResponse) {
            enqueueSnackbar(updatePatientResponse.message, {
                variant: updatePatientResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updatePatientResponse?.status == true) {
                //getPatientList({});
            }
        }
        if (updatePatientError) {
            var error = updatePatientError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updatePatientResponse, updatePatientError])

    return (
        <>{readPatientLoading || readPatientFetching ? <CustomScaleLoader /> : <Formik
            initialValues={initialData ?? {
                patient_id: undefined,
                gender_id: null,
                name: '',
                surname: '',
                identity_number: null,
                phone_code: '+90',
                phone_number: '',
                email: null,
                birthdate: null,
                country_id: null,
                city_id: null,
                district_id: null,
                address: null,
                emergency_full_name: null,
                emergency_phone_code: '+90',
                emergency_phone_number: null,
                status: true
            }}
            enableReinitialize
            validationSchema={newPatientValidationSchema}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                if (values.patient_id != null) {
                    updatePatient(values);
                }
            }}
        >
            {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                <Form>
                    <Box sx={{ px: 3, py: 3 }}>
                        <Typography variant="body2" marginBottom={"1.4rem"}>{"Zorunlu alanlar * ile belirtilmiştir."}</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "name" })}{"*"}</InputLabel>
                                    <OutlinedInput
                                        id="name"
                                        type="firstname"
                                        value={values.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder={intl.formatMessage({ id: "name" })}
                                        fullWidth
                                        error={Boolean(touched.name && errors.name)}
                                    />
                                </Stack>
                                {touched.name && errors.name && (
                                    <FormHelperText error id="helper-text-firstname-signup">
                                        {errors.name}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="lastname-signup">{intl.formatMessage({ id: "surname" })}{"*"}</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.surname && errors.surname)}
                                        id="lastname-signup"
                                        type="lastname"
                                        value={values.surname}
                                        name="surname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder={intl.formatMessage({ id: "surname" })}
                                        inputProps={{}}
                                    />
                                </Stack>
                                {touched.surname && errors.surname && (
                                    <FormHelperText error id="helper-text-lastname-signup">
                                        {errors.surname}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="gender">{intl.formatMessage({ id: "gender" })}</InputLabel>
                                    <CustomFormikSelect
                                        name='gender_id'
                                        placeholder="Cinsiyet Seçin"
                                        isClearable={true}
                                        isLoading={getGenderListLoading}
                                        zIndex={998}
                                        value={
                                            values.gender_id ? { label: getGenderListData?.data?.find((item) => item.value == values.gender_id)?.label ?? "", value: getGenderListData?.data?.find((item) => item.value == values.gender_id)?.value ?? 0 } : null}
                                        onChange={(val: any) => {
                                            setFieldValue("gender_id", val?.value ?? 0);
                                        }}

                                        options={getGenderListData?.data?.map((item) => ({
                                            value: item.value,
                                            label: item.label
                                        }))}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="lastname-signup">{intl.formatMessage({ id: "identityNumber" })}</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.identity_number && errors.identity_number)}
                                        id="identity_number"
                                        type="lastname"
                                        value={values.identity_number}
                                        name="identity_number"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder={intl.formatMessage({ id: "identityNumber" })}
                                        inputProps={{ maxLength: 11 }}
                                    />
                                </Stack>
                                {touched.identity_number && errors.identity_number && (
                                    <FormHelperText error id="helper-text-lastname-signup">
                                        {errors.identity_number}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomFormikPhone
                                    label={`${intl.formatMessage({ id: "phone" })}*`}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    valuePhoneCode={values.phone_code}
                                    valuePhoneNumber={values.phone_number}
                                    touchedPhoneNumber={touched.phone_number}
                                    errorPhoneNumber={errors.phone_number}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="email-signup">{intl.formatMessage({ id: "email" })}</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.email && errors.email)}
                                        id="person_email"
                                        type="email"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder={intl.formatMessage({ id: "email" })}
                                        inputProps={{}}
                                    />
                                </Stack>
                                {touched.email && errors.email && (
                                    <FormHelperText error id="helper-text-email-signup">
                                        {errors.email}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="birthdate">{intl.formatMessage({ id: "birthdate" })}</InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        error={Boolean(touched.birthdate && errors.birthdate)}
                                        id="birthdate"
                                        type="date"
                                        value={values.birthdate}
                                        name="birthdate"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder={intl.formatMessage({ id: "birthdate" })}
                                        inputProps={{ max: dayjs().format('YYYY-MM-DD') }}
                                    />
                                </Stack>
                                {touched.birthdate && errors.birthdate && (
                                    <FormHelperText error id="helper-text-email-signup">
                                        {errors.birthdate}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="company-signup">Ülke</InputLabel>
                                    <CustomFormikSelect
                                        name='country_id'
                                        placeholder="Seçim yapınız..."
                                        isLoading={getCountryLoading}
                                        zIndex={9995}
                                        options={getCountryListData?.data?.map((item) => ({
                                            value: item.value,
                                            label: item.label
                                        }))}
                                        value={
                                            values.country_id ? { label: getCountryListData?.data?.find((item) => item.value == values.country_id)?.label ?? "", value: getCountryListData?.data?.find((item) => item.value == values.country_id)?.value ?? 0 } : null}
                                        onChange={(val: any) => {
                                            setFieldValue("country_id", val?.value ?? 0);
                                            setFieldValue("city_id", null);
                                            getCityList({ country_id: val?.value })
                                        }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="company-signup">İl</InputLabel>
                                    <CustomFormikSelect
                                        name='city_id'
                                        placeholder="Seçim yapınız..."
                                        isLoading={getCityListLoading}
                                        value={
                                            values.city_id ? { label: getCityListData?.data?.find((item) => item.value == values.city_id)?.label ?? "", value: getCityListData?.data?.find((item) => item.value == values.city_id)?.value ?? 0 } : null}
                                        zIndex={9994}
                                        onChange={(val: any) => {
                                            setFieldValue("city_id", val?.value ?? 0);
                                            setFieldValue("district_id", null);
                                            getDistrictList({ city_id: val?.value })
                                        }}
                                        options={getCityListData?.data?.map((item) => ({
                                            value: item.value,
                                            label: item.label
                                        }))}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="company-signup">İlçe</InputLabel>
                                    <CustomFormikSelect
                                        name='district_id'
                                        placeholder="Seçim yapınız..."
                                        isLoading={getDistrictListLoading}
                                        zIndex={9993}
                                        value={
                                            values.district_id ? { label: getDistrictListData?.data?.find((item) => item.value == values.district_id)?.label ?? "", value: getDistrictListData?.data?.find((item) => item.value == values.district_id)?.value ?? 0 } : null}
                                        onChange={(val: any) => {
                                            setFieldValue("district_id", val?.value ?? 0);
                                        }}
                                        options={getDistrictListData?.data?.map((item) => ({
                                            value: item.value,
                                            label: item.label
                                        }))}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="personal-addrees1">Adres</InputLabel>
                                    <TextField
                                        multiline
                                        rows={1}
                                        fullWidth
                                        id="personal-addrees1"
                                        value={values.address}
                                        name="address"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder="Adres"
                                        error={Boolean(touched.address && errors.address)}
                                    />
                                </Stack>
                                {touched.address && errors.address && (
                                    <FormHelperText error id="personal-address-helper">
                                        {errors.address}
                                    </FormHelperText>
                                )}
                            </Grid>
                        </Grid>
                        <Typography variant="h5" marginTop={"1.4rem"} marginBottom={"1.4rem"}>{intl.formatMessage({ id: "additionalNearbyContactInformation" })}</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "nameSurname" })}</InputLabel>
                                    <OutlinedInput
                                        id="emergency_full_name"
                                        type="firstname"
                                        value={values.emergency_full_name}
                                        name="emergency_full_name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder={intl.formatMessage({ id: "nameSurname" })}
                                        fullWidth
                                        error={Boolean(touched.emergency_full_name && errors.emergency_full_name)}
                                    />
                                </Stack>
                                {touched.emergency_full_name && errors.emergency_full_name && (
                                    <FormHelperText error id="helper-text-firstname-signup">
                                        {errors.emergency_full_name}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomFormikPhone
                                    label={`${intl.formatMessage({ id: "phone" })}`}
                                    placeHolder={`${intl.formatMessage({ id: "phone" })}`}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    namePhoneCode="emergency_phone_code"
                                    namePhoneNumber="emergency_phone_number"
                                    valuePhoneCode={values.emergency_phone_code}
                                    valuePhoneNumber={values.emergency_phone_number}
                                    touchedPhoneNumber={touched.emergency_phone_number}
                                    errorPhoneNumber={errors.phone_number}
                                />
                            </Grid>
                        </Grid>
                        <Grid container marginTop={2} justifyContent={"end"}>
                            <AnimateButton>
                                <Button disableElevation disabled={isSubmitting || updatePatientIsLoading} type="submit" variant="contained" color="primary">
                                    {(updatePatientIsLoading) && <PuffLoader size={20} color='white' />}
                                    {(updatePatientIsLoading == false) && intl.formatMessage({ id: "save" })}
                                </Button>
                            </AnimateButton>
                        </Grid>
                    </Box>
                </Form>
            )}
        </Formik >}
        </>
    )
}

export default PatientPersonalInformation