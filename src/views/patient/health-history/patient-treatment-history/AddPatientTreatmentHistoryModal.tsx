"use client"

import { Box, Button, Dialog, DialogActions, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select, Stack, Typography } from "@mui/material"
import { CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import { useLazyGetDiseaseHistoryDropdownQuery } from "reduxt/features/patient/disease-history-api";
import { PatientTreatmentHistoryCreateBodyModel } from "reduxt/features/patient/models/patient-treatment-history-model";
import { useCreatePatientTreatmentHistoryMutation, useUpdatePatientTreatmentHistoryMutation } from "reduxt/features/patient/treatment-history-api";
import { newPatientTreatmentHistorySchema } from "utils/schemas/patient-validation-schema";

const AddPatientTreatmentHistoryModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<PatientTreatmentHistoryCreateBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    //const [getPatientMedicineHistoryList] = useLazyGetPatientMedicineHistoryListQuery();

    const [getDiseaseHistory, {
        data: getDiseaseHistoryData,
    }] = useLazyGetDiseaseHistoryDropdownQuery();

    const [createPatientTreatmentHistory, { isLoading: createPatientTreatmentHistoryIsLoading, data: createPatientTreatmentHistoryResponse, error: createPatientTreatmentHistoryError }] = useCreatePatientTreatmentHistoryMutation();

    const [updatePatientTreatmentHistory, { isLoading: updatePatientTreatmentHistoryIsLoading, data: updatePatientTreatmentHistoryResponse, error: updatePatientTreatmentHistoryError }] = useUpdatePatientTreatmentHistoryMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPatientTreatmentHistory) {
            getDiseaseHistory({ patient_id: id });
        }
    }, [open, id])

    useEffect(() => {
        if (data != null) {
            const model: PatientTreatmentHistoryCreateBodyModel = {
                patient_treatment_history_id: data.patient_treatment_history_id,
                patient_id: data.patient_id,
                patient_disease_history_id: data.patient_disease_history_id,
                appointment_id: data.appointment_id,
                name: data.name,
                treatment_date: data.treatment_date,
                complications: data.complications,
                status: data.status
            }
            setInitialData(model);
        }
    }, [data])

    useEffect(() => {
        if (createPatientTreatmentHistoryResponse) {
            enqueueSnackbar(createPatientTreatmentHistoryResponse.message, {
                variant: createPatientTreatmentHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createPatientTreatmentHistoryResponse?.status == true) {
                handleClose();
                //getPatientMedicineHistoryList({ patient_id: id });
            }
        }
        if (createPatientTreatmentHistoryError) {
            var error = createPatientTreatmentHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createPatientTreatmentHistoryResponse, createPatientTreatmentHistoryError])

    useEffect(() => {
        if (updatePatientTreatmentHistoryResponse) {
            enqueueSnackbar(updatePatientTreatmentHistoryResponse.message, {
                variant: updatePatientTreatmentHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updatePatientTreatmentHistoryResponse?.status == true) {
                handleClose();
                //getPatientMedicineHistoryList({ patient_id: id });
            }
        }
        if (updatePatientTreatmentHistoryError) {
            var error = updatePatientTreatmentHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updatePatientTreatmentHistoryResponse, updatePatientTreatmentHistoryError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.newPatientTreatmentHistory} onClose={handleClose}>
                {<Formik
                    initialValues={initialData ?? {
                        patient_treatment_history_id: null,
                        patient_id: id,
                        patient_disease_history_id: null,
                        appointment_id: null,
                        name: '',
                        treatment_date: null,
                        complications: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newPatientTreatmentHistorySchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.patient_treatment_history_id != null) {
                            updatePatientTreatmentHistory(values);
                        } else {
                            createPatientTreatmentHistory(values);
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
                                        <Typography variant="h4" marginBottom={"1.4rem"}>{intl.formatMessage({ id: data?.patient_disease_history_id != null ? "updatePatientTreatmentHistory" : "addPatientTreatmentHistory" })}</Typography>
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
                                                inputProps={{ maxLength: 100 }}
                                            />
                                        </Stack>
                                        {touched.name && errors.name && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.name}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="patient_disease_history">{intl.formatMessage({ id: "diseaseHistory" })}</InputLabel>
                                            <Select id="patient_disease_history_id"
                                                placeholder={intl.formatMessage({ id: "diseaseHistory" })}
                                                name="patient_disease_history_id"
                                                value={values.patient_disease_history_id}
                                                onChange={handleChange}>
                                                {getDiseaseHistoryData?.data?.map((item) => (<MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>))}
                                            </Select>
                                        </Stack>
                                        {touched.patient_disease_history_id && errors.patient_disease_history_id && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.patient_disease_history_id}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="treatment_date">{intl.formatMessage({ id: "treatmentDate" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.treatment_date && errors.treatment_date)}
                                                id="treatment_date"
                                                type="date"
                                                value={values.treatment_date}
                                                name="treatment_date"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "treatmentDate" })}
                                            //inputProps={{ max: dayjs().format('YYYY-MM-DD') }}
                                            />
                                        </Stack>
                                        {touched.treatment_date && errors.treatment_date && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.treatment_date}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="complications">{intl.formatMessage({ id: "complications" })}</InputLabel>
                                            <OutlinedInput
                                                id="complications"
                                                type="firstname"
                                                value={values.complications}
                                                name="complications"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "complications" })}
                                                fullWidth
                                                rows={2}
                                                error={Boolean(touched.complications && errors.complications)}
                                                inputProps={{ maxLength: 500 }}
                                            />
                                        </Stack>
                                        {touched.complications && errors.complications && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.name}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting || createPatientTreatmentHistoryIsLoading || updatePatientTreatmentHistoryIsLoading} type="submit" variant="contained" color="primary">
                                            {(createPatientTreatmentHistoryIsLoading || updatePatientTreatmentHistoryIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createPatientTreatmentHistoryIsLoading == false || updatePatientTreatmentHistoryIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddPatientTreatmentHistoryModal