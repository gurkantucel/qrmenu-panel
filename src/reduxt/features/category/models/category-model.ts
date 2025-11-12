import { Title } from "types/title-type"

export interface CategoryListModel {
  success: boolean
  message: string
  data: CategoryListData[]
}

export interface CategoryListData {
  id: string
  branchId: string
  branchSlug: string
  title: Title
  imageUrl: string
  slug: string
  createdBy: string
  createdAt: string
  status: boolean
  islemler?:string
}

export interface Branches {
  id: string
  slug: string
}

export interface UpdateCategoryOrderBodyModel {
  branchSlug?: string | null
  newCategoryList: string[]
}
