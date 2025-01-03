import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { PatientPaymentHistoryCreateBodyModel, PatientPaymentHistoryListResultModel, PatientPaymentHistoryReadResultModel } from './models/patient-payment-history-model';


const patientPaymentHistoryApi = createApi({
    reducerPath: "patientPaymentHistoryApi",
    tagTypes: ["patient-payment-history"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getPatientPaymentHistoryList: builder.query<PatientPaymentHistoryListResultModel, { filterSearch?: string, page?: number, pageSize?: number, patientId?: number | string }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number, patientId?: number | string }) => {
                return {
                    url: `app/patient-payment-history/list?patient_id=${args?.patientId}&page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["patient-payment-history"]
        }),
        createPatientPaymentHistory: builder.mutation<CreateResultModel, PatientPaymentHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-payment-history/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["patient-payment-history"]
        }),
        updatePatientPaymentHistory: builder.mutation<CreateResultModel, PatientPaymentHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-payment-history/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["patient-payment-history"]
        }),
        deletePatientPaymentHistory: builder.mutation<CreateResultModel, { patient_payment_history_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/patient-payment-history/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["patient-payment-history"]
        }),
        readPatientPaymentHistory: builder.query<PatientPaymentHistoryReadResultModel, { patient_id?: number | string }>({
            query: (args?: { patient_id?: number | string }) => {
                return {
                    url: `app/patient-payment-history/read`,
                    params: args
                }
            },
            providesTags: ["patient-payment-history"]
        }),
    })
})

export const {
    useLazyGetPatientPaymentHistoryListQuery,
    useCreatePatientPaymentHistoryMutation,
    useUpdatePatientPaymentHistoryMutation,
    useDeletePatientPaymentHistoryMutation,
    useLazyReadPatientPaymentHistoryQuery,
} = patientPaymentHistoryApi

export default patientPaymentHistoryApi;