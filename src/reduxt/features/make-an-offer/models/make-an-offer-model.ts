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
    quote_id: number
    name: string
    surname: string
    identity_number: any
    phone_code: string
    phone_number: string
    person_name: string
    person_surname: string
    expiration: string
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

export interface MakeAnOfferCreateBodyModel {
    quote_id?: string | number | null
    name: string
    surname: string
    identity_number: any
    phone_code: string
    phone_number: string
    person_name: string
    person_surname: string
    expiration: string
    appointment_process: AppointmentProcess[]
    status: boolean
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
    quote_id: number
    name: string
    surname: string
    identity_number: any
    phone_code: string
    phone_number: string
    person_name: string
    person_surname: string
    expiration: string
    quote_note: any
    quote_detail: QuoteDetail[]
    created_at: string
    updated_at: string
    deleted_at: any
    created_by: number
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
  }
  
  export interface QuoteDetail {
    process_type_name: string
    process_name: string
    process_description: any
    currency_code: string
    amount: number
  }
  

