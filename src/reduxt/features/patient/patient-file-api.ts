import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { PatientFileListModel } from './models/patient-file-model';


const patientFileApi = createApi({
    reducerPath: "patientFileApi",
    tagTypes: ["patientFile"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getPatientFileList: builder.query<PatientFileListModel, { patient_id: number | string | undefined, appointment_id?: number | string | undefined }>({
            query: (args) => {
                return {
                    url: `app/patient-file/list`,
                    params: args
                }
            },
            providesTags: ["patientFile"]
        }),
        createPatientFile: builder.mutation<CreateResultModel, FormData>({
            query: (body) => {
                return {
                    url: `app/patient-file/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["patientFile"]
        }),
        deletePatientFile: builder.mutation<CreateResultModel, { patient_file_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/patient-file/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["patientFile"]
        }),
    })
})

export const {
    useLazyGetPatientFileListQuery,
    useCreatePatientFileMutation,
    useDeletePatientFileMutation,
} = patientFileApi

export default patientFileApi;