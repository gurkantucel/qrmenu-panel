export interface BranchListModel {
  success: boolean
  message: string
  data: BranchListData[]
}

export interface BranchListData {
  id: string
  companyId: string
  title: string
  country: string
  province: string
  district: string
  address: string
  phoneCode: string
  phone: string
  social: Social
  logo: string
  slug: string
  createdBy: string
  createdAt: string
  status: boolean
  description: string
  email: string
}

export interface Social {
  whatsapp: string | null
  instagram: string | null
  facebook: string | null
  x: string | null
}

export interface GetBranchModel {
  success: boolean
  message: string
  data: GetBranchData
}

export interface GetBranchData {
  id: string
  companyId: string
  title: string
  country: string
  province: string
  district: string
  address: string
  phoneCode: string
  phone: string
  social: Social
  logo: string
  slug: string
  status: boolean
  description: string
  email: string
}

export interface UpdateBranchBodyModel {
  branchId: string
  title: string
  country: string
  province: string
  district: string
  address: string
  phoneCode: string
  phone: string
  email: string
  description: string
  social?: Social
}
