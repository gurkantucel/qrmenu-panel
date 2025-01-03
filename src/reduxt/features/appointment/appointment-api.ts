import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { DropdownListModel } from 'utils/models/dropdown-list-model';
import { AppointmentCreateBodyModel, AppointmentListResultModel, AppointmentReadResultModel } from './models/appointment-list-model';

const appointmentApi = createApi({
    reducerPath: "appointmentApi",
    tagTypes: ["appointment"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getAppointmentList: builder.query<AppointmentListResultModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/appointment/list?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["appointment"]
        }),
        createAppointment: builder.mutation<CreateResultModel, AppointmentCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/appointment/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["appointment"]
        }),
        updateAppointment: builder.mutation<CreateResultModel, AppointmentCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/appointment/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["appointment"]
        }),
        deleteAppointment: builder.mutation<CreateResultModel, { appointment_id: number | string,  patient_id: number | string}>({
            query: (args) => {
                return {
                    url: `app/appointment/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["appointment"]
        }),
        readAppointment: builder.query<AppointmentReadResultModel, { appointment_id?: number | string, patient_id?: number | string }>({
            query: (args) => {
                return {
                    url: `app/appointment/read`,
                    params: args
                }
            },
            providesTags: ["appointment"]
        }),
        getAppointmentDropdown: builder.query<DropdownListModel, { label?: string }>({
            query: (args?: { label?: string }) => {
                return {
                    url: `app/appointment/dropDown`,
                    params: args
                }
            },
            providesTags: ["appointment"]
        }),
    })
})

export const {
    useLazyGetAppointmentListQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
    useLazyReadAppointmentQuery,
    useLazyGetAppointmentDropdownQuery,
} = appointmentApi

export default appointmentApi;