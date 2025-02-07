export interface AppointmentProcessTypeListResultModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: AppointmentProcessTypeData[]
}

export interface AppointmentProcessTypeData {
    expander?:string
    appointment_history_id: number
    appointment_id: number
    patient_id: number
    patient_name: string
    patient_surname: string
    patient_full_name: string
    appointment_start: string
    appointment_duration: number
    appointment_end: string
    currency_id: number
    currency_code: string
    currency_name: string
    appointment_process_type_id: number
    appointment_process_type_name: string
    parent_appointment_process_history_id: any
    code: string
    name: string
    description: any
    amount: string
    discount_percentage: number
    discount_amount: string
    quantity: string
    vat: number
    vat_included: boolean
    vat_amount: string
    total: string
    sub_appointment_process?: SubAppointmentProcess[]
    created_at: string
    updated_at: string
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
    islemler?: string
}

export interface SubAppointmentProcess {
    appointment_history_id: number
    appointment_id: number
    patient_id: number
    patient_name: string
    patient_surname: string
    patient_full_name: string
    appointment_start: string
    appointment_duration: number
    appointment_end: string
    currency_id: number
    currency_code: string
    currency_name: string
    appointment_process_type_id: number
    appointment_process_type_name: string
    code: string
    name: string
    description: any
    amount: number
    discount_percentage: number
    discount_amount: number
    quantity: string | number
    vat: number
    vat_included: boolean
    vat_amount: string
    total: string
    created_at: string
    updated_at: string
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
    islemler?: string
  }

export interface AppointmentProcessTypeCreateBodyModel {
    data: AppointmentProcessTypeCreateData[]
}

export interface AppointmentProcessTypeCreateData {
    appointment_id: number | null
    patient_id: number | null
    appointment_process_id: number | null
    quantity: string | null
    amount: number | null
    discount_percentage: number | null
    vat: number | null
    vat_included: boolean
    total: number | string | null
    currency_code?: number | null
    status: boolean
}

export interface AppointmentProcessTypeReadModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: AppointmentProcessTypeReadData
}

export interface AppointmentProcessTypeReadData {
    appointment_history_id: number
    appointment_id: number
    patient_id: number
    patient_name: string
    patient_surname: string
    patient_full_name: string
    appointment_start: string
    appointment_duration: number
    appointment_end: string
    currency_id: number
    currency_code: string
    currency_name: string
    appointment_process_type_id: number
    appointment_process_type_name: string
    parent_appointment_process_history_id: any
    code: string
    name: string
    description: any
    amount: string
    vat: number
    sub_appointment_process: any
    created_at: string
    updated_at: string
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
}

export interface AppointmentProcessDropdownModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: AppointmentProcessDropdownData[]
}

export interface AppointmentProcessDropdownData {
    value: string
    label: string
    appointment_process_code: string
    appointment_process_name: string
    appointment_process_description?: string | null
    vat: number,
    vat_included: boolean
    appointment_process_type_code: string
    appointment_process_type_name: string
    currency_code: string
    amount: string
}

export interface AppointmentProcessTypeUpdateBodyModel {
    appointment_process_history_id: number
    appointment_id: number
    amount: number
}
