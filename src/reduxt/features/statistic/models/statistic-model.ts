export interface StatisticReadModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: StatisticData
}

export interface StatisticData {
  appointmentStats: AppointmentStats
  readVenue: any
  patientStats: PatientStats
  quoteStats: QuoteStats
  mostAppointmentProcess: MostAppointmentProcess
  mostPerson: MostPerson
  mostProcessDay: MostProcessDay
}

export interface AppointmentStats {
  total: number
  this_month: number
  increase: number
}

export interface PatientStats {
  total: number
  this_month: number
  increase: number
}

export interface QuoteStats {
  total: number
  this_month: number
  last_month: number
}

export interface MostAppointmentProcess {
  total: number
  this_month: number
  last_month: number
}

export interface MostPerson {
  total: number
  this_month: number
  last_month: number
}

export interface MostProcessDay {
  total: number
  this_month: number
  last_month: number
}
