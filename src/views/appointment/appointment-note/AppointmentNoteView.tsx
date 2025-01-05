import { Button, FormHelperText, Grid, TextField } from '@mui/material'
import MainCard from 'components/MainCard'
import { Save2 } from 'iconsax-react'
import { useIntl } from 'react-intl'
import { Form, Formik } from 'formik';
import { updateAppointmentNoteSchema } from "utils/schemas/appointment-validation-schema";
import { useAppSelector } from 'reduxt/hooks';
import { AppointmentReadResultModel, AppointmentUpdateNoteBodyModel } from 'reduxt/features/appointment/models/appointment-list-model';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useAppointmentUpdateNoteMutation } from 'reduxt/features/appointment/appointment-api';
import { enqueueSnackbar } from 'notistack';
import { PuffLoader } from 'react-spinners';

const AppointmentNoteView = () => {

    const intl = useIntl()

    const params = useParams<{ slug: string }>()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patient')

    const appointmentApi: AppointmentReadResultModel | undefined | any = useAppSelector((state) => state.appointmentApi);

    const [initialData, setInitialData] = useState<AppointmentUpdateNoteBodyModel>()

    const [updateAppointmentNote, { isLoading: updateAppointmentNoteIsLoading, data: updateAppointmentNoteResponse, error: updateAppointmentNoteError }] = useAppointmentUpdateNoteMutation();

    useEffect(() => {
        if (updateAppointmentNoteResponse) {
            enqueueSnackbar(updateAppointmentNoteResponse.message, {
                variant: updateAppointmentNoteResponse?.status == true ? 'success' : 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
            if (updateAppointmentNoteResponse?.status == true) {
                //getPatientList({});
            }
        }
        if (updateAppointmentNoteError) {
            var error = updateAppointmentNoteError as any;
            enqueueSnackbar(error.data?.message ?? "Hata", {
                variant: 'error', anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            },)
        }
    }, [updateAppointmentNoteResponse, updateAppointmentNoteError])

    useEffect(() => {
        if (params.slug != null && patientId != null) {
            const readAppointmentData = appointmentApi.queries[`readAppointment({\"appointment_id\":\"${params.slug}\",\"patient_id\":\"${patientId}\"})`]?.data;
            if (readAppointmentData?.data != null) {
                setInitialData({
                    appointment_id: readAppointmentData?.data.appointment_id,
                    patient_id: readAppointmentData?.data?.patient_id,
                    appointment_note: readAppointmentData?.data?.appointment_note,
                    status: true
                });
            }
        }
    }, [appointmentApi])

    return (
        <Grid item xs={12}>
            <Formik
                initialValues={initialData ?? {
                    appointment_id: null,
                    patient_id: null,
                    appointment_note: null,
                    status: true
                }}
                enableReinitialize
                validationSchema={updateAppointmentNoteSchema}
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    updateAppointmentNote(values);
                }}
            >
                {({ errors, setFieldValue, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <Form>
                        <MainCard
                            sx={{ marginBottom: 3 }}
                            title={intl.formatMessage({ id: "appointmentNote" })}
                            secondary={
                                <Button type='submit' variant="dashed" startIcon={<Save2 />}
                                    disabled={isSubmitting || updateAppointmentNoteIsLoading}
                                >
                                    {(updateAppointmentNoteIsLoading) && <PuffLoader size={20} color='white' />}
                                    {(updateAppointmentNoteIsLoading == false) && intl.formatMessage({ id: "save" })}</Button>
                            }
                        >
                            <TextField
                                id="outlined-multiline-static"
                                fullWidth
                                value={values.appointment_note}
                                name="appointment_note"
                                error={Boolean(touched.appointment_note && errors.appointment_note)}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                multiline
                                rows={5}
                            />
                            {touched.appointment_note && errors.appointment_note && (
                                <FormHelperText error id="helper-text-appointment-note">
                                    {errors.appointment_note}
                                </FormHelperText>
                            )}
                        </MainCard>
                    </Form>)}
            </Formik>
        </Grid>
    )
}

export default AppointmentNoteView