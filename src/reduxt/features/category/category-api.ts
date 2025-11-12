import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CategoryListModel, UpdateCategoryOrderBodyModel } from './models/category-model';
import { CreateResultModel } from 'utils/models/create-result-model';
import { DropdownListModel } from 'utils/models/dropdown-list-model';

const categoryApi = createApi({
    reducerPath: "categoryApi",
    tagTypes: ["category"],
    baseQuery: baseQueryWithReauth,
    //refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getCategoryList: builder.query<CategoryListModel, { branchSlug?: string | null }>({
            query: (args?: { branchSlug?: string | null }) => {
                return {
                    url: `category/list`,
                    params: args
                }
            },
            providesTags: ["category"]
        }),
        getCategoryDropdown: builder.query<DropdownListModel, { branchSlug?: string | null }>({
            query: (args?: { branchSlug?: string | null }) => {
                return {
                    url: `category/dropdown`,
                    params: args
                }
            },
            providesTags: ["category"]
        }),
        createCategory: builder.mutation<CreateResultModel, FormData>({
            query: (body) => {
                return {
                    url: `category/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["category"] : [],
        }),
        updateCategoryOrder: builder.mutation<CreateResultModel, UpdateCategoryOrderBodyModel>({
            query: (body) => {
                return {
                    url: `category/updateOrder`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["category"] : [],
        }),
        updateCategory: builder.mutation<CreateResultModel, FormData>({
            query: (body) => {
                return {
                    url: `category/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["category"] : [],
        }),
        deleteCategory: builder.mutation<CreateResultModel, { categoryId: string }>({
            query: (args) => {
                return {
                    url: `category/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.success ? ["category"] : [],
        }),
    })
})

export const {
    useGetCategoryListQuery,
    useGetCategoryDropdownQuery,
    useCreateCategoryMutation,
    useUpdateCategoryOrderMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} = categoryApi

export default categoryApi;