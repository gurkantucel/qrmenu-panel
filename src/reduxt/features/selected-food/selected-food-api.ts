import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { CreateSelectFoodBodyModel, SelectedFoodListModel, UpdateSelectedFoodOrderBodyModel, UpdateStatusSelectedFoodBodyModel } from './models/selected-food-model';
import { DropdownListModel } from 'utils/models/dropdown-list-model';

const selectedFoodApi = createApi({
    reducerPath: "selectedFoodApi",
    tagTypes: ["selectedFood"],
    baseQuery: baseQueryWithReauth,
    //refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getSelectedFoodList: builder.query<SelectedFoodListModel, { branchSlug?: string | null }>({
            query: (args?: { branchSlug?: string | null }) => {
                return {
                    url: `food/listSelectFood`,
                    params: args
                }
            },
            providesTags: ["selectedFood"]
        }),
        getSelectedFoodDropdown: builder.query<DropdownListModel, { branchSlug?: string | null }>({
            query: (args?: { branchSlug?: string | null }) => {
                return {
                    url: `food/dropdown`,
                    params: args
                }
            },
            providesTags: ["selectedFood"]
        }),
        createSelectedFood: builder.mutation<CreateResultModel, CreateSelectFoodBodyModel>({
            query: (body) => {
                return {
                    url: `food/createSelectFood`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["selectedFood"] : [],
        }),
        deleteSelectedFood: builder.mutation<CreateResultModel, { selectedFoodId: string }>({
            query: (args) => {
                return {
                    url: `food/deleteSelectedFood`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.success ? ["selectedFood"] : [],
        }),
        updateStatusSelectedFood: builder.mutation<CreateResultModel, UpdateStatusSelectedFoodBodyModel>({
            query: (body) => {
                return {
                    url: `food/updateStatusSelectedFood`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["selectedFood"] : [],
        }),
        updateSelectedFoodOrder: builder.mutation<CreateResultModel, UpdateSelectedFoodOrderBodyModel>({
            query: (body) => {
                return {
                    url: `food/updateSelectedFoodOrder`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["selectedFood"] : [],
        }),
    })
})

export const {
    useGetSelectedFoodListQuery,
    useGetSelectedFoodDropdownQuery,
    useCreateSelectedFoodMutation,
    useDeleteSelectedFoodMutation,
    useUpdateStatusSelectedFoodMutation,
    useUpdateSelectedFoodOrderMutation
} = selectedFoodApi

export default selectedFoodApi;