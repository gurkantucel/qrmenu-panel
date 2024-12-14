export interface DropdownListModel {
    status: boolean
    messageCode: string
    message: string
    data: DropdownListData[]
  }
  
  export interface DropdownListData {
    value: number
    label: string
  }
  