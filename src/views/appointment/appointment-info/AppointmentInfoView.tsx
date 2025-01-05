'use client'
import { useSearchParams, useParams } from 'next/navigation'
import { Grid, Link, List, ListItem, Stack, Typography } from '@mui/material'
import MainCard from 'components/MainCard'
import { useEffect } from 'react'
import { useLazyReadAppointmentQuery } from 'reduxt/features/appointment/appointment-api';
import CustomScaleLoader from 'components/CustomScaleLoader'
import dayjs from 'dayjs'
import { useLazyGetPatientHealthInformationQuery } from 'reduxt/features/patient/health-information-api'
import { useIntl } from 'react-intl'

const AppointmentInfoView = () => {
    const intl = useIntl()
    const params = useParams<{ slug: string }>()
    const searchParams = useSearchParams()
    const patientId = searchParams.get('patient')

    const [getReadAppointment, {
        data: getReadAppointmentData,
        isFetching: isReadAppointmentFetching,
        isLoading: isReadAppointmentLoading
    }] = useLazyReadAppointmentQuery();

    const [getPatientHealthInformation, {
        data: getPatientHealthInformationData,
        isFetching: isPatientHealthInformationFetching,
        isLoading: isPatientHealthInformationLoading
    }] = useLazyGetPatientHealthInformationQuery();

    useEffect(() => {
        if (patientId != null) {
            getReadAppointment({ appointment_id: params.slug, patient_id: patientId })
            getPatientHealthInformation({ patient_id: patientId })
        }
    }, [patientId])

    return (
        <>
            <Grid item xs={4}>
                <MainCard title="Danışan Bilgileri">
                    {isReadAppointmentLoading || isReadAppointmentFetching ? <CustomScaleLoader /> : <List sx={{ py: 0 }}>
                        <ListItem divider>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">{intl.formatMessage({id: "nameSurname"})}</Typography>
                                        <Typography>{getReadAppointmentData?.data?.patient_full_name ?? "-"}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">{intl.formatMessage({id: "identityNumber"})}</Typography>
                                        <Typography>{getReadAppointmentData?.data?.identity_number ?? "-"}</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem divider>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">{intl.formatMessage({id: "phone"})}</Typography>
                                        <Typography>
                                        <Link href={`tel:${getReadAppointmentData?.data?.patient_full_phone}`}>{getReadAppointmentData?.data?.patient_full_phone ?? "-"}</Link>
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">{intl.formatMessage({id: "birthdate"})}</Typography>
                                        <Typography>{getReadAppointmentData?.data?.birthdate ?? "-"}</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>}
                </MainCard>
            </Grid>
            <Grid item xs={4}>
                <MainCard title="Randevu Bilgileri">
                    {isReadAppointmentLoading || isReadAppointmentFetching ? <CustomScaleLoader /> : <List sx={{ py: 0 }}>
                        <ListItem divider>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">Tarih</Typography>
                                        <Typography>{getReadAppointmentData?.data?.appointment_start != null ? dayjs(getReadAppointmentData?.data?.appointment_start).format("DD.MM.YYYY HH:mm") : "-"}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">Doktor/Çalışan</Typography>
                                        <Typography>{getReadAppointmentData?.data?.person_full_name ?? "-"}</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem divider>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">Oluşturan</Typography>
                                        <Typography>
                                            {getReadAppointmentData?.data?.created_person ?? "-"}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">Oluşturma Tarihi</Typography>
                                        <Typography>{getReadAppointmentData?.data?.created_at != null ? dayjs(getReadAppointmentData?.data?.created_at).format("DD.MM.YYYY HH:mm") : "-"}</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>}
                </MainCard>
            </Grid>
            <Grid item xs={4}>
                <MainCard title="Sağlık Bilgileri">
                    {isPatientHealthInformationLoading || isPatientHealthInformationFetching ? <CustomScaleLoader /> : <List sx={{ py: 0 }}>
                        <ListItem divider>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">{intl.formatMessage({id: "height"})}</Typography>
                                        <Typography>{getPatientHealthInformationData?.data?.height ?? "-"}</Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">{intl.formatMessage({id: "weight"})}</Typography>
                                        <Typography>{getPatientHealthInformationData?.data?.weight ?? "-"}</Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem divider>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">{intl.formatMessage({id: "smoke"})}</Typography>
                                        <Typography>
                                            {getPatientHealthInformationData?.data?.smoke == true ? intl.formatMessage({ id: "yes" }) : getPatientHealthInformationData?.data?.smoke == false ? intl.formatMessage({ id: "yes" }) : "-"}
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={0.5}>
                                        <Typography color="secondary">{intl.formatMessage({id: "alcohol"})}</Typography>
                                        <Typography>
                                        {getPatientHealthInformationData?.data?.alcohol == true ? intl.formatMessage({ id: "yes" }) : getPatientHealthInformationData?.data?.alcohol == false ? intl.formatMessage({ id: "yes" }) : "-"}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>}
                </MainCard>
            </Grid>
        </>
    )
}

export default AppointmentInfoView