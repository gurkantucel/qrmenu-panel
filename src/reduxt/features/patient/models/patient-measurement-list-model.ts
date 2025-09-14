export interface CreateDieticianPatientMeasurementBodyModel {
  measurement_id?: string
  appointment_id: string | null
  person_id: any
  patient_id: string
  weight: string
  height: string
  bmi: string | null
  waist: string
  hip: string
  whr: string | null
  chest: string
  measurement_date: string
  status: boolean
}

export interface DieticianPatientMeasurementListModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  page: number
  pageSize: number
  totalCount: number
  totalPage: number
  data: DieticianPatientMeasurementData[]
}

export interface DieticianPatientMeasurementData {
  measurement_id: string
  appointment_id: any
  appointment_start: any
  patient_id: string
  patient_name: string
  patient_surname: string
  patient_full_name: string
  person_id: string
  dietitian_name: string
  dietitian_surname: string
  dietitian_full_name: string
  height: string
  weight: string
  bmi: string
  waist: string
  hip: string
  whr: string
  chest: string
  measurement_date: string
  created_at: string
  updated_at: string
  created_by: string
  created_user: string
  updated_by: any
  updated_user: any
  status: boolean
  islemler?: string
}

export interface DieticianPatientMeasurementChartModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: DieticianPatientMeasurementChartData[]
}

export interface DieticianPatientMeasurementChartData {
  label: string
  value: number
  height: any
  weight: any
  bmi: any
  waist: string
  hip: string
  whr: string
  chest: string
}
