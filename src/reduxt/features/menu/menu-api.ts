import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { GetBranchFoodResultModel, MenuListModel, UpdateBranchFoodBodyModel, UpdateFoodOrderBodyModel, UpdateStatusBranchFoodBodyModel } from './models/menu-model';

const menuApi = createApi({
    reducerPath: "menuApi",
    tagTypes: ["menu"],
    baseQuery: baseQueryWithReauth,
    //refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getMenuList: builder.query<MenuListModel, { branchSlug?: string | null, categoryId?: string | null }>({
            query: (args?: { branchSlug?: string | null, categoryId?: string | null }) => {
                return {
                    url: `food/panel/list`,
                    params: args
                }
            },
            providesTags: ["menu"]
        }),
        createFood: builder.mutation<CreateResultModel, FormData>({
            query: (body) => {
                return {
                    url: `food/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["menu"] : [],
        }),
        updateFood: builder.mutation<CreateResultModel, FormData>({
            query: (body) => {
                return {
                    url: `food/update`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["menu"] : [],
        }),
        getBranchFoodList: builder.query<GetBranchFoodResultModel, { foodId: string }>({
            query: (args?: { foodId: string }) => {
                return {
                    url: `food/getBranchFoods`,
                    params: args
                }
            },
            providesTags: ["menu"]
        }),
        updateBranchFood: builder.mutation<CreateResultModel, UpdateBranchFoodBodyModel>({
            query: (body) => {
                return {
                    url: `food/updateBranchFood`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["menu"] : [],
        }),
        updateBranchFoodOrder: builder.mutation<CreateResultModel, UpdateFoodOrderBodyModel>({
            query: (body) => {
                return {
                    url: `food/updateBranchFoodOrder`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["menu"] : [],
        }),
        deleteFood: builder.mutation<CreateResultModel, { foodId: string, branchFoodId: string }>({
            query: (args) => {
                return {
                    url: `food/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.success ? ["menu"] : [],
        }),
        updateStatusBranchFood: builder.mutation<CreateResultModel, UpdateStatusBranchFoodBodyModel>({
            query: (body) => {
                return {
                    url: `food/updateStatusBranchFood`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["menu"] : [],
        }),
    })
})

export const {
    useGetMenuListQuery,
    useCreateFoodMutation,
    useUpdateFoodMutation,
    useGetBranchFoodListQuery,
    useUpdateBranchFoodMutation,
    useUpdateBranchFoodOrderMutation,
    useDeleteFoodMutation,
    useUpdateStatusBranchFoodMutation
} = menuApi

export default menuApi;