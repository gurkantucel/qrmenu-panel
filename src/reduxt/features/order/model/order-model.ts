export interface OrderQueryModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    data: OrderQueryData
  }
  
  export interface OrderQueryData {
    order_id: string
    order_number: string
    coupon_id: any
    coupon_code: any
    coupon_discount_percentage: any
    user_id: string
    name: string
    surname: string
    email: string
    phone_code: string
    phone_number: string
    current_account_name: string
    tax_identification_number: string
    country_id: string
    country_name: string
    city_id: string
    city_name: string
    district_id: string
    district_name: string
    address: string
    order_kind_id: string
    order_kind_name: string
    order_status_id: string
    order_status_code: string
    order_status_name: string
    payment_method_id: string
    payment_method_name: string
    product_id: string
    product_name: string
    currency_code: string
    currency_name: string
    amount: string
    total_amount: string
    quantity: string
    vat: number
    vat_included: boolean
    vat_amount: string
    discount_percentage: number
    discount_amount: string
    total: string
  }
  
  export interface OrderListModel {
    requestId: string
    status: boolean
    messageCode: string
    message: string
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
    data: OrderListData[]
  }
  
  export interface OrderListData {
    order_id: string
    current_account_id: string
    current_account_name: string
    coupon_id: any
    coupon_code: any
    basket_id: string
    order_kind_id: string
    order_kind_code: string
    order_kind_name: string
    order_status_id: string
    order_status_code: string
    order_status_name: string
    payment_method_id: string
    payment_method_code: string
    payment_method_name: string
    order_number: string
    currency_code?:string
    total: string
    created_at: string
    updated_at: string
    created_by: string
    created_person: string
    updated_by: any
    updated_person: any
    status: boolean
    islemler?:string
  }
  