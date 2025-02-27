export interface BlogListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: BlogData[]
  }
  
  export interface BlogData {
    blog_id: string
    title: string
    slug: string
    thumb: any
    content: string
    description: string
    keyword: string
    created_at: string
    updated_at: string
    created_person: any
    updated_person: any
    status: boolean
  }
  