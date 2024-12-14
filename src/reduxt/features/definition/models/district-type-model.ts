export interface DistrictListResultModel {
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: DistrictData[]
  }
  
  export interface DistrictData {
    id: number
    ref_city: RefCity
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
  
  export interface RefCity {
    id: number
    code: string
    name: string
  }
  