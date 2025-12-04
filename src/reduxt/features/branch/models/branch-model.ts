export interface BranchListModel {
  success: boolean
  message: string
  data: BranchListData[]
}

export interface BranchListData {
  select?: string
  id: string
  companyId: string
  title: string
  country: string
  province: string
  district: string
  address: string
  phoneCode: string
  phone: string
  packages: BranchPackages
  social: Social
  logo: string
  slug: string
  createdBy: string
  createdAt: string
  status: boolean
  description: string
  email: string
  islemler?: string
}

export interface BranchPackages {
  id: string
  type: string
  active: boolean
  startDate: string
  endDate: string
  remainingDays: number
}

export interface Social {
  whatsapp: string | null
  instagram: string | null
  facebook: string | null
  x: string | null
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
  theme: string
  packages: BranchPackages
}

export interface BranchPackages {
  id: string
  type: string
  startDate: string
  endDate: string
  active: boolean
}

export interface CreateBranchBodyModel {
  branches: CreateBranch[]
}

export interface CreateBranch {
  branchName: string
  country: string
  province: string
  district: string
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
  social?: Social | null
}

export interface UpdateBranchThemeBodyModel {
  branchId: string
  theme: string
}