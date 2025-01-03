import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { AppointmentCalendarListResultModel } from './models/appointment-calendar-model';

const appointmentCalendarApi = createApi({
    reducerPath: "appointmentCalendarApi",
    tagTypes: ["appointmentCalendar"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getAppointmentCalendarList: builder.query<AppointmentCalendarListResultModel, { person_id?: number | string }>({
            query: (args?: { person_id?: number | string }) => {
                return {
                    url: `app/appointment/calendarView?person_id=${args?.person_id}`,
                }
            },
            providesTags: ["appointmentCalendar"]
        }),
    })
})

export const {
    useLazyGetAppointmentCalendarListQuery,
} = appointmentCalendarApi

export default appointmentCalendarApi;