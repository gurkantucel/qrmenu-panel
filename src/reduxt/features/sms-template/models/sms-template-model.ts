export interface SmsTemplateListResultModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: SmsTemplateData[]
  }
  
  export interface SmsTemplateData {
    sms_template_id: number
    sms_notification_type_id: number
    sms_notification_type_code: string
    sms_notification_type_name: string
    sms_template_code: string
    sms_template_name: string
    sms_template_description: string
    created_at: string
    updated_at: string
    created_by: any
    created_person: any
    updated_by: any
    updated_person: any
    status: boolean
    islemler?:string
  }

  export interface UpdateSmsTemplateBodyModel {
    sms_template_id: number
    status: boolean
  }
  
  