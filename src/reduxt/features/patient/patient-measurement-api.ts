import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { DropdownListModel } from 'utils/models/dropdown-list-model';
import { CreateDieticianPatientMeasurementBodyModel, DieticianPatientMeasurementChartModel, DieticianPatientMeasurementListModel } from './models/patient-measurement-list-model';

const patientMeasurementApi = createApi({
    reducerPath: "patientMeasurementApi",
    tagTypes: ["patientMeasurement"],
    baseQuery: baseQueryWithReauth,
    refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getDieticianPatientMeasurementList: builder.query<DieticianPatientMeasurementListModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `patient/measurement/list?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["patientMeasurement"]
        }),
        createDieticianPatientMeasurement: builder.mutation<CreateResultModel, CreateDieticianPatientMeasurementBodyModel>({
            query: (body) => {
                return {
                    url: `patient/measurement/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["patientMeasurement"] : [],
        }),
        updateDieticianPatientMeasurement: builder.mutation<CreateResultModel, CreateDieticianPatientMeasurementBodyModel>({
            query: (body) => {
                return {
                    url: `patient/measurement/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["patientMeasurement"] : [],
        }),
        deleteDieticianMeasurement: builder.mutation<CreateResultModel, { measurement_id: number | string, patient_id: string }>({
            query: (args) => {
                return {
                    url: `patient/measurement/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.status ? ["patientMeasurement"] : [],
        }),
        readChartDieticianPatientMeasurement: builder.query<DieticianPatientMeasurementChartModel, { patient_id?: number | string, appointment_id?: number | string, start_date: string, end_date: string }>({
            query: (args?: { patient_id?: number | string, appointment_id?: number | string, start_date?: string, end_date?: string }) => {
                return {
                    url: `patient/measurement/readChart`,
                    params: args
                }
            },
            providesTags: ["patientMeasurement"]
        }),
        getPatientDropdown: builder.query<DropdownListModel, { label?: string }>({
            query: (args?: { label?: string }) => {
                return {
                    url: `patient/measurement/dropDown`,
                    params: args
                }
            },
            providesTags: ["patientMeasurement"]
        }),
    })
})

export const {
    useGetDieticianPatientMeasurementListQuery,
    useCreateDieticianPatientMeasurementMutation,
    useUpdateDieticianPatientMeasurementMutation,
    useDeleteDieticianMeasurementMutation,
    useReadChartDieticianPatientMeasurementQuery,
    useLazyReadChartDieticianPatientMeasurementQuery,
    useLazyGetPatientDropdownQuery
} = patientMeasurementApi;


export default patientMeasurementApi;