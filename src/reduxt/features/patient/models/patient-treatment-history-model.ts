export interface PatientTreatmentHistoryListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: PatientTreatmentHistoryListData[]
}

export interface PatientTreatmentHistoryListData {
    patient_treatment_history_id: number
    patient_id: number
    appointment_id: any
    appointment_date: any
    patient_disease_history_id: any
    patient_disease_history_name: any
    patient_name: string
    patient_surname: string
    name: string
    treatment_date: any
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

export interface PatientTreatmentHistoryCreateBodyModel {
    patient_treatment_history_id?: number | null
    patient_id?: number | string
    patient_disease_history_id: number| null
    appointment_id: number | null
    name: string
    treatment_date: string | null
    complications: string | null
    status: boolean
}

