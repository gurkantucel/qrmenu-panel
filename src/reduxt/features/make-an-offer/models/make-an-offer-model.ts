export interface MakeAnOfferListResultModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: MakeAnOfferListData[]
}

export interface MakeAnOfferListData {
    quote_id: string
    patient_id: string
    patient_name: string
    patient_surname: string
    patient_full_name: string
    identity_number: any
    phone_code: string
    phone_number: string
    person_name: string
    person_surname: string
    person_full_name: string
    expiration: string
    total: string
    currency_code: string
    quote_note: any
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

export interface AppointmentProcess {
    process_type_name: string
    process_name: string
    process_description: any
    currency_code: string
    amount: number
}

export interface MakeAnOfferReadResultModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: MakeAnOfferReadData
}

export interface MakeAnOfferReadData {
  quote_id: string
  patient_id: string
  patient_name: string
  patient_surname: string
  patient_full_name: string
  identity_number: any
  phone_code: string
  phone_number: string
  person_id: string
  person_name: string
  person_surname: string
  person_full_name: string
  expiration: string
  quote_note: any
  quote_detail: QuoteDetail[]
  created_at: string
  updated_at: string
  deleted_at: any
  created_by: string
  created_person: string
  updated_by: any
  updated_person: any
  status: boolean
}

export interface QuoteDetail {
  quote_id: string
  appointment_process_type_code: string
  appointment_process_type_name: string
  appointment_process_code: string
  appointment_process_name: string
  appointment_process_description?: string
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
  sub_quote_detail: any
  created_at: string
  updated_at: string
  deleted_at: any
  created_by: string
  created_person: string
  updated_by: any
  updated_person: any
  status: boolean
}

export interface MakeAnOfferCreateBodyModel {
  quote_id?: string | null
  patient_id?: string | null
  name?: string | null
  surname?: string | null
  identity_number?: string | null
  phone_code?: string | null
  phone_number?: string | null
  person_id: string | null
  expiration: string | null
  quote_note: string | null
  detail: MakeAnOfferDetail[]
  status: boolean
}

export interface MakeAnOfferDetail {
  quote_id: any
  appointment_process_type_code: string | null
  appointment_process_type_name: string | null
  appointment_process_code: string | null
  appointment_process_name: string | null
  appointment_process_description?: string | null
  currency_code: string | null
  currency_name: string | null
  amount: number
  quantity: number
  discount_percentage: number
  discount_amount: number
  vat: number
  vat_included: boolean
  vat_amount: number
  total: number
  status: boolean
}
