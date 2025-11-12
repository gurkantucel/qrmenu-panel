//REGISTER
export interface RegisterBodyModel {
  membership_package_id: string
  person_name: string
  person_surname: string
  person_phone_code: string
  person_phone_number: string
  person_email: string
  company_name: string
  branch_id: string
  country_id: string
  city_id: string
  district_id: string
  address: string
  status: boolean
  recaptcha?:string
}


//LOGIN
export interface LoginResultModel {
  data: LoginData
  success: boolean
  message: string
}

export interface LoginData {
  kind: string
  localId: string
  email: string
  displayName: string
  idToken: string
  registered: boolean
  refreshToken: string
  expiresIn: string
}

export interface User {
  user_id: number
  username: string
  status: boolean
}

export interface Person {
  person_id: string
  name: string
  surname: string
  full_name: string
  email: string
  person_type_id: string
  person_type_name: string
  status: boolean
}

export interface PersonAuthorization {
  module_id: number
  code: string
  name: string
}

export interface CurrentAccount {
  current_account_id: number
  name: string
  description: any
  phone_code: string
  phone_number: string
  tax_identification_number: any
  mersis_number: any
  sgk_number: any
  package_id: number
  package_name: string
  membership_package_name: string
  membership_start_date: string
  membership_end_date: string
  country_id: number
  country_name: string
  city_id: number
  city_name: string
  district_id: number
  district_name: string
  zip_code: any
  address: string
  picture: any
  status: boolean
}

export interface LoginBodyModel {
  email: string
  password: string
  recaptcha?:string
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

export interface Membership {
  membership_start_date:string
  membership_end_date: string
  membership_package_name: string
}