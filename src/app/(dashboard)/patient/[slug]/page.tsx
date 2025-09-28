import React from 'react'
import PatientTabsView from 'views/patient/PatientTabsView'

const PatientDetailPage = ({ params }: { params: { slug: string } }) => {
  return (
    <PatientTabsView params={params} />
  )
}

export default PatientDetailPage