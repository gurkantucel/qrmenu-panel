import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateOrderBodyModel, OrderListModel } from './model/order-model';
import { CreateResultModel } from 'utils/models/create-result-model';

const orderApi = createApi({
    reducerPath: "orderApi",
    tagTypes: ["order"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        createOrder: builder.mutation<CreateResultModel, CreateOrderBodyModel>({
            query: (body) => {
                return {
                    url: `order/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["order"] : [],
        }),
        getOrderList: builder.query<OrderListModel, void>({
            query: () => {
                return {
                    url: `order/list`,
                }
            },
            providesTags: ["order"]
        }),
    })
})

export const {
    useCreateOrderMutation,
    useGetOrderListQuery,
    useLazyGetOrderListQuery,
} = orderApi

export default orderApi;