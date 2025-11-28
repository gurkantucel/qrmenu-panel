export interface TranslateResultModel {
  success: boolean
  message: string
  data: TranslateData
}

export interface TranslateData {
  TR: string
  EN: string
  DE: string
}

export interface TranslateBodyModel {
  text: string
  langs: string[]
}

