import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { OrderListModel } from './model/order-model';

const orderApi = createApi({
    reducerPath: "orderApi",
    tagTypes: ["order"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getOrderList: builder.query<OrderListModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/tenant-order/list?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["order"]
        }),
    })
})

export const {
    useGetOrderListQuery,
    useLazyGetOrderListQuery,
} = orderApi

export default orderApi;