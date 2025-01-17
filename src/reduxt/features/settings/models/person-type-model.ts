export interface PersonTypeListResultModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: PersonTypeData[]
}

export interface PersonTypeData {
    person_type_id: number
    code: string
    name: string
    description: string
    created_at: string
    updated_at: string
    deleted_at: any
    created_by: any
    created_person: any
    updated_by: any
    updated_person: any
    status: boolean
    islemler?:string
}

export interface PersonTypeCreateBodyModel {
    person_type_id?: number | null
    code: string
    name: string
    description?: string | null
    status: boolean
}
