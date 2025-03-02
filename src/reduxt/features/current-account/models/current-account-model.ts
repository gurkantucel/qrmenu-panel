export interface CurrentAccountReadListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: CurrentAccountData
  }
  
  export interface CurrentAccountData {
    name: string
    description: any
    phone_code: string
    phone_number: string
    tax_identification_number: string
    mersis_number: any
    sgk_number: any
    country_id: string
    country_name: string
    city_id: string
    city_name: string
    district_id: string
    district_name: string
    zip_code: any
    address: string
    picture: any
    membership_code: string
    membership_name: string
    membership_start_date: string
    membership_end_date: string
    sms_header: any
    sms_username: any
    sms_password: any
    total_used_sms: number
    total_file_count: number
    total_storage: number
    total_used_storage: string
    total_remaining_storage: string
    total_usage_percentage: string
  }
  