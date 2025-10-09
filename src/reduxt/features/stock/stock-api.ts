import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { StockCreateBodyModel, StockListModel, StockReadResultModel } from './models/stock-list-model';

const stockApi = createApi({
    reducerPath: "stockApi",
    tagTypes: ["stock"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getStockList: builder.query<StockListModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/stock/list?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["stock"]
        }),
        createStock: builder.mutation<CreateResultModel, StockCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/stock/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["stock"] : [],
        }),
        updateStock: builder.mutation<CreateResultModel, StockCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/stock/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["stock"] : [],
        }),
        deleteStock: builder.mutation<CreateResultModel, { stock_id: string, appointment_process_id: string }>({
            query: (args) => {
                return {
                    url: `app/stock/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.status ? ["stock"] : [],
        }),
        readStock: builder.query<StockReadResultModel, { appointment_process_id?: string }>({
            query: (args?: { stock_id?: string, appointment_process_id?: string }) => {
                return {
                    url: `app/stock/read`,
                    params: args
                }
            },
            providesTags: ["stock"]
        }),
    })
})

export const {
    useGetStockListQuery,
    useLazyGetStockListQuery,
    useCreateStockMutation,
    useUpdateStockMutation,
    useDeleteStockMutation,
    useLazyReadStockQuery,
} = stockApi

export default stockApi;