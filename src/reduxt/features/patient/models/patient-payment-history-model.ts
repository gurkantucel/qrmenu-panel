export interface PatientPaymentHistoryListResultModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: PatientPaymentHistoryListData[]
}

export interface PatientPaymentHistoryListData {
    patient_payment_history_id: string
    patient_id: string
    name: string
    surname: string
    appointment_process_type_id: string
    appointment_process_type_name: string
    appointment_id: any
    appointment_start: any
    payment_kind_id: string
    payment_kind_name: string
    payment_method_id: string
    payment_method_name: string
    currency_id: string
    currency_name: string
    amount: string
    created_at: string
    updated_at: string
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
    islemler?:string
}

export interface PatientPaymentHistoryReadResultModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: PatientPaymentHistoryReadData
}

export interface PatientPaymentHistoryReadData {
    patient_payment_history_id: number
    patient_id: number
    name: string
    surname: string
    appointment_process_type_id: string
    appointment_process_type_name: string
    appointment_id: any
    appointment_start: any
    payment_kind_id: string
    payment_kind_name: string
    payment_method_id: string
    payment_method_name: string
    currency_id: string
    currency_name: string
    amount: string
    created_at: string
    updated_at: string
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
}


export interface PatientPaymentHistoryCreateBodyModel {
    patient_payment_history_id?: number | string | null
    patient_id?: number | string | null
   //appointment_process_type_id?: number | null
    appointment_id: string | null
    payment_kind_id: string | null
    payment_method_id: string | null
    currency_id: string | null
    discount_amount: number
    discount_percentage: number
    amount: number | null
    status: boolean
}
