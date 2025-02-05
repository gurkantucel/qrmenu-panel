export interface AppointmentProcessListResultModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: AppointmentProcessListData[]
}

export interface AppointmentProcessListData {
    expander?:string
    appointment_process_id: number
    currency_id: number
    currency_name: string
    currency_code: string
    appointment_process_type_id: number
    appointment_process_type_name: string
    code: string
    name: string
    description: any
    amount: string | number
    vat: number
    detail?: Detail[]
    created_at: string
    updated_at: string
    deleted_at: any
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
    islemler?:string
}

export interface Detail {
    expander?:string
    appointment_process_id: number
    currency_id: number
    currency_name: string
    currency_code: string
    appointment_process_type_id: number
    appointment_process_type_name: string
    code: string
    name: string
    description: any
    amount: number
    vat: number
    detail: any
    created_at: string
    updated_at: string
    deleted_at: any
    created_by: number
    created_person: string
    updated_by: string
    updated_person: any
    status: boolean
    islemler?:string
}

export interface CreateAppointmentProcessBodyModel {
    appointment_process_id?: number | string | null
    currency_id: number | null
    appointment_process_type_id: number | null
    code: string | null
    name: string | null
    description: string | null
    amount?: number | string | null
    vat: number | null | string
    vat_included: boolean
    sub_appointment_process: number[] | null
    status: boolean
}
