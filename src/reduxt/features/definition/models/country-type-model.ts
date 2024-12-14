export interface CountryListResultModel {
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: CountryListData[]
  }
  
  export interface CountryListData {
    id: number
    code: string
    name: string
    created_at: string
    updated_at: string
    deleted_at: any
    created_by: any
    updated_by: any
    deleted_by: any
    status: boolean
  }
  