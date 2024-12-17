import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { PatientListResultModel, PatientCreateBodyModel, PatientReadResultModel } from './models/patient-list-model';


const patientApi = createApi({
    reducerPath: "patientApi",
    tagTypes: ["patient"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getPatientList: builder.query<PatientListResultModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/patient/list?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["patient"]
        }),
        createPatient: builder.mutation<CreateResultModel, PatientCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient/create`,
                    method: "POST",
                    body: body
                }
            },
        }),
        updatePatient: builder.mutation<CreateResultModel, PatientCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient/update`,
                    method: "PUT",
                    body: body
                }
            },
        }),
        deletePatient: builder.mutation<CreateResultModel, { patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/patient/delete`,
                    method: "DELETE",
                    params: args
                }
            },
        }),
        readPatient: builder.query<PatientReadResultModel, { patient_id?: number | string }>({
            query: (args?: { patient_id?: number | string }) => {
                return {
                    url: `app/patient/read`,
                    params: args
                }
            },
            providesTags: ["patient"]
        }),
    })
})

export const {
    useLazyGetPatientListQuery,
    useCreatePatientMutation,
    useUpdatePatientMutation,
    useDeletePatientMutation,
    useLazyReadPatientQuery,
} = patientApi

export default patientApi;