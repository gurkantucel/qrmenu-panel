import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { StaticPageResultModel } from './models/static-page-model';

const staticPageApi = createApi({
    reducerPath: "staticPageApi",
    tagTypes: ["staticPage"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getStaticPageRead: builder.query<StaticPageResultModel, { code?: string }>({
            query: (args?: { code?: string }) => {
                return {
                    url: `definition/static-page/read`,
                    params: args
                }
            },
            providesTags: ["staticPage"]
        }),
    }),
})

export const {
    useLazyGetStaticPageReadQuery
} = staticPageApi

export default staticPageApi;