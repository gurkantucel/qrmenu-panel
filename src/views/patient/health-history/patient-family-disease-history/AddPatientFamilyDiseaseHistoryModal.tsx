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
import { useLazyGetDiseaseStatusDropdownQuery, useLazyGetKinshipDegreeDropdownQuery } from "reduxt/features/definition/definition-api";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import { newPatientFamilyDiseaseSchema } from "utils/schemas/patient-validation-schema";
import { PatientFamilyDiseaseHistoryCreateBodyModel } from "reduxt/features/patient/models/patient-family-disease-history-model";
import { useCreatePatientFamilyDiseaseHistoryMutation, useUpdatePatientFamilyDiseaseHistoryMutation } from "reduxt/features/patient/family-disease-history-api";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import dayjs from "dayjs";

const AddPatientFamilyDiseaseHistoryModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, data, id } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<PatientFamilyDiseaseHistoryCreateBodyModel>();

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    //const [getPatientMedicineHistoryList] = useLazyGetPatientMedicineHistoryListQuery();

    const [getKinshipDegree, {
        data: getKinshipDegreeData,
        isLoading: getKinshipDegreeIsLoading
    }] = useLazyGetKinshipDegreeDropdownQuery();

    const [getDiseaseStatus, {
        data: getDiseaseStatusData,
        isLoading: getDiseaseStatusIsLoading,
    }] = useLazyGetDiseaseStatusDropdownQuery();

    const [createPatientFamilyDiseaseHistory, { isLoading: createPatientFamilyDiseaseHistoryIsLoading, data: createPatientFamilyDiseaseHistoryResponse, error: createPatientFamilyDiseaseHistoryError }] = useCreatePatientFamilyDiseaseHistoryMutation();

    const [updateFamilyDiseaseHistory, { isLoading: updateFamilyDiseaseHistoryIsLoading, data: updateFamilyDiseaseHistoryResponse, error: updateFamilyDiseaseHistoryError }] = useUpdatePatientFamilyDiseaseHistoryMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newPatientFamilyDiseaseHistory) {
            getKinshipDegree();
            getDiseaseStatus();
        }
    }, [open, id])

    useEffect(() => {
        if (data != null && modalType == ModalEnum.newPatientFamilyDiseaseHistory) {
            const model: PatientFamilyDiseaseHistoryCreateBodyModel = {
                patient_family_disease_history_id: data.patient_family_disease_history_id,
                patient_id: data.patient_id,
                kinship_degree_id: data.kinship_degree_id,
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
        if (createPatientFamilyDiseaseHistoryResponse) {
            enqueueSnackbar(createPatientFamilyDiseaseHistoryResponse.message, {
                variant: createPatientFamilyDiseaseHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createPatientFamilyDiseaseHistoryResponse?.status == true) {
                handleClose();
                //getPatientMedicineHistoryList({ patient_id: id });
            }
        }
        if (createPatientFamilyDiseaseHistoryError) {
            var error = createPatientFamilyDiseaseHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createPatientFamilyDiseaseHistoryResponse, createPatientFamilyDiseaseHistoryError])

    useEffect(() => {
        if (updateFamilyDiseaseHistoryResponse) {
            enqueueSnackbar(updateFamilyDiseaseHistoryResponse.message, {
                variant: updateFamilyDiseaseHistoryResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateFamilyDiseaseHistoryResponse?.status == true) {
                handleClose();
                //getPatientMedicineHistoryList({ patient_id: id });
            }
        }
        if (updateFamilyDiseaseHistoryError) {
            var error = updateFamilyDiseaseHistoryError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateFamilyDiseaseHistoryResponse, updateFamilyDiseaseHistoryError])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.newPatientFamilyDiseaseHistory} onClose={handleClose}>
                {<Formik
                    initialValues={initialData ?? {
                        patient_family_disease_history_id: null,
                        patient_id: id,
                        kinship_degree_id: null,
                        disease_status_id: null,
                        name: '',
                        start_date: null,
                        end_date: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newPatientFamilyDiseaseSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.patient_family_disease_history_id != null) {
                            updateFamilyDiseaseHistory(values);
                        } else {
                            createPatientFamilyDiseaseHistory(values);
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
                                        <Typography variant="h4" marginBottom={"1.4rem"}>{intl.formatMessage({ id: data?.patient_disease_history_id != null ? "updateFamilyDiseaseHistory" : "addFamilyDiseaseHistory" })}</Typography>
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
                                            <InputLabel htmlFor="kinship_degree_id">{intl.formatMessage({ id: "kinshipDegree" })}{"*"}</InputLabel>
                                            <CustomFormikSelect
                                                name='kinship_degree_id'
                                                placeholder="Seçim yapınız..."
                                                isLoading={getKinshipDegreeIsLoading}
                                                menuPosition={"fixed"}
                                                zIndex={9999}
                                                options={getKinshipDegreeData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                                value={
                                                    values.kinship_degree_id ? { label: getKinshipDegreeData?.data?.find((item) => item.value == values.kinship_degree_id)?.label ?? "", value: getKinshipDegreeData?.data?.find((item) => item.value == values.kinship_degree_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("kinship_degree_id", val?.value ?? 0);
                                                }}
                                            />
                                        </Stack>
                                        {touched.kinship_degree_id && errors.kinship_degree_id && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.kinship_degree_id}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="disease_status">{intl.formatMessage({ id: "diseaseStatus" })}{"*"}</InputLabel>
                                            <CustomFormikSelect
                                                name='disease_status_id'
                                                placeholder="Seçim yapınız..."
                                                isLoading={getDiseaseStatusIsLoading}
                                                menuPosition={"fixed"}
                                                zIndex={9999}
                                                options={getDiseaseStatusData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                                value={
                                                    values.disease_status_id ? { label: getDiseaseStatusData?.data?.find((item) => item.value == values.disease_status_id)?.label ?? "", value: getDiseaseStatusData?.data?.find((item) => item.value == values.disease_status_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("disease_status_id", val?.value ?? 0);
                                                }}
                                            />
                                        </Stack>
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
                                        <Button disableElevation disabled={isSubmitting || createPatientFamilyDiseaseHistoryIsLoading || updateFamilyDiseaseHistoryIsLoading} type="submit" variant="contained" color="primary">
                                            {(createPatientFamilyDiseaseHistoryIsLoading || updateFamilyDiseaseHistoryIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createPatientFamilyDiseaseHistoryIsLoading == false || updateFamilyDiseaseHistoryIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default AddPatientFamilyDiseaseHistoryModal