import { Title } from "types/title-type"

export interface StockImageGalleryModel {
  success: boolean
  message: string
  data: StockImageGalleryData[]
}

export interface StockImageGalleryData {
  imageUrl: string
  label: Title
}