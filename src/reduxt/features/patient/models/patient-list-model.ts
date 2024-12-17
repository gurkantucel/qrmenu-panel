export interface PatientListResultModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  page: number
  pageSize: number
  totalCount: number
  totalPage: number
  data: PatientListData[]
}

export interface PatientListData {
  patient_id: number
  gender_id: number
  gender_name: string
  name: string
  surname: string
  full_name: string
  identity_number: string
  phone_code: string
  phone_number: string
  email: string
  birthdate?: string
  age?:string
  country_id?: number
  country_name?: string
  city_id?: number
  city_name?: string
  district_id?: number
  district_name?: string
  address?: string
  emergency_full_name?: string
  emergency_phone_code?: string
  emergency_phone_number?: string
  created_at: string
  updated_at: string
  created_by: number
  created_person: string
  updated_by: any
  updated_person: any
  last_appointment_date?:string
  status: boolean
  islemler?:string
}

export interface PatientCreateBodyModel {
  patient_id?: number | null
  gender_id?: number | null
  name: string
  surname: string
  identity_number: string | null
  phone_code: string
  phone_number: string
  email: string | null
  birthdate: string | null
  country_id: number | null
  city_id: number | null
  district_id: number | null
  address: string | null
  emergency_full_name: string | null
  emergency_phone_code: string | null
  emergency_phone_number: string | null
  status: boolean
}

export interface PatientReadResultModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: PatientReadData
}

export interface PatientReadData {
  patient_id: number
  gender_id: number
  gender_name: string
  name: string
  surname: string
  identity_number: string
  phone_code: string
  phone_number: string
  email: string
  birthdate: any
  country_id: number
  country_name: string
  city_id: number
  city_name: string
  district_id: number
  district_name: string
  address: string
  emergency_full_name: any
  emergency_phone_code: any
  emergency_phone_number: any
  created_at: string
  updated_at: string
  created_by: number
  created_person: string
  updated_by: any
  updated_person: any
  status: boolean
}
