"use client"

import { Grid } from '@mui/material'
import MainCard from 'components/MainCard'
import React from 'react'
import AppointmentInfoView from './appointment-info/AppointmentInfoView'
import AppointmentFileTable from './appointment-file/AppointmentFileTable'
import AppointmentProcessTypeTable from './appointment-process-type/AppointmentProcessTypeTable'
import AppointmentNoteView from './appointment-note/AppointmentNoteView'
import AppointmentUpdateStatus from './appointment-update-status/AppointmentUpdateStatus'

const AppointmentDetailView = () => {
  return (
    <>
      <AppointmentUpdateStatus />
      <MainCard content={false}>
        <Grid container spacing={3} padding={4}>
          <AppointmentInfoView />
          <AppointmentProcessTypeTable />
          <AppointmentNoteView />
          <AppointmentFileTable />
        </Grid>
      </MainCard>
    </>
  )
}

export default AppointmentDetailView 