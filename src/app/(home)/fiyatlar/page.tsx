import React from 'react'
import { getHomeMembershipPackages } from '../landing/actions';
import PriceLandingPage from 'sections/landing/Price';
import { Grid } from '@mui/material';

const PricePage = async () => {
    const result = await getHomeMembershipPackages();
    return (
        <Grid container spacing={12} justifyContent="center" alignItems="center" sx={{ pt: 30, pb: 10.5 }}>
            <PriceLandingPage result={result} />
        </Grid>
    )
}

export default PricePage