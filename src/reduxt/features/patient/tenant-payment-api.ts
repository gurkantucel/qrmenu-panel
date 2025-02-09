import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { TenantPaymentCreateBodyModel, TenantPaymentListResultModel, TenantPaymentReadResultModel } from './models/tenant-payment-model';

const tenantPaymentApi = createApi({
    reducerPath: "tenantPaymentApi",
    tagTypes: ["tenant-payment"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getTenantPaymentList: builder.query<TenantPaymentListResultModel, { filterSearch?: string, page?: number, pageSize?: number, patientId?: number | string }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number, patientId?: number | string }) => {
                return {
                    url: `app/tenant-payment/list?patient_id=${args?.patientId}&page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["tenant-payment"]
        }),
        createTenantPayment: builder.mutation<CreateResultModel, TenantPaymentCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/tenant-payment/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["tenant-payment"]
        }),
        updateTenantPayment: builder.mutation<CreateResultModel, TenantPaymentCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/tenant-payment/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["tenant-payment"]
        }),
        deleteTenantPayment: builder.mutation<CreateResultModel, { payment_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/tenant-payment/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["tenant-payment"]
        }),
        readTenantPayment: builder.query<TenantPaymentReadResultModel, { payment_id?: string, patient_id?: number | string }>({
            query: (args?: { patient_id?: number | string, payment_id?: string }) => {
                return {
                    url: `app/tenant-payment/read`,
                    params: args
                }
            },
            providesTags: ["tenant-payment"]
        }),
    })
})

export const {
    useGetTenantPaymentListQuery,
    useLazyGetTenantPaymentListQuery,
    useCreateTenantPaymentMutation,
    useUpdateTenantPaymentMutation,
    useDeleteTenantPaymentMutation,
    useLazyReadTenantPaymentQuery,
} = tenantPaymentApi

export default tenantPaymentApi;