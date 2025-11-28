export interface OrderListModel {
  success: boolean
  message: string
  data: OrderListData[]
}

export interface OrderListData {
  id: string
  userId: string
  status: string
  currencyCode: string
  vat: number
  totalPrice: number
  paidPrice: number
  vatAmount: number
  createdAt: string
  branches: OrderListBranch[]
  updatedAt?: string
  islemler?: string
}

export interface OrderListBranch {
  calculatedPrice: number
  currencyCode: string
  price: number
  branchId: string
  packageId: string
  packageType: string
  branchName?: string
}

export interface CalculatePackageModel {
  success: boolean
  message: string
  data: CalculatePackageData
}

export interface CalculatePackageData {
  packages: CalculatePackage[]
  vat: number
  currencyCode: string
  vatAmount: number
  totalPrice: number
  paidPrice: number
  startDate: string
  endDate: string
}

export interface CalculatePackage {
  id: string
  type: string
  vat: number
  currencyCode: string
  basePrice: number
  calculatedPrice: number
}

export interface CalculateBranchPackageModel {
  success: boolean
  message: string
  data: CalculateBranchPackageData
}

export interface CalculateBranchPackageData {
  packages: CalculateBranchPackage[]
  vat: number
  currencyCode: string
  vatAmount: number
  totalPrice: number
  paidPrice: number
  startDate: string
  endDate: string
}

export interface CalculateBranchPackage {
  id: string
  type: string
  vat: number
  currencyCode: string
  basePrice: number
  calculatedPrice: number
}

export interface CalculatePriceBodyModel {
  branchIds: string[]
}