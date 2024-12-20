export interface PatientSurgeryHistoryListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: PatientSurgeryHistoryListData[]
  }
  
  export interface PatientSurgeryHistoryListData {
    patient_surgery_history_id: number
    patient_id: number
    appointment_id: any
    appointment_date: any
    treatment_method_id: number
    treatment_method_name: string
    patient_disease_history_id: any
    patient_disease_history_name: any
    patient_name: string
    patient_surname: string
    name: string
    surgery_date: any
    complications: any
    created_at: string
    updated_at: string
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
    islemler?:string
  }
  
  export interface PatientSurgeryHistoryCreateBodyModel {
    patient_surgery_history_id?: number | null
    patient_id?: number | string
    patient_disease_history_id: number | string | null
    appointment_id: number | string | null
    treatment_method_id: number | string | null
    name: string
    surgery_date: string | null
    complications: string | null
    status: boolean
  }
  