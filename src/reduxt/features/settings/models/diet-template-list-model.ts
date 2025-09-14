export interface DieticianDietTemplateListModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  page: number
  pageSize: number
  totalCount: number
  totalPage: number
  data: DieticianDietTemplateListData[]
}

export interface DieticianDietTemplateListData {
  diet_template_id: string
  code: string
  name: string
  description: any
  created_at: string
  updated_at: string
  created_by: string
  created_user: string
  updated_by: string
  updated_user: string
  status: boolean
  islemler?:string
}


export interface CreateDieticianDietTemplateBodyModel {
  diet_template_id?: string
  person_id?: string
  code: string
  name: string
  description: string | null
  detail: DietTemplateDetail[]
  status: boolean
}

export interface DietTemplateDetail {
  day: number
  detail: DietTemplateDetail2[]
}

export interface DietTemplateDetail2 {
  meal_time_id?: string
  name?: string
  calorie?: string
  note?: string
  status: boolean
}

export interface DieticianDietTemplateReadModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: DieticianDietTemplateReadData
}

export interface DieticianDietTemplateReadData {
  diet_template_id: string
  code: string
  name: string
  description: string | null
  detail: DieticianDietTemplateReadDetail[]
  created_at: string
  updated_at: string
  created_by: string
  created_user: string
  updated_by: any
  updated_user: any
  status: boolean
}

export interface DieticianDietTemplateReadDetail {
  day: number
  detail: DieticianDietTemplateReadDetail2[]
}

export interface DieticianDietTemplateReadDetail2 {
  meal_time_id: string
  name: string
  calorie: string
  note: string
  status: boolean
}
