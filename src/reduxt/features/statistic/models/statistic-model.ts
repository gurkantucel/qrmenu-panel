export interface StatisticReadModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: StaticReadData
}

export interface StaticReadData {
  appointmentStats: AppointmentStats
  readVenue: ReadVenue[]
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

export interface ReadVenue {
  currency_code: string
  amount: number
  increase: number
  this_month: number
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
  increase: number
}

export interface MostAppointmentProcess {
  process_name: string
  start_date: string
  end_date: string
}

export interface MostPerson {
  person_name: string
  start_date: string
  end_date: string
}

export interface MostProcessDay {
  count: number
  date: string
}
