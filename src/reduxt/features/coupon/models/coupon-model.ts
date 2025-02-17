
export interface CouponCheckModel {
  requestId: string
  status: boolean
  messageCode: string
  message: string
  data: CouponCheckData
}

export interface CouponCheckData {
  coupon_id: string
  amount: string
  quantity: string
  total_amount: number
  discount_percentage: number
  discount_amount: number
  vat: number
  vat_included: boolean
  vat_amount: number
  total: number
}
