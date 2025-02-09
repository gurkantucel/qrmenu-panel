export interface TenantPaymentListResultModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  page: number
  pageSize: number
  totalCount: number
  totalPage: number
  data: TenantPaymentListData[]
}

export interface TenantPaymentListData {
  payment_id: string
  appointment_id: any
  appointment_start: any
  patient_id: string
  patient_name: string
  patient_surname: string
  patient_full_name: string
  payment_method_id: string
  payment_method_name: string
  payment_date: string
  payment_note: any
  currency_code: string
  currency_name: string
  amount: string
  quantity: string
  vat_amount: string
  discount_amount: string
  total: string
  created_at: string
  updated_at: string
  created_by: string
  created_person: string
  updated_by: any
  updated_person: any
  status: boolean
  islemler?:string
}


export interface TenantPaymentReadResultModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: TenantPaymentReadData
}

export interface TenantPaymentReadData {
  payment_id: string
  appointment_id: any
  appointment_start: any
  patient_id: string
  patient_name: string
  patient_surname: string
  patient_full_name: string
  payment_method_id: string
  payment_method_name: string
  payment_date: string
  payment_note: any
  currency_code: string
  currency_name: string
  amount: string
  quantity: string
  vat_amount: string
  discount_amount: string
  total: string
  detail: TenantPaymentReadDataDetail[]
  created_at: string
  updated_at: string
  created_by: string
  created_person: string
  updated_by: any
  updated_person: any
  status: boolean
}

export interface TenantPaymentReadDataDetail {
  payment_detail_id: string
  payment_id: string
  appointment_process_type_code: string
  appointment_process_type_name: string
  appointment_process_code: string
  appointment_process_name: string
  appointment_process_description: any
  currency_code: string
  currency_name: string
  amount: number
  quantity: number
  discount_percentage: number
  discount_amount: number
  vat: number
  vat_included: boolean
  vat_amount: number
  total: number
}


export interface TenantPaymentCreateBodyModel {
  payment_id: string | null
  appointment_id: string | null
  patient_id: string | null
  payment_method_id: string | null
  payment_date: string | null
  payment_note: string | null
  detail: TenantPaymentCreateDetail[]
  status: boolean
}

export interface TenantPaymentCreateDetail {
  payment_id: string | null
  appointment_process_type_code: string | null
  appointment_process_type_name: string | null
  appointment_process_code: string | null
  appointment_process_name: string | null
  appointment_process_description: string | null 
  currency_code: string | null
  currency_name: string | null
  amount: number
  quantity: number
  discount_percentage: number
  discount_amount: any
  vat: number
  vat_included: boolean
  vat_amount: any
  total: any
  status: boolean
}
