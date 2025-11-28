import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { TranslateBodyModel, TranslateResultModel } from './model/translate-model';

const translateApi = createApi({
    reducerPath: "translateApi",
    tagTypes: ["translate"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        translate: builder.mutation<TranslateResultModel, TranslateBodyModel>({
            query: (body) => {
                return {
                    url: `translate`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["translate"] : [],
        }),
    })
})

export const {
    useTranslateMutation,
} = translateApi

export default translateApi;