"use client"
import { Grid } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce'
import RoundIconCard from 'components/cards/statistics/RoundIconCard'
import CustomScaleLoader from 'components/CustomScaleLoader'
import { APP_DEFAULT_PATH } from 'config'
import dayjs from 'dayjs'
import { Clock, Eye, Profile2User } from 'iconsax-react'
import React from 'react'
import { useIntl } from 'react-intl'
import { useGetStatisticAppointmentQuery, useGetStatisticReadQuery } from 'reduxt/features/statistic/statistic-api'
import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate'
import 'dayjs/locale/tr';
import StaticReadVenue from 'components/cards/statistics/StaticReadVenue'

const StatisticView = () => {

    const intl = useIntl()

    let breadcrumbLinks = [
        { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
        { title: `${intl.formatMessage({ id: "statistics" })}` },
    ];

    const { data: getStatisticData, isLoading: isStatisticLoading, isFetching: isStatisticFetching } = useGetStatisticReadQuery()

    const { data: getStatisticAppointmentData, isLoading: isStatisticAppointmentLoading, isFetching: isStatisticAppointmentFetching } = useGetStatisticAppointmentQuery({ daily: false, start_date: dayjs().startOf('year').format('YYYY-MM-DD HH:mm:ss'), end_date: dayjs().endOf('year').format('YYYY-MM-DD HH:mm:ss') })

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
                        <StaticReadVenue title="Kazanç" color="success" data={getStatisticData.data.readVenue} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title={intl.formatMessage({ id: "numberOfPatients" })} count={getStatisticData.data.patientStats.total.toString() ?? "0"} percentage={getStatisticData.data.patientStats.increase} isLoss={true} extra={getStatisticData.data.patientStats.this_month.toString()} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <AnalyticEcommerce title={intl.formatMessage({ id: "numberOfOffers" })} count={getStatisticData.data.quoteStats.total.toString() ?? "0"} percentage={getStatisticData.data.quoteStats.increase} extra={getStatisticData.data.quoteStats.this_month.toString()} />
                    </Grid>

                    <Grid item xs={12} lg={4} sm={6}>
                        <RoundIconCard
                            primary="En Çok Yapılan İşlem"
                            secondary={getStatisticData.data.mostAppointmentProcess.process_name}
                            content={`${dayjs(getStatisticData.data.mostAppointmentProcess.start_date).locale("tr").format("DD MMMM")} - ${dayjs(getStatisticData.data.mostAppointmentProcess.end_date).locale("tr").format("DD MMMM YYYY")}`}
                            iconPrimary={Eye}
                            color="info.darker"
                            bgcolor="info.lighter"
                        />
                    </Grid>
                    <Grid item xs={12} lg={4} sm={6}>
                        <RoundIconCard
                            primary="En Çok İşlem Yapan Çalışan"
                            secondary={getStatisticData.data.mostPerson.person_name}
                            content={`${dayjs(getStatisticData.data.mostPerson.start_date).locale("tr").format("DD MMMM")} - ${dayjs(getStatisticData.data.mostPerson.end_date).locale("tr").format("DD MMMM YYYY")}`}
                            iconPrimary={Profile2User}
                            color="success.darker"
                            bgcolor="success.lighter"
                        />
                    </Grid>
                    <Grid item xs={12} lg={4} md={12}>
                        <RoundIconCard
                            primary="En Çok İşlem Yapılan Gün"
                            secondary={`${dayjs(getStatisticData.data.mostProcessDay.date).locale("tr").format("DD MMMM YYYY dddd")}`}
                            content={`${getStatisticData.data.mostProcessDay.count} işlem`}
                            iconPrimary={Clock}
                            color="warning.darker"
                            bgcolor="warning.lighter"
                        />
                    </Grid>
                </> : <></>}
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