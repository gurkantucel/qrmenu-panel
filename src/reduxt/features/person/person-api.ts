import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { PersonCreateBodyModel, PersonListModel, PersonReadResultModel } from './models/person-list-model';
import { CreateResultModel } from 'utils/models/create-result-model';


const personApi = createApi({
    reducerPath: "personApi",
    tagTypes: ["person"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getPersonList: builder.query<PersonListModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/person/list?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["person"]
        }),
        createPerson: builder.mutation<CreateResultModel, PersonCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/person/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["person"]
        }),
        updatePerson: builder.mutation<CreateResultModel, PersonCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/person/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["person"]
        }),
        deletePerson: builder.mutation<CreateResultModel, { person_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/person/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["person"]
        }),
        readPerson: builder.query<PersonReadResultModel, { person_id?: number | string }>({
            query: (args?: { person_id?: number | string }) => {
                return {
                    url: `app/person/read`,
                    params: args
                }
            },
            providesTags: ["person"]
        }),
    })
})

export const {
    useLazyGetPersonListQuery,
    useCreatePersonMutation,
    useUpdatePersonMutation,
    useDeletePersonMutation,
    useLazyReadPersonQuery,
} = personApi

export default personApi;