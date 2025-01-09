"use client"

import {Box, Button, Dialog, DialogActions, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material"
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
import { newPatientInjectionHistorySchema } from "utils/schemas/patient-validation-schema";
import { PatientInjectionHistoryCreateBodyModel } from "reduxt/features/patient/models/patient-injection-history-model";
import { useCreatePatientInjectionHistoryMutation, useUpdatePatientInjectionHistoryMutation } from "reduxt/features/patient/injection-history-api";
import { useLazyGetInjectionTypeDropdownQuery } from "reduxt/features/definition/definition-api";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";

const AddPatientInjectionHistoryModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<PatientInjectionHistoryCreateBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    const [getInjectionType, {
        data: getInjectionTypeData,
        isLoading: getInjectionTypeIsLoading,
    }] = useLazyGetInjectionTypeDropdownQuery();

    const [createPatientInjectionHistory, { isLoading: createPatientInjectionHistoryIsLoading, data: createPatientInjectionHistoryResponse, error: createPatientInjectionHistoryError }] = useCreatePatientInjectionHistoryMutation();

    const [updatePatientInjectionHistory, { isLoading: updatePatientInjectionHistoryIsLoading, data: updatePatientInjectionHistoryResponse, error: updatePatientInjectionHistoryError }] = useUpdatePatientInjectionHistoryMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPatientInjectionHistory) {
            getInjectionType();
        }
    }, [open, id])

    useEffect(() => {
        if (data != null && modalType == ModalEnum.newPatientInjectionHistory) {
            const model: PatientInjectionHistoryCreateBodyModel = {
                patient_injection_history_id: data.patient_injection_history_id,
                patient_id: data.patient_id,
                injection_type_id: data.injection_type_id,
                name: data.name,
                dosage: data.dosage,
                injection_date: data.injection_date,
                complications: data.complications,
                status: data.status
            }
            setInitialData(model);
        }
    }, [data])

    useEffect(() => {
        if (createPatientInjectionHistoryResponse) {
            enqueueSnackbar(createPatientInjectionHistoryResponse.message, {
                variant: createPatientInjectionHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createPatientInjectionHistoryResponse?.status == true) {
                handleClose();
                //getPatientMedicineHistoryList({ patient_id: id });
            }
        }
        if (createPatientInjectionHistoryError) {
            var error = createPatientInjectionHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createPatientInjectionHistoryResponse, createPatientInjectionHistoryError])

    useEffect(() => {
        if (updatePatientInjectionHistoryResponse) {
            enqueueSnackbar(updatePatientInjectionHistoryResponse.message, {
                variant: updatePatientInjectionHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updatePatientInjectionHistoryResponse?.status == true) {
                handleClose();
                //getPatientMedicineHistoryList({ patient_id: id });
            }
        }
        if (updatePatientInjectionHistoryError) {
            var error = updatePatientInjectionHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updatePatientInjectionHistoryResponse, updatePatientInjectionHistoryError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.newPatientInjectionHistory} onClose={handleClose}>
                {<Formik
                    initialValues={initialData ?? {
                        patient_injection_history_id: null,
                        patient_id: id,
                        injection_type_id: null,
                        name: '',
                        dosage: null,
                        injection_date: null,
                        complications: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newPatientInjectionHistorySchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.patient_injection_history_id != null) {
                            updatePatientInjectionHistory(values);
                        } else {
                            createPatientInjectionHistory(values);
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
                                        <Typography variant="h4" marginBottom={"1.4rem"}>{intl.formatMessage({ id: data?.patient_disease_history_id != null ? "updatePatientInjectionHistory" : "addPatientInjectionHistory" })}</Typography>
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
                                                inputProps={{ maxLength: 50 }}
                                            />
                                        </Stack>
                                        {touched.dosage && errors.dosage && (
                                            <FormHelperText error id="helper-text-firstname-signup">
                                                {errors.dosage}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="injection_type_id">{intl.formatMessage({ id: "injectionType" })}</InputLabel>
                                            <CustomFormikSelect
                                                name='injection_type_id'
                                                placeholder="Seçim yapınız..."
                                                isLoading={getInjectionTypeIsLoading}
                                                isClearable
                                                menuPosition={"fixed"}
                                                zIndex={9999}
                                                options={getInjectionTypeData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                                value={
                                                    values.injection_type_id ? { label: getInjectionTypeData?.data?.find((item) => item.value == values.injection_type_id)?.label ?? "", value: getInjectionTypeData?.data?.find((item) => item.value == values.injection_type_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("injection_type_id", val?.value ?? 0);
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="injection_date">{intl.formatMessage({ id: "treatmentDate" })}</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                error={Boolean(touched.injection_date && errors.injection_date)}
                                                id="injection_date"
                                                type="date"
                                                value={values.injection_date}
                                                name="injection_date"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                placeholder={intl.formatMessage({ id: "injectionDate" })}
                                            //inputProps={{ max: dayjs().format('YYYY-MM-DD') }}
                                            />
                                        </Stack>
                                        {touched.injection_date && errors.injection_date && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.injection_date}
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
                                        <Button disableElevation disabled={isSubmitting || createPatientInjectionHistoryIsLoading || updatePatientInjectionHistoryIsLoading} type="submit" variant="contained" color="primary">
                                            {(createPatientInjectionHistoryIsLoading || updatePatientInjectionHistoryIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createPatientInjectionHistoryIsLoading == false || updatePatientInjectionHistoryIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddPatientInjectionHistoryModal