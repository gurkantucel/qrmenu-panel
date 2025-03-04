import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { StatisticReadModel } from './models/statistic-model';
import { DropdownListModel } from 'utils/models/dropdown-list-model';

const statisticApi = createApi({
    reducerPath: "statisticApi",
    tagTypes: ["statistic"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getStatisticRead: builder.query<StatisticReadModel, void>({
            query: () => {
                return {
                    url: `app/statistics/read`,
                }
            },
            providesTags: ["statistic"]
        }),
        getStatisticAppointment: builder.query<DropdownListModel, { daily: boolean, start_date: string, end_date: string }>({
            query: (params) => {
                return {
                    url: `app/statistics/appointment`,
                    params: params
                }
            },
            providesTags: ["statistic"]
        }),
        getStatisticPatient: builder.query<DropdownListModel, { daily: boolean, start_date: string, end_date: string }>({
            query: (params) => {
                return {
                    url: `app/statistics/patient`,
                    params: params
                }
            },
            providesTags: ["statistic"]
        }),
    })
})

export const {
    useGetStatisticReadQuery,
    useGetStatisticAppointmentQuery,
    useGetStatisticPatientQuery
} = statisticApi

export default statisticApi;