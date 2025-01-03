export interface PatientMedicineHistoryListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: PatientMedicineHistoryListData[]
  }
  
  export interface PatientMedicineHistoryListData {
    patient_medicine_history_id: number
    patient_id: number
    appointment_id: any
    appointment_date: any
    patient_disease_history_id: any
    patient_disease_history_name: any
    patient_name: string
    patient_surname: string
    name: string
    dosage: string
    usage_period: string
    start_date: string
    end_date: any
    created_at: string
    updated_at: string
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
    islemler?:string
  }
  
  export interface PatientMedicineHistoryCreateBodyModel {
    patient_medicine_history_id?: number | null
    patient_id?: string | number | null
    patient_disease_history_id: number | null
    appointment_id: number | null
    name: string
    dosage: string | null
    usage_period: string | null
    start_date: string | null
    end_date?: string | null
    status: boolean
  }
  