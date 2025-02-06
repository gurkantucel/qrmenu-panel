import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { DropdownListModel } from 'utils/models/dropdown-list-model';
import { PersonTypeCreateBodyModel, PersonTypeListResultModel } from './models/person-type-model';

const personTypeApi = createApi({
    reducerPath: "personTypeApi",
    tagTypes: ["personType"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getPersonTypeList: builder.query<PersonTypeListResultModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/person-type/list?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["personType"]
        }),
        createPersonType: builder.mutation<CreateResultModel, PersonTypeCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/person-type/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["personType"]
        }),
        updatePersonType: builder.mutation<CreateResultModel, PersonTypeCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/person-type/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["personType"]
        }),
        deletePersonType: builder.mutation<CreateResultModel, { person_type_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/person-type/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["personType"]
        }),
        getPersonTypeDropdown: builder.query<DropdownListModel, { label?: string, include_packages?: boolean, excluded_appointment_process_id?: number | string | null }>({
            query: (args?: { label?: string, include_packages?: boolean, excluded_appointment_process_id?: number | string | null }) => {
                return {
                    url: `app/person-type/dropDown`,
                    params: args
                }
            },
            providesTags: ["personType"]
        }),
    })
})

export const {
    useGetPersonTypeListQuery,
    useCreatePersonTypeMutation,
    useUpdatePersonTypeMutation,
    useDeletePersonTypeMutation,
    useLazyGetPersonTypeDropdownQuery
} = personTypeApi

export default personTypeApi;