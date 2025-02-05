import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { PatientAllergyHistoryCreateBodyModel, PatientAllergyHistoryListModel } from './models/patient-allergy-history-model';

const allergyHistoryApi = createApi({
    reducerPath: "allergyHistoryApi",
    tagTypes: ["allergyHistory"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        //İLAÇ GEÇMİŞİ
        getPatientAllergyHistoryList: builder.query<PatientAllergyHistoryListModel, { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/patient-allergy-history/list?patient_id=${args?.patient_id}`,
                }
            },
            providesTags: ["allergyHistory"]
        }),
        createPatientAllergyHistory: builder.mutation<CreateResultModel, PatientAllergyHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-allergy-history/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["allergyHistory"]
        }),
        updatePatientAllergyHistory: builder.mutation<CreateResultModel, PatientAllergyHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-allergy-history/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["allergyHistory"]
        }),
        deletePatientAllergyHistory: builder.mutation<CreateResultModel, { patient_allergy_history_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/patient-allergy-history/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["allergyHistory"]
        }),
    })
})

export const {
    useLazyGetPatientAllergyHistoryListQuery,
    useCreatePatientAllergyHistoryMutation,
    useUpdatePatientAllergyHistoryMutation,
    useDeletePatientAllergyHistoryMutation
} = allergyHistoryApi

export default allergyHistoryApi;