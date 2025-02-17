export interface MembershipPackagesListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: MembershipPackagesListData[]
  }
  
  export interface MembershipPackagesListData {
    membership_package_id: string
    code: string
    name: string
    description: string
    amount: string
    total_amount: string
    vat: number
    vat_amount?: string
    total: string
    currency_code: string
    currency_name: string
    featured: boolean
    duration: number
    discountAmount?: string
    detail: MembershipPackagesListDataDetail[]
  }
  
  export interface MembershipPackagesListDataDetail {
    name: string
  }
  