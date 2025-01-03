import React from 'react'
import AppointmentDetailView from 'views/appointment/AppointmentDetailView'

const AppointmentDetailPage = ({ params }: { params: { slug: string } }) => {
  return (
    <AppointmentDetailView params={params} />
  )
}

export default AppointmentDetailPage