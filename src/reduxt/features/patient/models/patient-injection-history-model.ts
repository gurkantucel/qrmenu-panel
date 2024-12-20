export interface PatientInjectionHistoryListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: PatientInjectionHistoryListData[]
}

export interface PatientInjectionHistoryListData {
    patient_injection_history_id: number
    patient_id: number
    appointment_id: any
    appointment_date: any
    treatment_method_id: number
    treatment_method_name: string
    injection_type_id: number
    injection_type_name: string
    patient_name: string
    patient_surname: string
    name: string
    injection_date: string
    complications: any
    created_at: string
    updated_at: string
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    dosage:string
    status: boolean
    islemler?:string
}

export interface PatientInjectionHistoryCreateBodyModel {
    patient_injection_history_id?: number | null
    patient_id?: number | string
    appointment_id: number| null
    treatment_method_id: number| null
    injection_type_id: number| null
    name: string
    dosage: string | null
    injection_date: string | null
    complications: string | null
    status: boolean
}
