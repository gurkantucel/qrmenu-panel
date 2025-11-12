import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth'
import { DropdownListModel } from 'utils/models/dropdown-list-model'

const commonApi = createApi({
    reducerPath: "commonApi",
    tagTypes: ["common"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getCurrencyDropdown: builder.query<DropdownListModel, void>({
            query: () => `common/getCurrencies`,
            providesTags: ["common"]
        }),
        getCountryDropdown: builder.query<DropdownListModel, void>({
            query: () => `common/getCountries`,
            providesTags: ["common"]
        }),
    })
})

export const {
    useGetCurrencyDropdownQuery,
    useGetCountryDropdownQuery
} = commonApi

export default commonApi;