export interface StockListModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  page: number
  pageSize: number
  totalCount: number
  totalPage: number
  data: StockData[]
}

export interface StockData {
  stock_id: string
  appointment_id: string
  appointment_start: string
  patient_id: string
  patient_name: string
  patient_full_name: string
  quantity: string
  movement_type: boolean
  process_date: string
  created_at: string
  updated_at: string
  deleted_at: any
  created_by: string
  updated_by: any
  deleted_by: any
  status: boolean
  ref_currency: string
  ref_appointment_process_type: string
  appointment_process_id: string
  appointment_process_code: string
  appointment_process_name: string
  description: any
  amount: string
  vat: number
  vat_included: boolean
  stock_summary: string
  critical_stock?: string
  notify_critical_stock: boolean
  islemler?: any
}

export interface StockCreateBodyModel {
  appointment_process_id: string
  quantity: string
  movement_type: boolean
  process_date: string
  description: string | null
  status: boolean
}

export interface StockReadResultModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: StockReadData
}

export interface StockReadData {
  id: string
  ref_appointment_process: string
  ref_appointment: any
  quantity: string
  movement_type: boolean
  process_date: string
  created_at: string
  updated_at: string
  deleted_at: any
  created_by: string
  updated_by: any
  deleted_by: any
  status: boolean
}
