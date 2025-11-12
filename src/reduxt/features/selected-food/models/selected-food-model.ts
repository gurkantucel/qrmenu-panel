import { Title } from "types/title-type"

export interface SelectedFoodListModel {
  success: boolean
  message: string
  data: SelectedFoodData[]
}

export interface SelectedFoodData {
  id: string
  title: Title
  description: Title
  imageUrl: string
  allergens: string[]
  properties: Properties
  status: boolean
  createdBy: string
  createdAt: string
  branchId: string
  branchSlug: string
  foodId: string
  currencyCode: string
  price: string
  categoryId: string
  deletedAt: any
  branchFoodId: string
  islemler?:string
}

export interface Properties {
  gr: string
  kcal: string
  protein: any
  carbohydrate: any
  fat: any
}

export interface CreateSelectFoodBodyModel {
  branchId: string
  branchSlug: string
  branchFoods: string[]
  status: boolean
}

export interface UpdateStatusSelectedFoodBodyModel {
  selectedFoodId: string
  status: boolean
}

export interface UpdateSelectedFoodOrderBodyModel {
  branchSlug?: string | null
  newSelectedFoodList: string[]
}