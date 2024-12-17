import { Grid } from '@mui/material'
import React from 'react'
import { ScaleLoader } from 'react-spinners'

const CustomScaleLoader = () => {
    return (
        <Grid container padding={10} justifyContent={"center"} alignItems={"center"}>
            <ScaleLoader color="#00a854" />
        </Grid>
    )
}

export default CustomScaleLoader