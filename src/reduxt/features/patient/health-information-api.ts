import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { PatientHealthInformationModel, PatientHealtInformationUpdateBodyModel } from './models/patient-health-information-model';

const healthInformationApi = createApi({
    reducerPath: "healthInformationApi",
    tagTypes: ["healthInformation"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getPatientHealthInformation: builder.query<PatientHealthInformationModel, { patient_id: number | string | undefined }>({
            query: (args?: { patient_id: number | string | undefined }) => {
                return {
                    url: `app/patient-health-information/read?patient_id=${args?.patient_id}`,
                }
            },
            providesTags: ["healthInformation"]
        }),
        updatePatientHealthInformation: builder.mutation<CreateResultModel, PatientHealtInformationUpdateBodyModel>({
            query: (body) => {
                return {
                    url: `app/patient-health-information/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["healthInformation"]
        }),
    })
})

export const {
    useLazyGetPatientHealthInformationQuery,
    useUpdatePatientHealthInformationMutation,
} = healthInformationApi

export default healthInformationApi;