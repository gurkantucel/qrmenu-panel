export interface DropdownListModel {
  success: boolean
  message: string
  data: DropdownListData[]
}

export interface DropdownListData {
  value: string
  label: any
  field?: string
}
