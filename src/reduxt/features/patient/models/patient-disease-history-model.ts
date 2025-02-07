export interface PatientDiseaseHistoryListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: PatientDiseaseHistoryListData[]
  }
  
  export interface PatientDiseaseHistoryListData {
    patient_disease_history_id: number
    patient_id: number
    patient_name: string
    patient_surname: string
    disease_status_id: number
    disease_status_name: string
    name: string
    start_date: any
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
  
  export interface PatientDiseaseHistoryCreateBodyModel {
    patient_disease_history_id?: number | null
    patient_id?: number | string | null
    disease_status_id: string | null
    name: string | null
    start_date?: string | null
    end_date?: string | null 
    status: boolean
  }
  