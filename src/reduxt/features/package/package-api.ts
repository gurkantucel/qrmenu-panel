import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CalculateBranchPackageModel, CalculatePackageModel, CalculatePriceBodyModel } from './model/package-model';

const packageApi = createApi({
    reducerPath: "packageApi",
    tagTypes: ["package"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getCalculateBranchPackage: builder.query<CalculateBranchPackageModel, void>({
            query: () => {
                return {
                    url: `package/calculateBranchPackage`,
                }
            },
            providesTags: ["package"]
        }),
        calculatePackage: builder.mutation<CalculatePackageModel, CalculatePriceBodyModel>({
            query: (body) => {
                return {
                    url: `package/calculatePrice`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["package"] : [],
        }),
    })
})

export const {
    useCalculatePackageMutation,
    useGetCalculateBranchPackageQuery
} = packageApi

export default packageApi;