export interface StaticPageResultModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: StaticPageResultData
  }
  
  export interface StaticPageResultData {
    static_page_id: string
    code: string
    name: string
    title: string
    content: string
    description: string
    keyword: string
    created_at: string
    updated_at: string
    created_by: any
    created_person: any
    updated_by: any
    updated_person: any
    status: boolean
  }
  