"use client"
import { Grid } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce'
import RoundIconCard from 'components/cards/statistics/RoundIconCard'
import CustomScaleLoader from 'components/CustomScaleLoader'
import { APP_DEFAULT_PATH } from 'config'
import { Clock, Eye, Gps } from 'iconsax-react'
import React from 'react'
import { useIntl } from 'react-intl'
import { useGetStatisticAppointmentQuery, useGetStatisticReadQuery } from 'reduxt/features/statistic/statistic-api'
import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate'

const StatisticView = () => {

    const intl = useIntl()

    let breadcrumbLinks = [
        { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
        { title: `${intl.formatMessage({ id: "statistics" })}` },
    ];

    const { data: getStatisticData, isLoading: isStatisticLoading, isFetching: isStatisticFetching } = useGetStatisticReadQuery()

    const { data: getStatisticAppointmentData, isLoading: isStatisticAppointmentLoading, isFetching: isStatisticAppointmentFetching } = useGetStatisticAppointmentQuery({ daily: false, start_date: "2025-01-01 00:00:00", end_date: "2025-01-31 00:00:00" })

    return (
        <>
            <Breadcrumbs custom heading={`${intl.formatMessage({ id: "statistics" })}`} links={breadcrumbLinks} />
            <Grid container spacing={3}>
                {isStatisticLoading || isStatisticFetching ? <Grid item xs={12}>
                    <CustomScaleLoader />
                </Grid> : getStatisticData?.data != null ? <>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title={intl.formatMessage({ id: "numberOfAppointments" })} count={getStatisticData.data.appointmentStats.total.toString() ?? "0"} percentage={getStatisticData.data.appointmentStats.increase} extra={getStatisticData.data.appointmentStats.this_month.toString()} isLoss={true} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title="Kazanç" count="₺1.050.000" percentage={70.5} color="success" extra="₺80.000" isLoss={true} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title={intl.formatMessage({ id: "numberOfPatients" })} count={getStatisticData.data.patientStats.total.toString() ?? "0"} percentage={getStatisticData.data.patientStats.increase} isLoss={true} extra={getStatisticData.data.patientStats.this_month.toString()} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title="Yeni Danışan Sayısı" count="5" percentage={27.4} isLoss={false} color="error" extra="10" />
                    </Grid>
                </> : <></>}
                <Grid item xs={12} lg={4} sm={6}>
                    <RoundIconCard
                        primary="En Çok Yapılan İşlem"
                        secondary="PRP + Mezoterapi"
                        content="1 Ocak - 1 Şubat 2025"
                        iconPrimary={Eye}
                        color="info.darker"
                        bgcolor="info.lighter"
                    />
                </Grid>
                <Grid item xs={12} lg={4} sm={6}>
                    <RoundIconCard
                        primary="En Çok İşlem Yapan Çalışan"
                        secondary="Dr. Gürkan Tü."
                        content="1 Ocak - 1 Şubat 2025"
                        iconPrimary={Gps}
                        color="success.darker"
                        bgcolor="success.lighter"
                    />
                </Grid>
                <Grid item xs={12} lg={4} md={12}>
                    <RoundIconCard
                        primary="Impact"
                        secondary="42.6%"
                        content="May 30 - June 01 (2018)"
                        iconPrimary={Clock}
                        color="warning.darker"
                        bgcolor="warning.lighter"
                    />
                </Grid>
                {isStatisticAppointmentLoading || isStatisticAppointmentFetching ? <Grid item xs={12}>
                    <CustomScaleLoader />
                </Grid> : getStatisticAppointmentData?.data != null ? <Grid item xs={12} spacing={3} sx={{ marginTop: 1 }}>
                    <Grid item xs={12}>
                        <RepeatCustomerRate title='Randevu Sayısı' data={getStatisticAppointmentData.data} />
                    </Grid>
                </Grid> : <></>}
            </Grid>
        </>
    )
}

export default StatisticView