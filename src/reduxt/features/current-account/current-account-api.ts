import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CurrentAccountReadListModel } from './models/current-account-model';

const currentAccountApi = createApi({
    reducerPath: "currentAccountApi",
    tagTypes: ["currentAccount"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getCurrentAccountReadInfo: builder.query<CurrentAccountReadListModel, void>({
            query: () => {
                return {
                    url: `app/current-account/readInfo`,
                }
            },
            providesTags: ["currentAccount"]
        }),
    })
})

export const {
    useGetCurrentAccountReadInfoQuery
} = currentAccountApi

export default currentAccountApi;