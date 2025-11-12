export interface QrCodeModel {
  success: boolean
  message: string
  data: QrCodeData[]
}

export interface QrCodeData {
  id: string
  image: string
  branchId: string
  userId: string
  deletedAt: any
  status: boolean
  createdAt: string
}
