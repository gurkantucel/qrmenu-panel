import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { PatientSurgeryHistoryCreateBodyModel, PatientSurgeryHistoryListModel } from './models/patient-surgery-history-model';


const surgeryHistoryApi = createApi({
    reducerPath: "surgeryHistoryApi",
    tagTypes: ["surgeryHistory"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        //HASTALIK GEÇMİŞİ
        getPatientSurgeryHistoryList: builder.query<PatientSurgeryHistoryListModel, { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/patient-surgery-history/list?patient_id=${args?.patient_id}`,
                }
            },
            providesTags: ["surgeryHistory"]
        }),
        createPatientSurgeryHistory: builder.mutation<CreateResultModel, PatientSurgeryHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-surgery-history/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["surgeryHistory"]
        }),
        updatePatientSurgeryHistory: builder.mutation<CreateResultModel, PatientSurgeryHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-surgery-history/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["surgeryHistory"]
        }),
        deletePatientSurgeryHistory: builder.mutation<CreateResultModel, { patient_surgery_history_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/patient-surgery-history/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["surgeryHistory"]
        }),
    })
})

export const {
    useLazyGetPatientSurgeryHistoryListQuery,
    useCreatePatientSurgeryHistoryMutation,
    useUpdatePatientSurgeryHistoryMutation,
    useDeletePatientSurgeryHistoryMutation,
} = surgeryHistoryApi

export default surgeryHistoryApi;