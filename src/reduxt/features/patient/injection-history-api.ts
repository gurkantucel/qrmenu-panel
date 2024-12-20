import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { PatientInjectionHistoryCreateBodyModel, PatientInjectionHistoryListModel } from './models/patient-injection-history-model';

const injectionHistoryApi = createApi({
    reducerPath: "injectionHistoryApi",
    tagTypes: ["injectionHistory"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        //HASTALIK GEÇMİŞİ
        getPatientInjectionHistoryList: builder.query<PatientInjectionHistoryListModel, { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/patient-injection-history/list?patient_id=${args?.patient_id}`,
                }
            },
            providesTags: ["injectionHistory"]
        }),
        createPatientInjectionHistory: builder.mutation<CreateResultModel, PatientInjectionHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-injection-history/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["injectionHistory"]
        }),
        updatePatientInjectionHistory: builder.mutation<CreateResultModel, PatientInjectionHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-injection-history/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["injectionHistory"]
        }),
        deletePatientInjectionHistory: builder.mutation<CreateResultModel, { patient_injection_history_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/patient-injection-history/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["injectionHistory"]
        }),
    })
})

export const {
    useLazyGetPatientInjectionHistoryListQuery,
    useCreatePatientInjectionHistoryMutation,
    useUpdatePatientInjectionHistoryMutation,
    useDeletePatientInjectionHistoryMutation,
} = injectionHistoryApi

export default injectionHistoryApi;