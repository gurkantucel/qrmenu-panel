"use client"

import { Box, Button, Dialog, DialogActions, FormControl, FormControlLabel, FormHelperText, Grid, InputAdornment, InputLabel, OutlinedInput, Radio, RadioGroup, Stack, Typography } from "@mui/material"
import { Add, CalendarSearch, CloseSquare } from "iconsax-react"
import { useIntl } from "react-intl";
import { closeModal, ModalEnum, setModal } from "reduxt/features/definition/modalSlice";
import { useAppDispatch, useAppSelector } from "reduxt/hooks";
import { RootState } from "reduxt/store";
import { Form, Formik } from 'formik';
import AnimateButton from "components/@extended/AnimateButton";
import { PuffLoader } from "react-spinners";
import { useEffect, useState } from "react";
import CustomFormikSelect from "components/third-party/formik/custom-formik-select";
import IconButton from "components/@extended/IconButton";
import { enqueueSnackbar } from "notistack";
import CustomFormikPhone from "components/third-party/formik/custom-formik-phone";
import { useLazyGetPatientDropdownQuery } from "reduxt/features/patient/patient-api";
import dayjs from 'dayjs';
import CustomFormikAsyncSelect from "components/third-party/formik/custom-formik-asyncselect";
import AuthDivider from "sections/auth/AuthDivider";
import { useAcceptingAppointmentDropDownQuery } from "reduxt/features/person/person-api";
import AddAppointmentCalendarModal from "./AddAppointmentCalendarModal";
import { AppointmentCalendarModalEnum, setCalendarModal } from "reduxt/features/branch/appointmentCalendarModalSlice";
import { AppointmentCreateBodyModel } from "reduxt/features/branch/models/branch-model";
import { useCreateAppointmentMutation } from "reduxt/features/branch/appointment-api";
import { newAppointmentSchema } from "utils/schemas/appointment-validation-schema";
import { useGetAppointmentStatusDropdownQuery, useGetAppointmentTypeDropdownQuery } from "reduxt/features/definition/definition-api";
import { getCookie } from "cookies-next";
import { Person } from "reduxt/features/auth/models/auth-models";

type Props = {
    page?: string
    requestCalendar?: () => void
}

