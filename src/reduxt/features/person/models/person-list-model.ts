export interface PersonListModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  page: number
  pageSize: number
  totalCount: number
  totalPage: number
  data: PersonListData[]
}

export interface PersonListData {
  person_id: number
  user_id: number
  person_type_id: number
  person_type_name: string
  name: string
  surname: string
  full_name: string
  phone_code: string
  phone_number: string
  email: string
  created_at: string
  updated_at: string
  created_by: any
  created_person: any
  updated_by: any
  updated_person: any
  status: boolean
  islemler?: string
}

export interface PersonCreateBodyModel {
  person_id?: number
  person_type_id: number
  name: string
  surname: string
  phone_code: string
  phone_number: string
  email: string
  password: string
  authorizations: number[]
  status: boolean
}

export interface PersonReadResultModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: PersonReadData
}

export interface PersonReadData {
  person_id: number
  person_type_id: number
  person_type_name: string
  user_id: number
  name: string
  surname: string
  phone_code: string
  phone_number: string
  email: string
  person_authorizations: PersonAuthorization[]
  created_at: string
  updated_at: string
  created_by: number
  created_person: string
  updated_by: any
  updated_person: any
  status: boolean
}

export interface PersonAuthorization {
  module_id: number
  module_code: string
  module_name: string
}
