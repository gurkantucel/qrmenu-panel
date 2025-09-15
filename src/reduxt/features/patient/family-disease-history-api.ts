import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { PatientFamilyDiseaseHistoryCreateBodyModel, PatientFamilyDiseaseHistoryListModel } from './models/patient-family-disease-history-model';


const familyDiseaseHistoryApi = createApi({
    reducerPath: "familyDiseaseHistoryApi",
    tagTypes: ["familyDiseaseHistory"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        //HASTALIK GEÇMİŞİ
        getPatientFamilyDiseaseHistoryList: builder.query<PatientFamilyDiseaseHistoryListModel, { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/patient-family-disease-history/list?patient_id=${args?.patient_id}`,
                }
            },
            providesTags: ["familyDiseaseHistory"]
        }),
        createPatientFamilyDiseaseHistory: builder.mutation<CreateResultModel, PatientFamilyDiseaseHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-family-disease-history/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["familyDiseaseHistory"] : [],
        }),
        updatePatientFamilyDiseaseHistory: builder.mutation<CreateResultModel, PatientFamilyDiseaseHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-family-disease-history/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["familyDiseaseHistory"] : [],
        }),
        deletePatientFamilyDiseaseHistory: builder.mutation<CreateResultModel, { patient_family_disease_history_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/patient-family-disease-history/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.status ? ["familyDiseaseHistory"] : [],
        }),
    })
})

export const {
    useLazyGetPatientFamilyDiseaseHistoryListQuery,
    useCreatePatientFamilyDiseaseHistoryMutation,
    useUpdatePatientFamilyDiseaseHistoryMutation,
    useDeletePatientFamilyDiseaseHistoryMutation,
} = familyDiseaseHistoryApi

export default familyDiseaseHistoryApi;