//REGISTER
export interface RegisterBodyModel {
  package_id: number
  person_name: string
  person_surname: string
  person_phone_code: string
  person_phone_number: string
  person_email: string
  company_name: string
  branch_id: number
  country_id: number
  city_id: number
  district_id: number
  address: string
  status: boolean
}


//LOGIN
export interface LoginResultModel {
  status: boolean
  messageCode: string
  message: string
  data: LoginData
}

export interface LoginData {
  user: User
  companies: any[]
  token: string
  refresh_token: string
}

export interface User {
  id: number
  username: string
  password: string
  status: boolean
}

export interface LoginBodyModel {
  username: string
  password: string
}

export interface UsernameBodyModel {
  username: string
}

//RESET-PASSWORD
export interface ResetPasswordBodyModel {
  reset_token: string
  new_password: string
  confirm_password: string
}