const AddAppointmentModal = (props: Props) => {

    const dispatch = useAppDispatch();
    const { data: { open, modalType, id, data } } = useAppSelector((state: RootState) => state.modal);
    const intl = useIntl()

    const [initialData, setInitialData] = useState<AppointmentCreateBodyModel>();

    //const [personName, setPersonName] = useState<null | string>()

    const [patientType, setPatientType] = useState("oldPatient");

    const handleClose = () => {
        dispatch(closeModal())
        setInitialData(undefined);
    };

    const [getPatientDropdown, { isLoading: getPatientDropdownLoading }] = useLazyGetPatientDropdownQuery();

    const { isLoading: getAppointmentStatusDropdownLoading, data: getAppointmentStatusData } = useGetAppointmentStatusDropdownQuery(undefined, { skip: open == false && modalType != ModalEnum.newAppointment })

    const { isLoading: getAppointmentTypeDropdownLoading, data: getAppointmentTypeData } = useGetAppointmentTypeDropdownQuery(undefined, { skip: open == false && modalType != ModalEnum.newAppointment })

    const getPatientDropdownOptions = async (inputValue: string) => {

        if (inputValue.length >= 3) {
            const items = await getPatientDropdown({ label: inputValue })
            return items.data?.data ?? [];
        }
    }

    const { isLoading: getAcceptingAppointmentListLoading, data: getAcceptingAppointmentListData } = useAcceptingAppointmentDropDownQuery({}, { skip: open == false && modalType != ModalEnum.newAppointment })

    const defaultPersonId = (() => {
        const cookieValue = getCookie("person");
        if (cookieValue) {
            const personCookieValue = JSON.parse(cookieValue) as Person;
            const personFilter = getAcceptingAppointmentListData?.data?.find(
                (item) => item.value == personCookieValue.person_id
            );
            return personFilter?.value ?? getAcceptingAppointmentListData?.data?.[0]?.value ?? null;
        }
        return getAcceptingAppointmentListData?.data?.[0]?.value ?? null;
    })();

    const [createAppointment, { isLoading: createAppointmentIsLoading, data: createAppointmentResponse, error: createAppointmentError }] = useCreateAppointmentMutation();

    useEffect(() => {
        if (open == true && modalType == ModalEnum.newAppointment && data != null) {
            const model: AppointmentCreateBodyModel = {
                appointment_id: data.apppointment_id,
                patient_id: data.patient_id,
                person_id: data.person_id,
                appointment_status_id: data.appointment_status_id,
                appointment_type_id: data.appointment_type_id,
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
        if (createAppointmentResponse) {
            enqueueSnackbar(createAppointmentResponse.message, {
                variant: createAppointmentResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (createAppointmentResponse?.status == true) {
                handleClose();
                if (props.page == "home" && props.requestCalendar) {
                    props?.requestCalendar();
                }
            }
        }
        if (createAppointmentError) {
            const error = createAppointmentError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [createAppointmentResponse, createAppointmentError])

    useEffect(() => {
        return () => {
            handleClose()
        }
    }, [])

    return (
        <>
            {props.page != "home" && <Button variant="dashed" startIcon={<Add />} onClick={() => {
                dispatch(setModal({
                    open: true,
                    modalType: ModalEnum.newAppointment
                }))
            }}>{intl.formatMessage({ id: "newAppointment" })}</Button>}
            <Dialog open={open && modalType == ModalEnum.newAppointment} onClose={handleClose}>
                <Formik
                    initialValues={initialData ?? {
                        appointment_id: null,
                        patient_id: null,
                        patient_name: null,
                        patient_surname: null,
                        patient_identity_number: null,
                        patient_phone_code: patientType == "oldPatient" ? null : "+90",
                        patient_phone_number: null,
                        patient_birthdate: null,
                        person_id: defaultPersonId,
                        appointment_status_id: getAppointmentStatusData?.data?.find((item) => item.field == "00001")?.value ?? 0,
                        appointment_type_id: getAppointmentTypeData?.data?.find((item) => item.field == "00001")?.value ?? null,
                        all_day: false,
                        appointment_start: null,
                        appointment_duration: 30,
                        appointment_end: null,
                        appointment_note: null,
                        status: true
                    }}
                    enableReinitialize
                    validationSchema={newAppointmentSchema}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        if (values.appointment_id != null) {
                            //updateAppointment(values);
                        } else {
                            createAppointment(values);
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
                                    sx={{ borderBottom: '1px solid {theme.palette.divider}', marginBottom: 1 }}
                                >
                                    <Grid item>
                                        <Typography variant="h4">{intl.formatMessage({ id: id != null ? "updateAppointment" : "newAppointment" })}</Typography>
                                    </Grid>
                                    <Grid item sx={{ mr: 1.5 }}>
                                        <IconButton color="secondary" onClick={handleClose}>
                                            <CloseSquare size={36} />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset">
                                            <RadioGroup aria-label="size" defaultValue="newPerson" name="radio-buttons-group" row value={patientType} onChange={(event, value) => {
                                                setPatientType(value)
                                            }}>
                                                <FormControlLabel value="oldPatient" control={<Radio color="info" />} label="Mevcut Danışan" />
                                                <FormControlLabel value="newPatient" control={<Radio color="success" />} label="Yeni Danışan" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    {patientType == "oldPatient" && <Grid item xs={12}>
                                        <CustomFormikAsyncSelect
                                            isMulti={false}
                                            name='patient_id'
                                            loadOptions={getPatientDropdownOptions}
                                            isClearable
                                            isLoading={getPatientDropdownLoading}
                                            placeholder={intl.formatMessage({ id: "searchTCPhoneOrName" })}
                                            onChange={(value) => {
                                                setFieldValue("patient_id", value?.value);
                                            }}
                                            noOptionsMessage={() => intl.formatMessage({ id: "searchLeastThreeCharacters" })}
                                            loadingMessage={() => intl.formatMessage({ id: "loadingDot" })}
                                        />
                                    </Grid>}
                                    {patientType == "newPatient" && <>
                                        <Grid item xs={12} md={4}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="patient_name">{intl.formatMessage({ id: "name" })}{"*"}</InputLabel>
                                                <OutlinedInput
                                                    id="name"
                                                    type="firstname"
                                                    value={values.patient_name}
                                                    name="patient_name"
                                                    disabled={values.patient_id != null}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage({ id: "name" })}
                                                    fullWidth
                                                    error={Boolean(touched.patient_name && errors.patient_name)}
                                                />
                                            </Stack>
                                            {touched.patient_name && errors.patient_name && (
                                                <FormHelperText error id="helper-text-firstname-signup">
                                                    {errors.patient_name}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="patient_surname">{intl.formatMessage({ id: "surname" })}{"*"}</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.patient_surname && errors.patient_surname)}
                                                    id="lastname-signup"
                                                    type="lastname"
                                                    value={values.patient_surname}
                                                    name="patient_surname"
                                                    disabled={values.patient_id != null}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage({ id: "surname" })}
                                                    inputProps={{}}
                                                />
                                            </Stack>
                                            {touched.patient_surname && errors.patient_surname && (
                                                <FormHelperText error id="helper-text-lastname-signup">
                                                    {errors.patient_surname}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <CustomFormikPhone
                                                label={`${intl.formatMessage({ id: "phone" })}*`}
                                                handleBlur={handleBlur}
                                                handleChange={handleChange}
                                                disabled={values.patient_id != null}
                                                namePhoneCode="patient_phone_code"
                                                valuePhoneCode={values.patient_phone_code}
                                                namePhoneNumber="patient_phone_number"
                                                valuePhoneNumber={values.patient_phone_number}
                                                touchedPhoneNumber={touched.patient_phone_number}
                                                errorPhoneNumber={errors.patient_phone_number}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="patient_identity_number">{intl.formatMessage({ id: "identityNumber" })}</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.patient_identity_number && errors.patient_identity_number)}
                                                    id="patient_identity_number"
                                                    type="lastname"
                                                    value={values.patient_identity_number}
                                                    disabled={values.patient_id != null}
                                                    name="patient_identity_number"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage({ id: "identityNumber" })}
                                                    inputProps={{ maxLength: 11 }}
                                                />
                                            </Stack>
                                            {touched.patient_identity_number && errors.patient_identity_number && (
                                                <FormHelperText error id="helper-text-lastname-signup">
                                                    {errors.patient_identity_number}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Stack spacing={1}>
                                                <InputLabel htmlFor="birthdate">{intl.formatMessage({ id: "birthdate" })}</InputLabel>
                                                <OutlinedInput
                                                    fullWidth
                                                    error={Boolean(touched.patient_birthdate && errors.patient_birthdate)}
                                                    id="patient_birthdate"
                                                    type="date"
                                                    value={values.patient_birthdate}
                                                    disabled={values.patient_id != null}
                                                    name="patient_birthdate"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage({ id: "birthdate" })}
                                                    inputProps={{ max: dayjs().format('YYYY-MM-DD') }}
                                                />
                                            </Stack>
                                            {touched.patient_birthdate && errors.patient_birthdate && (
                                                <FormHelperText error id="helper-text-email-signup">
                                                    {errors.patient_birthdate}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                    </>}
                                    <Grid item xs={12}>
                                        <AuthDivider>
                                            <Typography variant="subtitle1">Randevu Bilgileri</Typography>
                                        </AuthDivider>
                                    </Grid>
                                    <Grid item xs={12} sm={6} sx={{ paddingTop: "10px !important" }}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="person_id">{`${intl.formatMessage({ id: "doctorPerson" })}*`}</InputLabel>
                                            <CustomFormikSelect
                                                name='person_id'
                                                placeholder="Doktor/Çalışan Seçin"
                                                isClearable={true}
                                                isLoading={getAcceptingAppointmentListLoading}
                                                zIndex={997}
                                                value={getAcceptingAppointmentListData?.data?.find((item) => item.value == values.person_id) ?? null}
                                                onChange={(val: any) => {
                                                    setFieldValue("person_id", val?.value);
                                                    //setPersonName(val?.label);
                                                }}

                                                options={getAcceptingAppointmentListData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                            />
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12} sm={6} sx={{ paddingTop: "10px !important" }}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="appointment_status_id">{`${intl.formatMessage({ id: "appointmentStatus" })}*`}</InputLabel>
                                            <CustomFormikSelect
                                                name='appointment_status_id'
                                                placeholder="Randevu Durumu Seçin"
                                                isClearable={true}
                                                isLoading={getAppointmentStatusDropdownLoading}
                                                zIndex={996}
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
                                            <InputLabel htmlFor="appointmentDate">{intl.formatMessage({ id: "appointmentDate" })}</InputLabel>
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
                                                                    //data: { person_name: personName }
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
                                            <InputLabel htmlFor="appointment_duration">{`${intl.formatMessage({ id: "appointmentDuration" })}(${intl.formatMessage({ id: "minute" })})`}</InputLabel>
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
                                    <Grid item xs={12} sm={6} sx={{ paddingTop: "10px !important" }}>
                                        <Stack spacing={1}>
                                            <InputLabel htmlFor="appointment_type_id">{`${intl.formatMessage({ id: "appointmentType2" })}*`}</InputLabel>
                                            <CustomFormikSelect
                                                name='appointment_type_id'
                                                placeholder="Randevu Tipi Seçin"
                                                isClearable={true}
                                                isLoading={getAppointmentTypeDropdownLoading}
                                                zIndex={996}
                                                value={
                                                    values.appointment_type_id ? { label: getAppointmentTypeData?.data?.find((item) => item.value == values.appointment_type_id)?.label ?? "", value: getAppointmentTypeData?.data?.find((item) => item.value == values.appointment_type_id)?.value ?? 0 } : null}
                                                onChange={(val: any) => {
                                                    setFieldValue("appointment_type_id", val?.value ?? null);
                                                }}

                                                options={getAppointmentTypeData?.data?.map((item) => ({
                                                    value: item.value,
                                                    label: item.label
                                                }))}
                                            />
                                        </Stack>
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
                                        <Button disableElevation
                                            disabled={isSubmitting || createAppointmentIsLoading || (patientType == "oldPatient" && values.patient_id == null)} type="submit" variant="contained" color="primary">
                                            {(createAppointmentIsLoading) && <PuffLoader size={20} color='white' />}
                                            {(createAppointmentIsLoading == false) && intl.formatMessage({ id: "save" })}
                                        </Button>
                                    </AnimateButton>
                                </DialogActions>
                            </Box>
                        </Form>
                    )}
                </Formik >
            </Dialog>
        </>
    )
}

export default AddAppointmentModal