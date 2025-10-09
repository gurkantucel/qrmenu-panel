export interface DieticianPatientDietTemplateListModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  page: number
  pageSize: number
  totalCount: number
  totalPage: number
  data: DieticianPatientDietTemplateListData[]
}

export interface DieticianPatientDietTemplateListData {
  patient_diet_template_id: string
  diet_template_id: string
  diet_template_code: string
  diet_template_name: string
  diet_template_description: any
  person_id: string
  person_name: string
  person_surname: string
  person_full_name: string
  patient_id: string
  patient_name: string
  patient_surname: string
  patient_full_name: string
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
  created_by: string
  created_user: string
  updated_by: any
  updated_user: any
  status: boolean
  islemler?:string
}

export interface CreateDieticianPatientDietTemplateBodyModel {
  patient_diet_template_id?: string
  diet_template_id: string
  //person_id: string
  patient_id: string
  start_date: string | null
  end_date: string | null
  detail: DieticianPatientDietTemplateDetail[]
  status: boolean
}

export interface DieticianPatientDietTemplateDetail {
  day: number
  detail?: DieticianPatientDietTemplateDetail2[]
}

export interface DieticianPatientDietTemplateDetail2 {
  patient_diet_template_detail_id?: string
  meal_time_id?: string | null
  name: string | null
  calorie: string | null
  note: string | null
  status: boolean
}

export interface DieticianPatientDietTemplateReadModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: DieticianPatientDietTemplateReadData
}

export interface DieticianPatientDietTemplateReadData {
  patient_diet_template_id: string
  diet_template_id: string
  diet_template_code: string
  diet_template_name: string
  diet_template_description: any
  dietitian_id: string
  dietitian_name: string
  dietitian_surname: string
  dietitian_full_name: string
  patient_id: string
  patient_name: string
  patient_surname: string
  patient_full_name: string
  start_date: string
  end_date: string
  detail: DieticianPatientDietTemplateReadDetail[]
  created_at: string
  updated_at: string
  created_by: string
  created_user: string
  updated_by: any
  updated_user: any
  status: boolean
}

export interface DieticianPatientDietTemplateReadDetail {
  patient_diet_template_detail_id: string
  meal_time_id?: string
  meal_time_code?: string
  meal_time_name?: string
  name: string | null
  calorie: string | null
  note: string | null
  day: number
}
