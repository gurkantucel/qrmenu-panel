export interface RefreshTokenResultModel {
  data: RefreshTokenData
  message: string
  success: boolean
}

export interface RefreshTokenData {
  refresh_token: string
  token: string
}
