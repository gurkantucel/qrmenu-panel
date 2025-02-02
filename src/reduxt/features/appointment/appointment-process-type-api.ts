import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { AppointmentProcessDropdownModel, AppointmentProcessTypeCreateBodyModel, AppointmentProcessTypeListResultModel, AppointmentProcessTypeReadModel, AppointmentProcessTypeUpdateBodyModel } from './models/appointment-process-type-model';

const appointmentProcessTypeApi = createApi({
    reducerPath: "appointmentProcessTypeApi",
    tagTypes: ["appointment-process-type"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getAppointmentProcessTypeList: builder.query<AppointmentProcessTypeListResultModel, { filterSearch?: string, page?: number, pageSize?: number, appointment_id?: number | string }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number, appointment_id?: number | string }) => {
                return {
                    url: `app/appointment/listAppointmentProcess?appointment_id=${args?.appointment_id}&page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["appointment-process-type"]
        }),
        createAppointmentProcessType: builder.mutation<CreateResultModel, AppointmentProcessTypeCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/appointment/createAppointmentProcessHistory`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["appointment-process-type"]
        }),
        updateAppointmentProcessType: builder.mutation<CreateResultModel, AppointmentProcessTypeUpdateBodyModel>({
            query: (body) => {
                return {
                    url: `app/appointment/updateAppointmentProcessHistory`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["appointment-process-type"]
        }),
        deleteAppointmentProcessType: builder.mutation<CreateResultModel, { appointment_process_history_id: number | string, appointment_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/appointment/deleteAppointmentProcessHistory`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["appointment-process-type"]
        }),
        readAppointmentProcessType: builder.query<AppointmentProcessTypeReadModel, { appointment_id?: number | string, appointment_process_history_id?: number | string }>({
            query: (args?: { appointment_id?: number | string, appointment_process_history_id?: number | string }) => {
                return {
                    url: `app/appointment/readAppointmentProcessHistory`,
                    params: args
                }
            },
            providesTags: ["appointment-process-type"]
        }),
        getAppointmentProcessDropdown: builder.query<AppointmentProcessDropdownModel, void>({
            query: () => `app/appointment-process/dropDown`,
            providesTags: ["appointment-process-type"]
        }),
        printAppointment: builder.query<void, { appointment_id?: number | string }>({
            query: (args?: { appointment_id?: number | string }) => ({
                url: `app/appointment/printAppointment`,
                responseHandler: async (response: Response) => {
                    const blobUrl = window.URL.createObjectURL(await response.blob());
                    console.log(JSON.stringify(response.headers));
                    const fileName = response.headers.get("content-disposition")?.split('filename=')[1].split(';')[0];
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = fileName ?? "download.pdf";
                    a.click();
                    a.parentNode?.removeChild(a);
                },
                params: args
            }),
            //transformResponse: (response: any) => response.blob()
        }),
    })
})

export const {
    useLazyGetAppointmentProcessTypeListQuery,
    useCreateAppointmentProcessTypeMutation,
    useUpdateAppointmentProcessTypeMutation,
    useDeleteAppointmentProcessTypeMutation,
    useLazyReadAppointmentProcessTypeQuery,
    useLazyGetAppointmentProcessDropdownQuery,
    useLazyPrintAppointmentQuery
} = appointmentProcessTypeApi

export default appointmentProcessTypeApi;