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
import { newPatientAllergyHistorySchema } from "utils/schemas/patient-validation-schema";
import { useCreatePatientAllergyHistoryMutation, useUpdatePatientAllergyHistoryMutation } from "reduxt/features/patient/allergy-history-api";
import { PatientAllergyHistoryCreateBodyModel } from "reduxt/features/patient/models/patient-allergy-history-model";
import dayjs from "dayjs";

const AddPatientAllergyHistoryModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<PatientAllergyHistoryCreateBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    //const [getPatientAllergyHistoryList] = useLazyGetPatientAllergyHistoryListQuery();

    const [createPatientAllergyHistory, { isLoading: createPatientAllergyHistoryIsLoading, data: createPatientAllergyHistoryResponse, error: createPatientAllergyHistoryError }] = useCreatePatientAllergyHistoryMutation();

    const [updatePatientAllergyHistory, { isLoading: updatePatientAllergyHistoryIsLoading, data: updatePatientAllergyHistoryResponse, error: updatePatientAllergyHistoryError }] = useUpdatePatientAllergyHistoryMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPatientAllergyHistory) {

        }
    }, [open, id])

    useEffect(() => {
        if (data != null && modalType == ModalEnum.newPatientAllergyHistory) {
            const model: PatientAllergyHistoryCreateBodyModel = {
                patient_allergy_history_id: data.patient_allergy_history_id,
                patient_id: data.patient_id,
                name: data.name,
                complications: data.complications,
                start_date: data.start_date != null ? dayjs(data.start_date).format("YYYY-MM-DD") : null,
                end_date: data.end_date != null ? dayjs(data.end_date).format("YYYY-MM-DD") : null,
                status: data.status
            }
            setInitialData(model);
        }
    }, [data])

    useEffect(() => {
        if (createPatientAllergyHistoryResponse) {
            enqueueSnackbar(createPatientAllergyHistoryResponse.message, {
                variant: createPatientAllergyHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createPatientAllergyHistoryResponse?.status == true) {
                handleClose();
                //getPatientAllergyHistoryList({ patient_id: id });
            }
        }
        if (createPatientAllergyHistoryError) {
            var error = createPatientAllergyHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createPatientAllergyHistoryResponse, createPatientAllergyHistoryError])

    useEffect(() => {
        if (updatePatientAllergyHistoryResponse) {
            enqueueSnackbar(updatePatientAllergyHistoryResponse.message, {
                variant: updatePatientAllergyHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updatePatientAllergyHistoryResponse?.status == true) {
                handleClose();
                //getPatientAllergyHistoryList({ patient_id: id });
            }
        }
        if (updatePatientAllergyHistoryError) {
            var error = updatePatientAllergyHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updatePatientAllergyHistoryResponse, updatePatientAllergyHistoryError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.newPatientAllergyHistory} onClose={handleClose}>
                {<Formik
                    initialValues={initialData ?? {
                        patient_allergy_history_id: null,
                        patient_id: id,
                        name: '',
                        complications: null,
                        start_date: null,
                        end_date: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newPatientAllergyHistorySchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.patient_allergy_history_id != null) {
                            updatePatientAllergyHistory(values);
                        } else {
                            createPatientAllergyHistory(values);
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
                                        <Typography variant="h4" marginBottom={"1.4rem"}>{intl.formatMessage({ id: data?.patient_medicine_history_id != null ? "updateAllergyHistory" : "addAllergyHistory" })}</Typography>
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
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="complications">{intl.formatMessage({ id: "complications" })}</InputLabel>
                                            <OutlinedInput
                                                id="complications"
                                                type="text"
                                                value={values.complications}
                                                name="complications"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "complications" })}
                                                fullWidth
                                                error={Boolean(touched.complications && errors.complications)}
                                                inputProps={{ maxLength: 50 }}
                                            />
                                        </Stack>
                                        {touched.complications && errors.complications && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.complications}
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
                                                value={dayjs(values.start_date).format('YYYY-MM-DD')}
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
                                                value={dayjs(values.end_date).format('YYYY-MM-DD')}
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
                                        <Button disableElevation disabled={isSubmitting || createPatientAllergyHistoryIsLoading || updatePatientAllergyHistoryIsLoading} type="submit" variant="contained" color="primary">
                                            {(createPatientAllergyHistoryIsLoading || updatePatientAllergyHistoryIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createPatientAllergyHistoryIsLoading == false || updatePatientAllergyHistoryIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddPatientAllergyHistoryModal