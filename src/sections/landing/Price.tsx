"use client"
import { Box, Button, Chip, Container, Grid, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { getHomeMembershipPackages } from 'app/(simple)/landing/actions';
import MainCard from 'components/MainCard';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react'
import { MembershipPackagesListModel } from 'reduxt/features/definition/models/membership-packages-model';

const PriceLandingPage = () => {

    const router = useRouter();

    const timePeriod = true;

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

    const [result, setResult] = useState<MembershipPackagesListModel | null>(null);


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getHomeMembershipPackages();
                setResult(response?.data);
            } catch (err: any) {
            }
        }

        fetchData();
    }, []);

    return (
        <Box sx={{ bgcolor: 'secondary.200', pb: { md: 10, xs: 7 }, pt: 4 }}>
            <Container>
                <Grid item container spacing={3} xs={12} alignItems="center">
                    {result != null && result.data.map((plan, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <MainCard>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Box sx={plan.featured ? priceActivePlan : { padding: 3 }}>
                                            <Grid container spacing={3}>
                                                {plan.featured && (
                                                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                                        <Chip label="En Avantajlı" color="success" />
                                                    </Grid>
                                                )}
                                                <Grid item xs={12}>
                                                    <Stack spacing={0} textAlign="center">
                                                        <Typography variant="h4">{plan.name}</Typography>
                                                        <Typography>
                                                            {`Günlük: ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: plan.currency_code }).format(Number(parseFloat(plan.amount) / plan.duration))}`}
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Stack spacing={0} alignItems="center">
                                                        {timePeriod && (
                                                            <Typography variant="h2" sx={price}>
                                                                {`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: plan.currency_code }).format(Number(plan.amount))}`}
                                                            </Typography>
                                                        )}
                                                        {!timePeriod && (
                                                            <Typography variant="h2" sx={price}>
                                                                {`${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: plan.currency_code }).format(Number(plan.amount))}`}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button type='button' color={plan.featured ? 'primary' : 'secondary'} variant={plan.featured ? 'contained' : 'outlined'} fullWidth onClick={()=>{
                                                        setCookie("membership_package_id",plan.membership_package_id);
                                                        router.push("app/auth/register");
                                                    }}>
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
                                            {plan.detail.map((list, i) => (
                                                <Fragment key={i}>
                                                    <ListItem sx={!plan.detail.includes(list) ? priceListDisable : {}}>
                                                        <ListItemText primary={list.name} sx={{ textAlign: 'center' }} />
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