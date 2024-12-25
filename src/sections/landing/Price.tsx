"use client"
import { Box, Button, Chip, Container, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import MainCard from 'components/MainCard';
import React, { Fragment } from 'react'

const PriceLandingPage = () => {
    const timePeriod = true;

    const plans = [
        {
            active: false,
            title: '1 Yıllık',
            description: 'Günlük: ₺26,02',
            price: 9.499,
            planList: [
                "Aylık 250 SMS Hakkı",
                "Limitsiz Döküman Yönetimi",
                "Sınırsız Kullanıcı",
                "Sınırsız Hasta Kaydı",
                "Sınırsız Randevu Kaydı",
            ],
            permission: [0, 1, 2, 3, 4]
        },
        {
            active: true,
            title: '3 Yıllık',
            description: 'Günlük: ₺17,80',
            price: 19.499,
            planList: [
                "Aylık 750 SMS Hakkı",
                "Limitsiz Döküman Yönetimi",
                "Sınırsız Kullanıcı",
                "Sınırsız Hasta Kaydı",
                "Sınırsız Randevu Kaydı",
            ],
            permission: [0, 1, 2, 3, 4]
        },
        {
            active: false,
            title: '2 Yıllık',
            description: 'Günlük: ₺20,54',
            price: 14.999,
            planList: [
                "Aylık 500 SMS Hakkı",
                "Limitsiz Döküman Yönetimi",
                "Sınırsız Kullanıcı",
                "Sınırsız Hasta Kaydı",
                "Sınırsız Randevu Kaydı",
            ],
            permission: [0, 1, 2, 3, 4, 5, 6, 7]
        }
    ];

    const priceListDisable = {
        opacity: 0.4,
        textDecoration: 'line-through'
    };

    const priceActivePlan = {
        padding: 3,
        borderRadius: 1,
        bgcolor: "#edf8f4"
    };
    const price = {
        fontSize: '40px',
        fontWeight: 700,
        lineHeight: 1
    };

    return (
        <Box sx={{ bgcolor: 'secondary.200', pb: { md: 10, xs: 7 }, pt: 4 }}>
            <Container>
            <Grid item container spacing={3} xs={12} alignItems="center">
                {plans.map((plan, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <MainCard>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box sx={plan.active ? priceActivePlan : { padding: 3 }}>
                                        <Grid container spacing={3}>
                                            {plan.active && (
                                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                                    <Chip label="En Avantajlı" color="success" />
                                                </Grid>
                                            )}
                                            <Grid item xs={12}>
                                                <Stack spacing={0} textAlign="center">
                                                    <Typography variant="h4">{plan.title}</Typography>
                                                    <Typography>{plan.description}</Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack spacing={0} alignItems="center">
                                                    {timePeriod && (
                                                        <Typography variant="h2" sx={price}>
                                                            ₺{plan.price}
                                                        </Typography>
                                                    )}
                                                    {!timePeriod && (
                                                        <Typography variant="h2" sx={price}>
                                                            ₺{plan.price * 12 - 99}
                                                        </Typography>
                                                    )}
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button color={plan.active ? 'primary' : 'secondary'} variant={plan.active ? 'contained' : 'outlined'} fullWidth>
                                                    Satın Al
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <List
                                        sx={{
                                            m: 0,
                                            p: 0,
                                            '&> li': {
                                                px: 0,
                                                py: 0.625
                                            }
                                        }}
                                        component="ul"
                                    >
                                        {plan.planList.map((list, i) => (
                                            <Fragment key={i}>
                                                <ListItem sx={!plan.permission.includes(i) ? priceListDisable : {}}>
                                                    <ListItemText primary={list} sx={{ textAlign: 'center' }} />
                                                </ListItem>
                                            </Fragment>
                                        ))}
                                    </List>
                                </Grid>
                            </Grid>
                        </MainCard>
                    </Grid>
                ))}
            </Grid>
            </Container>
        </Box>
    )
}

export default PriceLandingPage