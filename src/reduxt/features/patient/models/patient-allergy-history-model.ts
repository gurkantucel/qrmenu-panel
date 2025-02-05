export interface PatientAllergyHistoryListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: PatientAllergyHistoryListData[]
}

export interface PatientAllergyHistoryListData {
    patient_allergy_history_id: string
    patient_id: string
    patient_name: string
    patient_surname: string
    patient_full_name: string
    name: string
    complications: string
    start_date: string
    end_date: any
    created_at: string
    updated_at: string
    created_by: string
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
    islemler?:string
}

export interface PatientAllergyHistoryCreateBodyModel {
    patient_allergy_history_id?: string | null
    patient_id?: number | string
    name: string
    complications: string | null
    start_date: string | null
    end_date: string | null
    status: boolean
}
