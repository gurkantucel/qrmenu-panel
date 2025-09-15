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
