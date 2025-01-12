"use client"
import { Grid } from '@mui/material'
import Breadcrumbs from 'components/@extended/Breadcrumbs'
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce'
import RoundIconCard from 'components/cards/statistics/RoundIconCard'
import { APP_DEFAULT_PATH } from 'config'
import { Clock, Eye, Gps } from 'iconsax-react'
import React from 'react'
import { useIntl } from 'react-intl'
import RepeatCustomerRate from 'sections/widget/chart/RepeatCustomerRate'

const StatisticView = () => {

    const intl = useIntl()

    let breadcrumbLinks = [
        { title: `${intl.formatMessage({ id: "home" })}`, to: APP_DEFAULT_PATH },
        { title: `${intl.formatMessage({ id: "statistics" })}` },
    ];

    return (
        <>
            <Breadcrumbs custom heading={`${intl.formatMessage({ id: "statistics" })}`} links={breadcrumbLinks} />
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticEcommerce title="Randevu Sayısı" count="275" percentage={12.3} extra="15" extra2='artış' isLoss={true} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticEcommerce title="Kazanç" count="₺1.050.000" percentage={70.5} color="success" extra="₺80.000" extra2='artış' isLoss={true} />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticEcommerce title="Danışan Sayısı" count="30" percentage={27.4} isLoss={true} color="warning" extra="4" extra2='artış' />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AnalyticEcommerce title="Yeni Danışan Sayısı" count="5" percentage={27.4} isLoss={false} color="error" extra="10" extra2='azalış' />
                </Grid>
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
                <Grid item xs={12} spacing={3} sx={{ marginTop: 1 }}>
                    <Grid item xs={12}>
                        <RepeatCustomerRate />
                    </Grid>
                </Grid>
                <Grid item xs={12} spacing={3} sx={{ marginTop: 1 }}>
                    <Grid item xs={12}>
                        <RepeatCustomerRate />
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default StatisticView