import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { DropdownListModel } from 'utils/models/dropdown-list-model';
import { AppointmentCreateBodyModel, AppointmentHistoryListResultModel, AppointmentListResultModel, AppointmentReadResultModel, AppointmentUpdateNoteBodyModel, AppointmentUpdateStatusBodyModel } from './models/appointment-list-model';

const appointmentApi = createApi({
    reducerPath: "appointmentApi",
    tagTypes: ["appointment"],
    baseQuery: baseQueryWithReauth,
    refetchOnMountOrArgChange: true,
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
            invalidatesTags: (result) => result?.status ? ["appointment"] : [],
        }),
        updateAppointment: builder.mutation<CreateResultModel, AppointmentCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/appointment/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["appointment"] : [],
        }),
        deleteAppointment: builder.mutation<CreateResultModel, { appointment_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/appointment/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.status ? ["appointment"] : [],
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
        appointmentUpdateNote: builder.mutation<CreateResultModel, AppointmentUpdateNoteBodyModel>({
            query: (body) => {
                return {
                    url: `app/appointment/updateNote`,
                    method: "PUT",
                    body: body
                }
            },
        }),
        appointmentUpdateStatus: builder.mutation<CreateResultModel, AppointmentUpdateStatusBodyModel>({
            query: (body) => {
                return {
                    url: `app/appointment/updateStatus`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["appointment"] : [],
        }),
        listAppointmentHistory: builder.query<AppointmentHistoryListResultModel, { appointment_id?: number | string, patient_id?: number | string, filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { appointment_id?: number | string, patient_id?: number | string, filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/appointment/listAppointmentHistory?patient_id=${args?.patient_id}&appointment_id=${args?.appointment_id}&page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
        }),
    })
})

export const {
    useGetAppointmentListQuery,
    useLazyGetAppointmentListQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentMutation,
    useDeleteAppointmentMutation,
    useLazyReadAppointmentQuery,
    useLazyGetAppointmentDropdownQuery,
    useAppointmentUpdateNoteMutation,
    useAppointmentUpdateStatusMutation,
    useListAppointmentHistoryQuery
} = appointmentApi

export default appointmentApi;