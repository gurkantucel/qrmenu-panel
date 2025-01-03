"use client"

import { Grid } from '@mui/material'
import MainCard from 'components/MainCard'
import React from 'react'
import AppointmentInfoView from './appointment-info/AppointmentInfoView'
import AppointmentFileTable from './appointment-file/AppointmentFileTable'
import AppointmentProcessTypeTable from './appointment-process-type/AppointmentProcessTypeTable'

const AppointmentDetailView = ({ params }: { params: { slug: string } }) => {
  return (
    <MainCard content={false}>
      <Grid container spacing={3} padding={4}>
        <AppointmentInfoView />
        <AppointmentProcessTypeTable />
        <AppointmentFileTable />
      </Grid>
    </MainCard>
  )
}

export default AppointmentDetailView 