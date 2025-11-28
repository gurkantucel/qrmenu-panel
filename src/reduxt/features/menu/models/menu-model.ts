import { Title } from "types/title-type"

export interface MenuListModel {
  success: boolean
  message: string
  data: MenuListData[]
}

export interface MenuListData {
  id: string
  title: Title
  description?: string
  categoryId: string
  imageUrl: string
  allergens?: string[]
  properties: Properties
  status: boolean
  createdBy: string
  createdAt: string
  branchId: string
  branchSlug: string
  foodId: string
  currencyCode: string
  price: string
  categoryTitle: Title
  islemler?:string
}

export interface Properties {
  gr: string | null
  kcal: string | null
  protein: string | null
  carbohydrate: string | null
  fat: string | null
}

export interface UpdateMenuOrderBodyModel {
  branchSlug?: string | null
  newFoodList: string[]
}

export interface CreateFoodBodyModel {
  title_tr: string
  title_en: string
  title_es: string | null
  title_fr: string | null 
  description_tr: string
  description_en: string
  description_es: string | null
  description_fr: string | null
  branches: Branch[]
  allergens: string[]
  property_gr: string | null
  property_kcal: string | null
  property_protein: string | null
  property_carbohydrate: string | null
  property_fat: string | null
  status: boolean
}

export interface UpdateFoodBodyModel {
  food_id: string
  title_tr: string
  title_en: string
  title_es: string | null
  title_fr: string | null 
  description_tr: string
  description_en: string
  description_es: string | null
  description_fr: string | null
  allergens: string[]
  property_gr: string | null
  property_kcal: string | null
  property_protein: string | null
  property_carbohydrate: string | null
  property_fat: string | null
  status: boolean
}

export interface Branch {
  id: string
  slug: string
  categoryId: string
  currencyCode: string
  price: string
}

export interface FoodPriceBranch {
  branchFoodId: string | null
  branchId: string
  branchSlug: string
  categoryId: string
  currencyCode: string
  price: string
}

export interface UpdateBranchFoodBodyModel {
  foodId: string
  branches: FoodPriceBranch[]
}

export interface GetBranchFoodResultModel {
  success: boolean
  message: string
  data: GetBranchFoodData[]
}

export interface GetBranchFoodData {
  id: string
  branchId: string
  branchSlug: string
  categoryId: string
  foodId: string
  currencyCode: string
  price: string
  createdAt: string
  status: boolean
}

export interface UpdateStatusBranchFoodBodyModel {
  branchFoodId: string
  status: boolean
}