export interface CityListResultModel {
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: CityListData[]
  }
  
  export interface CityListData {
    id: number
    ref_country: RefCountry
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
  
  export interface RefCountry {
    id: number
    code: string
    name: string
  }
  