"use client"

import { Box, Button, Dialog, DialogActions, FormControl, FormHelperText, Grid, InputLabel, MenuItem, OutlinedInput, Select, Stack, TextField, Typography } from "@mui/material"
import { Add, CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum, setModal } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import { useLazyGetDiseaseStatusDropdownQuery } from "reduxt/features/definition/definition-api";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import { newPatientDiseaseHistorySchema } from "utils/schemas/patient-validation-schema copy";
import { PatientDiseaseHistoryCreateBodyModel } from "reduxt/features/patient/models/patient-disease-history-model";
import { useCreatePatientDiseaseHistoryMutation, useLazyGetPatientDiseaseHistoryListQuery, useUpdatePatientDiseaseHistoryMutation } from "reduxt/features/patient/disease-history-api";

const AddPatientDiseaseHistoryModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<PatientDiseaseHistoryCreateBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    const [getPatientDiseaseHistoryList] = useLazyGetPatientDiseaseHistoryListQuery();

    const [getDiseaseStatus, {
        data: getDiseaseStatusData,
        isLoading: getDiseaseStatusLoading
    }] = useLazyGetDiseaseStatusDropdownQuery();

    const [createPatientDiseaseHistory, { isLoading: createPatientDiseaseHistoryIsLoading, data: createPatientDiseaseHistoryResponse, error: createPatientDiseaseHistoryError }] = useCreatePatientDiseaseHistoryMutation();

    const [updatePatientDiseaseHistory, { isLoading: updatePatientDiseaseHistoryIsLoading, data: updatePatientDiseaseHistoryResponse, error: updatePatientDiseaseHistoryError }] = useUpdatePatientDiseaseHistoryMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPatientDiseaseHistory) {
            getDiseaseStatus();
        }
    }, [open, id])

    useEffect(() => {
        if (data != null) {
            const model: PatientDiseaseHistoryCreateBodyModel = {
                patient_disease_history_id: data.patient_disease_history_id,
                patient_id: data.patient_id,
                disease_status_id: data.disease_status_id,
                name: data.name,
                start_date: data.start_date,
                end_date: data.end_date,
                status: data.status
            }
            setInitialData(model);
        }
    }, [data])

    useEffect(() => {
        if (createPatientDiseaseHistoryResponse) {
            enqueueSnackbar(createPatientDiseaseHistoryResponse.message, {
                variant: createPatientDiseaseHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createPatientDiseaseHistoryResponse?.status == true) {
                handleClose();
                getPatientDiseaseHistoryList({ patient_id: id });
            }
        }
        if (createPatientDiseaseHistoryError) {
            var error = createPatientDiseaseHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createPatientDiseaseHistoryResponse, createPatientDiseaseHistoryError])

    useEffect(() => {
        if (updatePatientDiseaseHistoryResponse) {
            enqueueSnackbar(updatePatientDiseaseHistoryResponse.message, {
                variant: updatePatientDiseaseHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updatePatientDiseaseHistoryResponse?.status == true) {
                handleClose();
                getPatientDiseaseHistoryList({ patient_id: id });
            }
        }
        if (updatePatientDiseaseHistoryError) {
            var error = updatePatientDiseaseHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updatePatientDiseaseHistoryResponse, updatePatientDiseaseHistoryError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.newPatientDiseaseHistory} onClose={handleClose}>
                {<Formik
                    initialValues={initialData ?? {
                        patient_disease_history_id: null,
                        patient_id: id,
                        disease_status_id: null,
                        name: '',
                        start_date: null,
                        end_date: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newPatientDiseaseHistorySchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.patient_disease_history_id != null) {
                            updatePatientDiseaseHistory(values);
                        } else {
                            createPatientDiseaseHistory(values);
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
                                        <Typography variant="h4" marginBottom={"1.4rem"}>{intl.formatMessage({ id: id != null ? "updateDiseaseHistory" : "addDiseaseHistory" })}</Typography>
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
                                            <InputLabel htmlFor="disease_status">{intl.formatMessage({ id: "diseaseStatus" })}{"*"}</InputLabel>
                                            <Select id="disease_status_id"
                                                placeholder="Hastalık Durumu"
                                                name="disease_status_id"
                                                value={values.disease_status_id}
                                                onChange={handleChange}>
                                                {getDiseaseStatusData?.data?.map((item) => (<MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>))}
                                            </Select>
                                        </Stack>
                                        {touched.disease_status_id && errors.disease_status_id && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.disease_status_id}
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
                                        <Button disableElevation disabled={isSubmitting || createPatientDiseaseHistoryIsLoading || updatePatientDiseaseHistoryIsLoading} type="submit" variant="contained" color="primary">
                                            {(createPatientDiseaseHistoryIsLoading || updatePatientDiseaseHistoryIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createPatientDiseaseHistoryIsLoading == false || updatePatientDiseaseHistoryIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddPatientDiseaseHistoryModal