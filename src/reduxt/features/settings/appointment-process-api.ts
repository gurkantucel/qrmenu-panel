import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { DropdownListModel } from 'utils/models/dropdown-list-model';
import { AppointmentProcessListResultModel, CreateAppointmentProcessBodyModel } from './models/appointment-process-model';

const appointmentProcessApi = createApi({
    reducerPath: "appointmentProcessApi",
    tagTypes: ["appointmentProcess"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getAppointmentProcessList: builder.query<AppointmentProcessListResultModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/appointment-process/list?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["appointmentProcess"]
        }),
        createAppointmentProcess: builder.mutation<CreateResultModel, CreateAppointmentProcessBodyModel>({
            query: (body) => {
                return {
                    url: `app/appointment-process/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["appointmentProcess"]
        }),
        updateAppointmentProcess: builder.mutation<CreateResultModel, CreateAppointmentProcessBodyModel>({
            query: (body) => {
                return {
                    url: `app/appointment-process/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["appointmentProcess"]
        }),
        deleteAppointmentProcess: builder.mutation<CreateResultModel, { appointment_process_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/appointment-process/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["appointmentProcess"]
        }),
        getAppointmentProcessDropdown: builder.query<DropdownListModel, { label?: string, include_packages?: boolean, excluded_appointment_process_id?: number }>({
            query: (args?: { label?: string, include_packages?: boolean, excluded_appointment_process_id?: number }) => {
                return {
                    url: `app/appointment-process/dropDown`,
                    params: args
                }
            },
            providesTags: ["appointmentProcess"]
        }),
    })
})

export const {
    useGetAppointmentProcessListQuery,
    useLazyGetAppointmentProcessListQuery,
    useCreateAppointmentProcessMutation,
    useUpdateAppointmentProcessMutation,
    useDeleteAppointmentProcessMutation,
    useLazyGetAppointmentProcessDropdownQuery,
} = appointmentProcessApi

export default appointmentProcessApi;