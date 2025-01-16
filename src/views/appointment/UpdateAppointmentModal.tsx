"use client"

import { Box, Button, Chip, Dialog, DialogActions, FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput, Stack, Typography } from "@mui/material"
import { CalendarSearch, CloseSquare, InfoCircle } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import CustomScaleLoader from "components/CustomScaleLoader";
import dayjs from 'dayjs';
import { useLazyAcceptingAppointmentDropDownQuery } from "reduxt/features/person/person-api";
import { AppointmentCalendarModalEnum, setCalendarModal } from "reduxt/features/appointment/appointmentCalendarModalSlice";
import { AppointmentCreateBodyModel } from "reduxt/features/appointment/models/appointment-list-model";
import { useUpdateAppointmentMutation } from "reduxt/features/appointment/appointment-api";
import { newAppointmentSchema } from "utils/schemas/appointment-validation-schema";
import { useLazyGetAppointmentStatusDropdownQuery } from "reduxt/features/definition/definition-api";
import AddAppointmentCalendarModal from "./AddAppointmentCalendarModal";

const UpdateAppointmentModal = () => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<AppointmentCreateBodyModel>();

    const [personName, setPersonName] = useState<null | string>()
    const [isDeletePerson, setIsDeletePerson] = useState(false);

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
        setIsDeletePerson(false);
    };

    const [getAppointmentStatusDropdown, { isLoading: getAppointmentStatusDropdownLoading, data: getAppointmentStatusData }] = useLazyGetAppointmentStatusDropdownQuery();

    const [getAcceptingAppointmentDropDownList, {
        data: getAcceptingAppointmentListData,
        isLoading: getAcceptingAppointmentListLoading
    }] = useLazyAcceptingAppointmentDropDownQuery();

    const [updateAppointment, { isLoading: updateAppointmentIsLoading, data: updateAppointmentResponse, error: updateAppointmentError }] = useUpdateAppointmentMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.updateAppointment) {
            getAcceptingAppointmentDropDownList({});
            getAppointmentStatusDropdown();
            if (id != null) {
                //readPatient({ patient_id: id })
            }
        }
    }, [open, id])

    useEffect(() => {
        if (open == true && modalType == ModalEnum.updateAppointment && data != null) {
            const model: AppointmentCreateBodyModel = {
                appointment_id: data.appointment_id,
                patient_id: data.patient_id,
                person_id: data.person_id,
                appointment_status_id: data.appointment_status_id,
                all_day: data.all_day,
                appointment_start: data.appointment_start,
                appointment_duration: data.appointment_duration,
                appointment_end: data.appointment_end,
                appointment_note: data.appointment_note,
                status: data.status
            }
            setInitialData(model);
        }
    }, [data])

    useEffect(() => {
        if (getAcceptingAppointmentListData?.data != null && data != null) {
            const personFilter = getAcceptingAppointmentListData?.data?.find((item) => item.value == data.person_id);
            if (personFilter != null) {
                setIsDeletePerson(false);
            } else {
                setIsDeletePerson(true);
            }
        }
    }, [getAcceptingAppointmentListData])

    useEffect(() => {
        if (updateAppointmentResponse) {
            enqueueSnackbar(updateAppointmentResponse.message, {
                variant: updateAppointmentResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateAppointmentResponse?.status == true) {
                handleClose();
                //getPatientList({});
            }
        }
        if (updateAppointmentError) {
            var error = updateAppointmentError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateAppointmentResponse, updateAppointmentError])

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <>
            <Dialog open={open && modalType == ModalEnum.updateAppointment} onClose={handleClose}>
                {false || false ? <CustomScaleLoader /> : <Formik
                    initialValues={initialData ?? {
                        appointment_id: null,
                        patient_id: null,
                        patient_name: null,
                        patient_surname: null,
                        patient_identity_number: null,
                        patient_phone_code: null,
                        patient_phone_number: null,
                        patient_birthdate: null,
                        person_id: null,
                        appointment_status_id: 1,
                        all_day: false,
                        appointment_start: null,
                        appointment_duration: null,
                        appointment_end: null,
                        appointment_note: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newAppointmentSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.appointment_id != null) {
                            updateAppointment(values);
                        }
                    }}
                >
                    {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <Form>
                            <AddAppointmentCalendarModal />
                            <Box sx={{ px: 3, py: 3 }}>
                                <Grid
                                    container
                                    spacing={2}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 4 }}
                                >
                                    <Grid item>
                                        <Typography variant="h4">{`${intl.formatMessage({ id: "updateAppointment" })}: ${data?.patient_full_name}`}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={48} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    {isDeletePerson == true && <Grid item xs={12} sm={12}>
                                        <Chip label={intl.formatMessage({ id: "isDeletePersonText" }, { name: data.person_full_name })} variant="outlined" color="error" icon={<InfoCircle />} />
                                    </Grid>}
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="person_id">{`${intl.formatMessage({ id: "doctorPerson" })}*`}</InputLabel>
                                            <CustomFormikSelect
                                                name='person_id'
                                                placeholder="Doktor/Çalışan Seçin"
                                                isClearable={true}
                                                isLoading={getAcceptingAppointmentListLoading}
                                                zIndex={9998}
                                                value={
                                                    values.person_id ? { label: getAcceptingAppointmentListData?.data?.find((item) => item.value == values.person_id)?.label ?? data?.person_full_name, value: getAcceptingAppointmentListData?.data?.find((item) => item.value == values.person_id)?.value ?? data?.person_id } : null}
                                                onChange={(val: any, action) => {
                                                    setFieldValue("person_id", val?.value ?? null);
                                                    setPersonName(val?.label);
                                                }}

                                                options={getAcceptingAppointmentListData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="appointment_status_id">{`${intl.formatMessage({ id: "appointmentStatus" })}*`}</InputLabel>
                                            <CustomFormikSelect
                                                name='appointment_status_id'
                                                placeholder="Randevu Durumu Seçin"
                                                isClearable={true}
                                                isLoading={getAppointmentStatusDropdownLoading}
                                                zIndex={9997}
                                                value={
                                                    values.appointment_status_id ? { label: getAppointmentStatusData?.data?.find((item) => item.value == values.appointment_status_id)?.label ?? "", value: getAppointmentStatusData?.data?.find((item) => item.value == values.appointment_status_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("appointment_status_id", val?.value ?? null);
                                                }}

                                                options={getAppointmentStatusData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="appointment_start">{`${intl.formatMessage({ id: "appointmentDate" })}*`}</InputLabel>
                                            <OutlinedInput
                                                id="text-adornment-password"
                                                type="datetime-local"
                                                placeholder="Randevu Saati Seçin"
                                                disabled={values.person_id == null}
                                                error={Boolean(touched.appointment_start && errors.appointment_start)}
                                                value={values.appointment_start}
                                                name="appointment_start"
                                                onChange={(val) => {
                                                    setFieldValue("appointment_start", dayjs(val.target.value).format('YYYY-MM-DD HH:mm:ss'))
                                                }}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton aria-label="toggle password visibility" edge="end" color="secondary"
                                                            disabled={values.person_id == null}
                                                            onClick={() => {
                                                                dispatch(setCalendarModal({
                                                                    open: true,
                                                                    modalType: AppointmentCalendarModalEnum.appointmentCalendar,
                                                                    id: values.person_id ?? 0,
                                                                    data: { person_name: personName }
                                                                }))
                                                            }}>
                                                            <CalendarSearch />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                            />
                                        </Stack>
                                        {touched.appointment_start && errors.appointment_start && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.appointment_start}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="appointment_duration">{intl.formatMessage({ id: "appointmentDuration" })}</InputLabel>
                                            <OutlinedInput
                                                id="text-adornment-password"
                                                type="number"
                                                inputProps={{
                                                    min: 0
                                                }}
                                                placeholder={intl.formatMessage({ id: "appointmentDuration" })}
                                                value={values.appointment_duration}
                                                name="appointment_duration"
                                                error={Boolean(touched.appointment_duration && errors.appointment_duration)}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                        </Stack>
                                        {touched.appointment_duration && errors.appointment_duration && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.appointment_duration}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="appointmentNote">{intl.formatMessage({ id: "appointmentNote" })}</InputLabel>
                                            <OutlinedInput
                                                id="text-adornment-password"
                                                type="text"
                                                placeholder={intl.formatMessage({ id: "appointmentNote" })}
                                                error={Boolean(touched.appointment_note && errors.appointment_note)}
                                                value={values.appointment_note}
                                                name="appointment_note"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                multiline
                                                rows={3}
                                            />
                                        </Stack>
                                        {touched.appointment_note && errors.appointment_note && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.appointment_note}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>
                                <DialogActions sx={{ marginTop: 5 }}>
                                    <Button color="info" onClick={handleClose}>
                                        {intl.formatMessage({ id: "close" })}
                                    </Button>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting || updateAppointmentIsLoading} type="submit" variant="contained" color="primary">
                                            {(updateAppointmentIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(updateAppointmentIsLoading == false) && intl.formatMessage({ id: "save" })}
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

export default UpdateAppointmentModal