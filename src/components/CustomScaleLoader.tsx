import { Grid } from '@mui/material'
import React from 'react'
import { ScaleLoader } from 'react-spinners'

const CustomScaleLoader = () => {
    return (
        <Grid container height={"100%"} padding={10} justifyContent={"center"} alignItems={"center"} alignContent={"center"}>
            <ScaleLoader color="#00a854" />
        </Grid>
    )
}

export default CustomScaleLoader