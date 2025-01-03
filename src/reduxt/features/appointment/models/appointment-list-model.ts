export interface AppointmentListResultModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: AppointmentListData[]
  }
  
  export interface AppointmentListData {
    appointment_id: number
    patient_id: number
    patient_name: string
    patient_surname: string
    patient_full_name: string
    person_id: number
    person_name: string
    person_surname: string
    person_full_name: string
    appointment_status_id: number
    appointment_status_name: string
    background_color: string
    font_color: string
    all_day: boolean
    appointment_start: string
    appointment_duration: number
    appointment_end: string
    appointment_note: any
    created_at: string
    updated_at: string
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
    islemler?:string
  }
  
  export interface AppointmentCreateBodyModel {
    apppointment_id?: number | string |  null
    patient_id?: number | string |  null
    patient_name?: string |  null
    patient_surname?: string |  null
    patient_identity_number?: string |  null
    patient_phone_code?: string |  null
    patient_phone_number?: string |  null
    patient_birthdate?: string |  null
    person_id: number | string |  null
    appointment_status_id: number | string |  null
    all_day: boolean | null
    appointment_start: string |  null
    appointment_duration: number | null
    appointment_end: string |  null
    appointment_note: string |  null
    status: boolean
  }
  
  export interface AppointmentReadResultModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: AppointmentReadResultData
  }
  
  export interface AppointmentReadResultData {
    appointment_id: number
    patient_id: number
    patient_name: string
    patient_surname: string
    patient_full_name: string
    person_id: number
    person_name: string
    person_surname: string
    person_full_name: string
    appointment_status_id: number
    appointment_status_name: string
    background_color: string
    font_color: string
    all_day: boolean
    appointment_start: string
    appointment_duration: number
    appointment_end: string
    appointment_note: any
    created_at: string
    updated_at: string
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
  }
  