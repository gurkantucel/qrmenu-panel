import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { SmsTemplateListResultModel, UpdateSmsTemplateBodyModel } from './models/sms-template-model';

const smsTemplateApi = createApi({
    reducerPath: "smsTemplateApi",
    tagTypes: ["smsTemplate"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getSmsTemplateList: builder.query<SmsTemplateListResultModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/sms-template/list?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["smsTemplate"]
        }),
        updateStatusSmsTemplate: builder.mutation<CreateResultModel, UpdateSmsTemplateBodyModel>({
            query: (body) => {
                return {
                    url: `app/sms-template/updateStatus`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["smsTemplate"] : [],
        }),
    })
})

export const {
    useGetSmsTemplateListQuery,
    useLazyGetSmsTemplateListQuery,
    useUpdateStatusSmsTemplateMutation
} = smsTemplateApi

export default smsTemplateApi;