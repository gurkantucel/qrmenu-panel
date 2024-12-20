import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { PatientTreatmentHistoryCreateBodyModel, PatientTreatmentHistoryListModel } from './models/patient-treatment-history-model';

const treatmentHistoryApi = createApi({
    reducerPath: "treatmentHistoryApi",
    tagTypes: ["treatmentHistory"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        //HASTALIK GEÇMİŞİ
        getPatientTreatmentHistoryList: builder.query<PatientTreatmentHistoryListModel, { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/patient-treatment-history/list?patient_id=${args?.patient_id}`,
                }
            },
            providesTags: ["treatmentHistory"]
        }),
        createPatientTreatmentHistory: builder.mutation<CreateResultModel, PatientTreatmentHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-treatment-history/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["treatmentHistory"]
        }),
        updatePatientTreatmentHistory: builder.mutation<CreateResultModel, PatientTreatmentHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-treatment-history/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["treatmentHistory"]
        }),
        deletePatientTreatmentHistory: builder.mutation<CreateResultModel, { patient_treatment_history_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/patient-treatment-history/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["treatmentHistory"]
        }),
    })
})

export const {
    useLazyGetPatientTreatmentHistoryListQuery,
    useCreatePatientTreatmentHistoryMutation,
    useUpdatePatientTreatmentHistoryMutation,
    useDeletePatientTreatmentHistoryMutation,
} = treatmentHistoryApi

export default treatmentHistoryApi;