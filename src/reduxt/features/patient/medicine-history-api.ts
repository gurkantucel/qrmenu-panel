import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { PatientMedicineHistoryCreateBodyModel, PatientMedicineHistoryListModel } from './models/patient-medicine-history-model';

const medicineHistoryApi = createApi({
    reducerPath: "medicineHistoryApi",
    tagTypes: ["medicineHistory"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        //İLAÇ GEÇMİŞİ
        getPatientMedicineHistoryList: builder.query<PatientMedicineHistoryListModel, { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { patient_id: number | string | undefined, filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/patient-medicine-history/list?patient_id=${args?.patient_id}`,
                }
            },
            providesTags: ["medicineHistory"]
        }),
        createPatientMedicineHistory: builder.mutation<CreateResultModel, PatientMedicineHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-medicine-history/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["medicineHistory"] : [],
        }),
        updatePatientMedicineHistory: builder.mutation<CreateResultModel, PatientMedicineHistoryCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-medicine-history/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["medicineHistory"] : [],
        }),
        deletePatientMedicineHistory: builder.mutation<CreateResultModel, { patient_medicine_history_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/patient-medicine-history/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.status ? ["medicineHistory"] : [],
        }),
    })
})

export const {
    useLazyGetPatientMedicineHistoryListQuery,
    useCreatePatientMedicineHistoryMutation,
    useUpdatePatientMedicineHistoryMutation,
    useDeletePatientMedicineHistoryMutation
} = medicineHistoryApi

export default medicineHistoryApi;