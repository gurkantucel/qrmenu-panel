import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { createApi } from '@reduxjs/toolkit/query/react'
import { CreateResultModel } from 'utils/models/create-result-model';
import { DropdownListModel } from 'utils/models/dropdown-list-model';
import { CreateDieticianDietTemplateBodyModel, DieticianDietTemplateListModel, DieticianDietTemplateReadModel } from './models/diet-template-list-model';

const dietTemplateApi = createApi({
    reducerPath: "dietTemplateApi",
    tagTypes: ["dietTemplate"],
    baseQuery: baseQueryWithReauth,
    refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getDieticianDietTemplateList: builder.query<DieticianDietTemplateListModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `dietitian/diet-template/list?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["dietTemplate"]
        }),
        createDieticianDietTemplate: builder.mutation<CreateResultModel, CreateDieticianDietTemplateBodyModel>({
            query: (body) => {
                return {
                    url: `dietitian/diet-template/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["dietTemplate"] : [],
        }),
        updateDieticianDietTemplate: builder.mutation<CreateResultModel, CreateDieticianDietTemplateBodyModel>({
            query: (body) => {
                return {
                    url: `dietitian/diet-template/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["dietTemplate"] : [],
        }),
        deleteDieticianDietTemplate: builder.mutation<CreateResultModel, { diet_template_id: number | string }>({
            query: (args) => {
                return {
                    url: `dietitian/diet-template/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.status ? ["dietTemplate"] : [],
        }),
        readDieticianDietTemplate: builder.query<DieticianDietTemplateReadModel, { diet_template_id?: number | string, person_id?: number | string }>({
            query: (args?: { diet_template_id?: number | string, person_id?: number | string }) => {
                return {
                    url: `dietitian/diet-template/read`,
                    params: args
                }
            },
        }),
        getDieticianDietTemplateDropdown: builder.query<DropdownListModel, void>({
            query: () => `dietitian/diet-template/dropDown`,
            providesTags: ["dietTemplate"]
        }),
    })
})

export const {
    useGetDieticianDietTemplateListQuery,
    useCreateDieticianDietTemplateMutation,
    useUpdateDieticianDietTemplateMutation,
    useDeleteDieticianDietTemplateMutation,
    useLazyReadDieticianDietTemplateQuery,
    useLazyGetDieticianDietTemplateDropdownQuery
} = dietTemplateApi;


export default dietTemplateApi;