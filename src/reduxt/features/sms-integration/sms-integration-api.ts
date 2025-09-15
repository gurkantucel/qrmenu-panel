import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { SmsIntegrationResultModel, UpdateSmsInfoBodyModel } from './models/sms-integration-model';

const smsIntegrationApi = createApi({
    reducerPath: "smsIntegrationApi",
    tagTypes: ["smsIntegration"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        readSmsIntegration: builder.query<SmsIntegrationResultModel, void>({
            query: () => {
                return {
                    url: `app/sms-info/read`,
                }
            },
            providesTags: ["smsIntegration"]
        }),
        createSmsIntegration: builder.mutation<CreateResultModel, UpdateSmsInfoBodyModel>({
            query: (body) => {
                return {
                    url: `app/sms-info/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["smsIntegration"] : [],
        }),
        updateSmsIntegration: builder.mutation<CreateResultModel, UpdateSmsInfoBodyModel>({
            query: (body) => {
                return {
                    url: `app/sms-info/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["smsIntegration"] : [],
        }),
    })
})

export const {
    useReadSmsIntegrationQuery,
    useCreateSmsIntegrationMutation,
    useUpdateSmsIntegrationMutation
} = smsIntegrationApi

export default smsIntegrationApi;