export interface PatientFamilyDiseaseHistoryListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: PatientFamilyDiseaseHistoryListData[]
  }
  
  export interface PatientFamilyDiseaseHistoryListData {
    patient_family_disease_history_id: number
    patient_id: number
    patient_name: string
    patient_surname: string
    disease_status_id: number
    disease_status_name: string
    kinship_degree_id: number
    kinship_degree_name: string
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
  
  export interface PatientFamilyDiseaseHistoryCreateBodyModel {
    patient_family_disease_history_id?: number | null
    patient_id?: number | string | null
    kinship_degree_id: number | null
    disease_status_id: number | null
    name: string
    start_date: string | null
    end_date: string | null
    status: boolean
  }
  