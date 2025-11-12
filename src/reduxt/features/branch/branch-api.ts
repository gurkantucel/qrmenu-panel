import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { DropdownListModel } from 'utils/models/dropdown-list-model';
import { BranchListModel, GetBranchModel, UpdateBranchBodyModel } from './models/branch-model';
import { CreateResultModel } from 'utils/models/create-result-model';

const branchApi = createApi({
    reducerPath: "branchApi",
    tagTypes: ["branch"],
    baseQuery: baseQueryWithReauth,
    //refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getBranchList: builder.query<BranchListModel, void>({
            query: () => {
                return {
                    url: `app/branch/list`,
                }
            },
            providesTags: ["branch"]
        }),
        getBranchDropdown: builder.query<DropdownListModel, void>({
            query: () => {
                return {
                    url: `branch/dropdown`,
                }
            },
            providesTags: ["branch"]
        }),
        getBranch: builder.query<GetBranchModel, { slug: string }>({
            query: (args) => {
                return {
                    url: `branch`,
                    params: args
                }
            },
            providesTags: ["branch"]
        }),
        updateBranch: builder.mutation<CreateResultModel, UpdateBranchBodyModel>({
            query: (body) => {
                return {
                    url: `branch/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["branch"] : [],
        }),
        createBranchLogo: builder.mutation<CreateResultModel, FormData>({
            query: (body) => {
                return {
                    url: `branch/createLogo`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["branch"] : [],
        }),
    })
})

export const {
    useGetBranchListQuery,
    useGetBranchDropdownQuery,
    useGetBranchQuery,
    useUpdateBranchMutation,
    useCreateBranchLogoMutation
} = branchApi

export default branchApi;