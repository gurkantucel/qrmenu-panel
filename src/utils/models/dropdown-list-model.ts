export interface DropdownListModel {
    status: boolean
    messageCode: string
    message: string
    data: DropdownListData[]
  }
  
  export interface DropdownListData {
    value: string
    label: string
    field?: string
  }
  