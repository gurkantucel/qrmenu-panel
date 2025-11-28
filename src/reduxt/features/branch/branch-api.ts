import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { DropdownListModel } from 'utils/models/dropdown-list-model';
import { BranchListModel, CreateBranchBodyModel, GetBranchModel, UpdateBranchBodyModel, UpdateBranchThemeBodyModel } from './models/branch-model';
import { CreateResultModel } from 'utils/models/create-result-model';

const branchApi = createApi({
    reducerPath: "branchApi",
    tagTypes: ["branch"],
    baseQuery: baseQueryWithReauth,
    //refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getBranchList: builder.query<BranchListModel, { simple?: boolean }>({
            query: (args) => {
                return {
                    url: `branch/list`,
                    params: args
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
        createBranch: builder.mutation<CreateResultModel, CreateBranchBodyModel>({
            query: (body) => {
                return {
                    url: `branch/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["branch"] : [],
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
        updateBranchTheme: builder.mutation<CreateResultModel, UpdateBranchThemeBodyModel>({
            query: (body) => {
                return {
                    url: `branch/updateTheme`,
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
    useCreateBranchMutation,
    useUpdateBranchMutation,
    useCreateBranchLogoMutation,
    useUpdateBranchThemeMutation
} = branchApi

export default branchApi;