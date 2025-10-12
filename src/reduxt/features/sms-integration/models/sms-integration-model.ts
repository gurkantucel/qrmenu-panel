export interface SmsIntegrationResultModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: SmsIntegrationData
}

export interface SmsIntegrationData {
  current_account_sms_info_id: string
  current_account_id: string
  current_account_name: string
  header: string
  username: string
  password: string
  created_at: string
  updated_at: string
  created_person: string
  updated_person: any
  status: boolean
}

export interface UpdateSmsInfoBodyModel {
  header: string
  username: string
  password: string
  status: boolean
}

export interface SendSmsListModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  page: number
  pageSize: number
  totalCount: number
  totalPage: number
  data: SendSmsListData[]
}

export interface SendSmsListData {
  sms_id: string
  sms_notification_type_id?: string
  sms_notification_type_name?: string
  appointment_id?: string
  appointment_start?: string
  patient_id: string
  patient_name: string
  patient_surname: string
  patient_full_name: string
  phone_code: string
  phone_number: string
  content: string
  result_code: string
  created_at: string
  updated_at: string
  created_by: string
  created_person: string
  updated_by?: string
  updated_person?: string
  status: boolean
  islemler?:string
}

export interface CreateSendSmsBodyModel {
  receivers: string[] | null
  all_patients: boolean
  content: string | null
}
