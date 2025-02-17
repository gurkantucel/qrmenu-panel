export interface PackageDropdownListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: PackageDropdownData[]
  }
  
  export interface PackageDropdownData {
    value: string
    label: string
    amount: string
    vat: number
    total: string
    currency_code: string
  }
  