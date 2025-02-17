import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CouponCheckModel } from './models/coupon-model';

const couponApi = createApi({
    reducerPath: "couponApi",
    tagTypes: ["coupon"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getCouponCheckValidity: builder.query<CouponCheckModel, { coupon_code?: string, coupon_id?:string, product_id?:string }>({
            query: (args?: { coupon_code?: string, coupon_id?:string, product_id?: string }) => {
                return {
                    url: `app/coupon/checkValidity`,
                    params: args
                }
            },
            providesTags: ["coupon"]
        }),
    })
})

export const {
    useLazyGetCouponCheckValidityQuery
} = couponApi

export default couponApi;