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
    expander?: string
    appointment_process_id: string
    currency_id: string
    currency_name: string
    currency_code: string
    appointment_process_type_id: string
    appointment_process_type_name: string
    code: string
    name: string
    description: any
    amount: string | number
    total: string | number
    vat: number
    vat_included: boolean
    detail?: Detail[]
    created_at: string
    updated_at: string
    deleted_at: any
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
    stock_summary: string
    critical_stock: string | null
    notify_critical_stock: boolean
    islemler?: string
}

export interface Detail {
    expander?: string
    appointment_process_id: string
    currency_id: string
    currency_name: string
    currency_code: string
    appointment_process_type_id: string
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
    stock_summary: string
    critical_stock: string
    notify_critical_stock: boolean
    islemler?: string
}

export interface CreateAppointmentProcessBodyModel {
    appointment_process_id?: number | string | null
    currency_id: string | null
    appointment_process_type_id: string | null
    code: string | null
    name: string | null
    description: string | null
    amount?: number | string | null
    total?: number | string | null
    vat: number | null | string
    vat_included: boolean
    sub_appointment_process: string[] | null
    quantity: string | null
    critical_stock: string | null
    notify_critical_stock: boolean
    status: boolean
}

export interface ReadAppointmentProcessModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: ReadAppointmentProcessData
}

export interface ReadAppointmentProcessData {
  appointment_process_id: string
  currency_id: string
  currency_name: string
  currency_code: string
  appointment_process_type_id: string
  appointment_process_type_code: string
  appointment_process_type_name: string
  code: string
  name: string
  description: any
  amount: string
  vat: number
  stock_summary: string
  critical_stock: string
  notify_critical_stock: boolean
  total: string
  vat_included: boolean
  detail: any
  created_at: string
  updated_at: string
  deleted_at: any
  created_by: string
  created_person: string
  updated_by: any
  updated_person: any
  status: boolean
}
