"use client"

import { Box, Button, Dialog, DialogActions, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material"
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
import { newDieticianPatientMeasurementValidationSchema } from "utils/schemas/patient-validation-schema";
import dayjs from "dayjs";
import { CreateDieticianPatientMeasurementBodyModel } from "reduxt/features/patient/models/patient-measurement-list-model";
import useUser from "hooks/useUser";
import { useParams } from 'next/navigation';
import { useCreateDieticianPatientMeasurementMutation, useUpdateDieticianPatientMeasurementMutation } from "reduxt/features/patient/patient-measurement-api";

const AddPatientMeasurementModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const user = useUser();
    const params = useParams<{ slug: string }>()

    const [initialData, setInitialData] = useState<CreateDieticianPatientMeasurementBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    const [createDieticianPatientMeasurement, { isLoading: createDieticianPatientMeasurementIsLoading, data: createDieticianPatientMeasurementResponse, error: createDieticianPatientMeasurementError }] = useCreateDieticianPatientMeasurementMutation();

    const [updateDieticianPatientMeasurement, { isLoading: updateDieticianPatientMeasurementIsLoading, data: updateDieticianPatientMeasurementResponse, error: updateDieticianPatientMeasurementError }] = useUpdateDieticianPatientMeasurementMutation();


    useEffect(() => {
        if (data != null && modalType == ModalEnum.newMeasurement) {
            const model: CreateDieticianPatientMeasurementBodyModel = {
                measurement_id: data.measurement_id,
                appointment_id: data.appointment_id,
                person_id: data.person_id,
                patient_id: data.patient_id,
                height: data.height,
                weight: data.weight,
                bmi: data.bmi,
                waist: data.waist,
                hip: data.hip,
                whr: data.whr,
                chest: data.chest,
                measurement_date: data.measurement_date,
                status: data.status
            }
            setInitialData(model);
        }
    }, [data])

    useEffect(() => {
        if (createDieticianPatientMeasurementResponse) {
            enqueueSnackbar(createDieticianPatientMeasurementResponse.message, {
                variant: createDieticianPatientMeasurementResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createDieticianPatientMeasurementResponse?.status == true) {
                handleClose();
                //getPatientAllergyHistoryList({ patient_id: id });
            }
        }
        if (createDieticianPatientMeasurementError) {
            var error = createDieticianPatientMeasurementError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createDieticianPatientMeasurementResponse, createDieticianPatientMeasurementError])

    useEffect(() => {
        if (updateDieticianPatientMeasurementResponse) {
            enqueueSnackbar(updateDieticianPatientMeasurementResponse.message, {
                variant: updateDieticianPatientMeasurementResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateDieticianPatientMeasurementResponse?.status == true) {
                handleClose();
                //getPatientAllergyHistoryList({ patient_id: id });
            }
        }
        if (updateDieticianPatientMeasurementError) {
            var error = updateDieticianPatientMeasurementError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateDieticianPatientMeasurementResponse, updateDieticianPatientMeasurementError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.newMeasurement} onClose={handleClose}>
                {<Formik
                    initialValues={initialData ?? {
                        measurement_id: undefined,
                        appointment_id: null,
                        person_id: user ? user?.id : null,
                        patient_id: params.slug,
                        weight: "0",
                        height: null,
                        bmi: 0,
                        waist: null,
                        hip: null,
                        chest: null,
                        whr: null,
                        measurement_date: dayjs().format("YYYY-MM-DD"),
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newDieticianPatientMeasurementValidationSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        const model: CreateDieticianPatientMeasurementBodyModel = {
                            ...values,
                            weight: values.weight != null ? values.weight.toString() : null,
                            height: values.height != null ? values.height.toString() : null,
                            //waist: values.waist && typeof values.waist == "number" ? values.waist.toFixed(2) : values.waist.toString(),
                            waist: values.waist != null ? values.waist.toString() : null,
                            //hip: values.hip && typeof values.hip == "number" ? values.hip.toFixed(2) : values.hip.toString(),
                            hip: values.hip != null ? values.hip.toString() : null,
                            //chest: values.chest && typeof values.chest == "number" ? values.chest.toFixed(2) : values.chest.toString(),
                            chest: values.chest != null ? values.chest.toString() : null,
                            whr: "0",
                            bmi: "0",
                        }
                        if (values.measurement_id != null) {
                            updateDieticianPatientMeasurement(model);
                        } else {
                            createDieticianPatientMeasurement(model);
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
                                        <Typography variant="h4" marginBottom={"1.4rem"}>{intl.formatMessage({ id: data?.patient_medicine_history_id != null ? "updateMeasurement" : "newMeasurement" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={48} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Typography variant="body2" marginBottom={"1.4rem"}>{"Zorunlu alanlar * ile belirtilmiştir."}</Typography>
                                <Grid container spacing={3} marginBottom={1}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "weight" })}{"*"}</InputLabel>
                                            <OutlinedInput
                                                id="name"
                                                type="number"
                                                value={values.weight}
                                                name="weight"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "weight" })}
                                                fullWidth
                                                error={Boolean(touched.weight && errors.weight)}
                                                inputProps={{ min: 0, max: 250, step: "0.01" }}
                                            />
                                        </Stack>
                                        {touched.weight && errors.weight && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.weight}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "height" })}</InputLabel>
                                            <OutlinedInput
                                                id="name"
                                                type="number"
                                                value={values.height}
                                                name="height"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "height" })}
                                                fullWidth
                                                error={Boolean(touched.height && errors.height)}
                                                inputProps={{ min: 0, max: 250 }}
                                            />
                                        </Stack>
                                        {touched.height && errors.height && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.height}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3} marginBottom={1}>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "waist" })}</InputLabel>
                                            <OutlinedInput
                                                id="waist"
                                                type="number"
                                                value={values.waist}
                                                name="waist"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "waist" })}
                                                fullWidth
                                                error={Boolean(touched.waist && errors.waist)}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Stack>
                                        {touched.waist && errors.waist && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.waist}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "hip" })}</InputLabel>
                                            <OutlinedInput
                                                id="hip"
                                                type="number"
                                                value={values.hip}
                                                name="hip"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "hip" })}
                                                fullWidth
                                                error={Boolean(touched.hip && errors.hip)}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Stack>
                                        {touched.hip && errors.hip && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.hip}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="firstname-signup">{intl.formatMessage({ id: "chest" })}</InputLabel>
                                            <OutlinedInput
                                                id="chest"
                                                type="number"
                                                value={values.chest}
                                                name="chest"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "chest" })}
                                                fullWidth
                                                error={Boolean(touched.chest && errors.chest)}
                                                inputProps={{ min: 0 }}
                                            />
                                        </Stack>
                                        {touched.chest && errors.chest && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.chest}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="measurement_date">{intl.formatMessage({ id: "measurementDate" })}</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(touched.measurement_date && errors.measurement_date)}
                                            id="measurement_date"
                                            type="date"
                                            value={dayjs(values.measurement_date).format('YYYY-MM-DD')}
                                            name="measurement_date"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder={intl.formatMessage({ id: "measurementDate" })}
                                        //inputProps={{ max: dayjs().format('YYYY-MM-DD') }}
                                        />
                                    </Stack>
                                    {touched.measurement_date && errors.measurement_date && (
                                        <FormHelperText error id="helper-text-email-signup">
                                            {errors.measurement_date}
                                        </FormHelperText>
                                    )}
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting || createDieticianPatientMeasurementIsLoading || updateDieticianPatientMeasurementIsLoading} type="submit" variant="contained" color="primary">
                                            {(createDieticianPatientMeasurementIsLoading || updateDieticianPatientMeasurementIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createDieticianPatientMeasurementIsLoading == false || updateDieticianPatientMeasurementIsLoading == false) && intl.formatMessage({ id: "save" })}
                                        </Button>
                                    </AnimateButton>
                                </DialogActions>
                            </Box>
                        </Form>
                    )}
                </Formik >}
            </Dialog >
        </>
    )
}

export default AddPatientMeasurementModal