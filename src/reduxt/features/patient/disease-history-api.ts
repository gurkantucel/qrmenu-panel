import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { PatientDiseaseHistoryCreateBodyModel, PatientDiseaseHistoryListModel } from './models/patient-disease-history-model';
import { DropdownListModel } from 'utils/models/dropdown-list-model';


const diseaseHistoryApi = createApi({
    reducerPath: "diseaseHistoryApi",
    tagTypes: ["diseaseHistory"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        //HASTALIK GEÇMİŞİ
        getPatientDiseaseHistoryList: builder.query<PatientDiseaseHistoryListModel, { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/patient-disease-history/list?patient_id=${args?.patient_id}`,
                }
            },
            providesTags: ["diseaseHistory"]
        }),
        createPatientDiseaseHistory: builder.mutation<CreateResultModel, PatientDiseaseHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-disease-history/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["diseaseHistory"]
        }),
        updatePatientDiseaseHistory: builder.mutation<CreateResultModel, PatientDiseaseHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-disease-history/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["diseaseHistory"]
        }),
        deletePatientDiseaseHistory: builder.mutation<CreateResultModel, { patient_disease_history_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/patient-disease-history/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["diseaseHistory"]
        }),
        getDiseaseHistoryDropdown: builder.query<DropdownListModel, {patient_id?: number | string}>({
            query: (args?: { patient_id?: number | string }) => {
                return {
                    url: `app/patient-disease-history/dropDown`,
                    params: args
                }
            },
            providesTags: ["diseaseHistory"]
        }),
    })
})

export const {
    useLazyGetPatientDiseaseHistoryListQuery,
    useCreatePatientDiseaseHistoryMutation,
    useUpdatePatientDiseaseHistoryMutation,
    useDeletePatientDiseaseHistoryMutation,
    useLazyGetDiseaseHistoryDropdownQuery,
} = diseaseHistoryApi

export default diseaseHistoryApi;