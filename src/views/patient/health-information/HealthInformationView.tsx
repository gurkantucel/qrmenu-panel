import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import CustomScaleLoader from 'components/CustomScaleLoader';
import MainCard from 'components/MainCard'
import CustomFormikSelect from 'components/third-party/formik/custom-formik-select';
import { Form, Formik } from 'formik';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { PuffLoader } from 'react-spinners';
import { useLazyGetBloodTypeDropdownQuery } from 'reduxt/features/definition/definition-api';
import { PatientTabEnum } from 'reduxt/features/definition/patientTabSlice';
import { useLazyGetPatientHealthInformationQuery, useUpdatePatientHealthInformationMutation } from 'reduxt/features/patient/health-information-api';
import { PatientHealtInformationUpdateBodyModel } from 'reduxt/features/patient/models/patient-health-information-model';
import { useAppSelector } from 'reduxt/hooks';
import { RootState } from 'reduxt/store';

const HealthInformationView = ({ params }: { params: { slug: string } }) => {
    const { data: { selectTab } } = useAppSelector((state: RootState) => state.patientTab);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<PatientHealtInformationUpdateBodyModel>();

    const [boxHeight, setBoxHeight] = useState(350);

    const [getPatientHealthInformation, {
        data: getPatientHealthInformationData,
        isFetching: isPatientHealthInformationFetching,
        isLoading: isPatientHealthInformationLoading
    }] = useLazyGetPatientHealthInformationQuery();

    useEffect(() => {
        if (selectTab == PatientTabEnum.saglik_bilgileri) {
            getPatientHealthInformation({ patient_id: params.slug })
            getBloodTypeList();
        }
    }, [selectTab])


    const [getBloodTypeList, {
        data: getBloodTypeListData,
        isLoading: getBloodTypeListIsLoading
    }] = useLazyGetBloodTypeDropdownQuery();

    useEffect(() => {
        if (getPatientHealthInformationData?.data != null) {
            const model: PatientHealtInformationUpdateBodyModel = {
                patient_health_information_id: getPatientHealthInformationData?.data.person_health_information_id,
                patient_id: getPatientHealthInformationData?.data.patient_id,
                blood_type_id: getPatientHealthInformationData?.data.blood_type_id,
                height: parseFloat(getPatientHealthInformationData?.data?.height),
                weight: parseFloat(getPatientHealthInformationData?.data?.weight),
                status: getPatientHealthInformationData?.data.status,
            }
            setInitialData(model);
        }
    }, [getPatientHealthInformationData])

    const [updatePatientHealthInformation, { isLoading: updatePatientHealthInformationIsLoading, data: updatePatientHealthInformationResponse, error: updatePatientHealthInformationError }] = useUpdatePatientHealthInformationMutation();

    useEffect(() => {
        if (updatePatientHealthInformationResponse) {
            enqueueSnackbar(updatePatientHealthInformationResponse.message, {
                variant: updatePatientHealthInformationResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
        if (updatePatientHealthInformationError) {
            var error = updatePatientHealthInformationError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updatePatientHealthInformationResponse, updatePatientHealthInformationError])

    return (
        <MainCard
            sx={{ marginBottom: 3, height: boxHeight }}
            title={intl.formatMessage({ id: "healthInformation" })}
        >
            {isPatientHealthInformationFetching || isPatientHealthInformationLoading ? <CustomScaleLoader /> : <Formik
                initialValues={initialData ?? {
                    patient_health_information_id: null,
                    patient_id: null,
                    blood_type_id: null,
                    height: null,
                    weight: null,
                    status: true
                }}
                enableReinitialize
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    updatePatientHealthInformation(values);
                }}
            >
                {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="blood_type_id">{intl.formatMessage({ id: "bloodGroup" })}</InputLabel>
                                    <CustomFormikSelect
                                        name='blood_type_id'
                                        placeholder="Seçim yapınız..."
                                        isLoading={getBloodTypeListIsLoading}
                                        zIndex={9999}
                                        onMenuOpen={()=>{
                                            setBoxHeight(520)
                                        }}
                                        onMenuClose={()=>{
                                            setBoxHeight(350)
                                        }}
                                        options={getBloodTypeListData?.data?.map((item) => ({
                                            value: item.value,
                                            label: item.label
                                        }))}
                                        value={
                                            values.blood_type_id ? { label: getBloodTypeListData?.data?.find((item) => item.value == values.blood_type_id)?.label ?? "", value: getBloodTypeListData?.data?.find((item) => item.value == values.blood_type_id)?.value ?? 0 } : null}
                                        onChange={(val: any) => {
                                            setFieldValue("blood_type_id", val?.value ?? 0);
                                        }}
                                    />
                                </Stack>
                                {touched.blood_type_id && errors.blood_type_id && (
                                    <FormHelperText error id="helper-text-blood_type_id">
                                        {errors.blood_type_id}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "height" })}</InputLabel>
                                    <OutlinedInput
                                        id="height"
                                        type="number"
                                        value={values.height}
                                        name="height"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder={intl.formatMessage({ id: "height" })}
                                        fullWidth
                                        error={Boolean(touched.height && errors.height)}
                                        inputProps={{ min: 0 }}
                                    />
                                </Stack>
                                {touched.height && errors.height && (
                                    <FormHelperText error id="helper-text-firstname-signup">
                                        {errors.height}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Stack spacing={1}>
                                    <InputLabel htmlFor="weight">{intl.formatMessage({ id: "weight" })}</InputLabel>
                                    <OutlinedInput
                                        id="weight"
                                        type="number"
                                        value={values.weight}
                                        name="weight"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        placeholder={intl.formatMessage({ id: "weight" })}
                                        fullWidth
                                        error={Boolean(touched.weight && errors.weight)}
                                        inputProps={{ min: 0 }}
                                    />
                                </Stack>
                                {touched.weight && errors.weight && (
                                    <FormHelperText error id="helper-text-weight">
                                        {errors.weight}
                                    </FormHelperText>
                                )}
                            </Grid>
                            <Grid container justifyContent={"end"} marginTop={2}>
                                <AnimateButton>
                                    <Button disableElevation disabled={isSubmitting || updatePatientHealthInformationIsLoading} type="submit" variant="contained" color="primary">
                                        {(updatePatientHealthInformationIsLoading) && <PuffLoader size={20} color='white' />}
                                        {(updatePatientHealthInformationIsLoading == false) && intl.formatMessage({ id: "save" })}
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </Form>)}
            </Formik>}
        </MainCard >
    )
}

export default HealthInformationView