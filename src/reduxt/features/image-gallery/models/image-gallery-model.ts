export interface ImageGalleryModel {
  success: boolean
  message: string
  data: ImageGalleryData[]
}

export interface ImageGalleryData {
  id: string
  branchId: string
  branchSlug: string
  imageUrl: string
  createdBy: string
  createdAt: string
}

export interface UpdateImageGalleryOrderBodyModel {
  branchSlug?: string | null
  newImageList: string[]
}