"use client"

import { Autocomplete, Box, Button, Dialog, DialogActions, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, TextField, Typography } from "@mui/material"
import { CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useLazyGetTreatmentMethodDropdownQuery } from "reduxt/features/definition/definition-api";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import { newPatientMedicineHistorySchema } from "utils/schemas/patient-validation-schema copy";
import { useCreatePatientMedicineHistoryMutation, useUpdatePatientMedicineHistoryMutation } from "reduxt/features/patient/medicine-history-api";
import { PatientMedicineHistoryCreateBodyModel } from "reduxt/features/patient/models/patient-medicine-history-model";

const AddPatientMedicineHistoryModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<PatientMedicineHistoryCreateBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    //const [getPatientMedicineHistoryList] = useLazyGetPatientMedicineHistoryListQuery();

    const [getTreatmentMethod, {
        data: getTreatmentMethodData,
    }] = useLazyGetTreatmentMethodDropdownQuery();

    const [createPatientMedicineHistory, { isLoading: createPatientMedicineHistoryIsLoading, data: createPatientMedicineHistoryResponse, error: createPatientMedicineHistoryError }] = useCreatePatientMedicineHistoryMutation();

    const [updatePatientMedicineHistory, { isLoading: updatePatientMedicineHistoryIsLoading, data: updatePatientMedicineHistoryResponse, error: updatePatientMedicineHistoryError }] = useUpdatePatientMedicineHistoryMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPatientMedicineHistory) {
            getTreatmentMethod();
        }
    }, [open, id])

    useEffect(() => {
        if (data != null) {
            const model: PatientMedicineHistoryCreateBodyModel = {
                patient_medicine_history_id: data.patient_medicine_history_id,
                patient_id: data.patient_id,
                patient_disease_history_id: data.patient_disease_history_id,
                appointment_id: data.appointment_id,
                treatment_method_id: data.treatment_method_id,
                name: data.name,
                dosage: data.dosage,
                usage_period: data.usage_period,
                start_date: data.start_date,
                end_date: data.end_date,
                status: data.status
            }
            setInitialData(model);
        }
    }, [data])

    useEffect(() => {
        if (createPatientMedicineHistoryResponse) {
            enqueueSnackbar(createPatientMedicineHistoryResponse.message, {
                variant: createPatientMedicineHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createPatientMedicineHistoryResponse?.status == true) {
                handleClose();
                //getPatientMedicineHistoryList({ patient_id: id });
            }
        }
        if (createPatientMedicineHistoryError) {
            var error = createPatientMedicineHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createPatientMedicineHistoryResponse, createPatientMedicineHistoryError])

    useEffect(() => {
        if (updatePatientMedicineHistoryResponse) {
            enqueueSnackbar(updatePatientMedicineHistoryResponse.message, {
                variant: updatePatientMedicineHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updatePatientMedicineHistoryResponse?.status == true) {
                handleClose();
                //getPatientMedicineHistoryList({ patient_id: id });
            }
        }
        if (updatePatientMedicineHistoryError) {
            var error = updatePatientMedicineHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updatePatientMedicineHistoryResponse, updatePatientMedicineHistoryError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.newPatientMedicineHistory} onClose={handleClose}>
                {<Formik
                    initialValues={initialData ?? {
                        patient_medicine_history_id: null,
                        patient_id: id,
                        patient_disease_history_id: null,
                        appointment_id: null,
                        treatment_method_id: null,
                        name: '',
                        dosage: null,
                        usage_period: null,
                        start_date: null,
                        end_date: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newPatientMedicineHistorySchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.patient_medicine_history_id != null) {
                            updatePatientMedicineHistory(values);
                        } else {
                            createPatientMedicineHistory(values);
                        }
                    }}
                >
                    {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <Form>
                            <Box sx={{ px: 3, py: 3 }}>
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ borderBottom: '1px solid {theme.palette.divider}' }}
                                >
                                    <Grid item>
                                        <Typography variant="h4" marginBottom={"1.4rem"}>{intl.formatMessage({ id: data?.patient_medicine_history_id != null ? "updateMedicineHistory" : "addMedicineHistory" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={48} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
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
                                                inputProps={{maxLength: 100}}
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
                                            <InputLabel htmlFor="dosage">{intl.formatMessage({ id: "dosage" })}</InputLabel>
                                            <OutlinedInput
                                                id="dosage"
                                                type="firstname"
                                                value={values.dosage}
                                                name="dosage"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "dosage" })}
                                                fullWidth
                                                error={Boolean(touched.dosage && errors.dosage)}
                                                inputProps={{maxLength: 50}}
                                            />
                                        </Stack>
                                        {touched.dosage && errors.dosage && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.dosage}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="usage_period">{intl.formatMessage({ id: "usagePeriod" })}</InputLabel>
                                            <OutlinedInput
                                                id="usage_period"
                                                type="firstname"
                                                value={values.usage_period}
                                                name="usage_period" 
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "dosage" })}
                                                fullWidth
                                                error={Boolean(touched.usage_period && errors.usage_period)}
                                                inputProps={{maxLength: 50}}
                                            />
                                        </Stack>
                                        {touched.usage_period && errors.usage_period && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.usage_period}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="treatment_method_id">{intl.formatMessage({ id: "treatmentMethodName" })}</InputLabel>
                                            <Autocomplete
                                                fullWidth
                                                disablePortal
                                                onChange={handleChange}
                                                id="treatment_method_id"
                                                options={getTreatmentMethodData?.data ?? []}
                                                renderInput={(params) => <TextField {...params} placeholder={intl.formatMessage({id: "treatmentMethodName"})} />}
                                            />
                                        </Stack>
                                        {touched.treatment_method_id && errors.treatment_method_id && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.treatment_method_id}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="start_date">{intl.formatMessage({ id: "startDate" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.start_date && errors.start_date)}
                                                id="start_date"
                                                type="date"
                                                value={values.start_date}
                                                name="start_date"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "startDate" })}
                                            //inputProps={{ max: dayjs().format('YYYY-MM-DD') }}
                                            />
                                        </Stack>
                                        {touched.start_date && errors.start_date && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.start_date}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="end_date">{intl.formatMessage({ id: "endDate" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.end_date && errors.end_date)}
                                                id="end_date"
                                                type="date"
                                                value={values.end_date}
                                                name="end_date"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "endDate" })}
                                            //inputProps={{ max: dayjs().format('YYYY-MM-DD') }}
                                            />
                                        </Stack>
                                        {touched.end_date && errors.end_date && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.end_date}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting || createPatientMedicineHistoryIsLoading || updatePatientMedicineHistoryIsLoading} type="submit" variant="contained" color="primary">
                                            {(createPatientMedicineHistoryIsLoading || updatePatientMedicineHistoryIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createPatientMedicineHistoryIsLoading == false || updatePatientMedicineHistoryIsLoading == false) && intl.formatMessage({ id: "save" })}
                                        </Button>
                                    </AnimateButton>
                                </DialogActions>
                            </Box>
                        </Form>
                    )}
                </Formik >}
            </Dialog>
        </>
    )
}

export default AddPatientMedicineHistoryModal