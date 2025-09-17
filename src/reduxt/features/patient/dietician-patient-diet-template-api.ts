import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth'
import { CreateResultModel } from 'utils/models/create-result-model'
import { DropdownListModel } from 'utils/models/dropdown-list-model'
import { CreateDieticianPatientDietTemplateBodyModel, DieticianPatientDietTemplateListModel, DieticianPatientDietTemplateReadModel } from './models/dietician-patient-diet-template-list-model'

const dieticianPatientDietTemplateApi = createApi({
    reducerPath: "dieticianPatientDietTemplateApi",
    tagTypes: ["dieticianPatientDietTemplate"],
    baseQuery: baseQueryWithReauth,
    refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getDieticianPatientDietTemplateList: builder.query<DieticianPatientDietTemplateListModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `dietitian/patient/listPatientDietTemplate?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["dieticianPatientDietTemplate"]
        }),
        createDieticianPatientDietTemplate: builder.mutation<CreateResultModel, CreateDieticianPatientDietTemplateBodyModel>({
            query: (body) => {
                return {
                    url: `dietitian/patient/createPatientDietTemplate`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["dieticianPatientDietTemplate"] : [],
        }),
        updateDieticianPatientDietTemplate: builder.mutation<CreateResultModel, CreateDieticianPatientDietTemplateBodyModel>({
            query: (body) => {
                return {
                    url: `dietitian/patient/updatePatientDietTemplate`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["dieticianPatientDietTemplate"] : [],
        }),
        deleteDieticianPatientDietTemplate: builder.mutation<CreateResultModel, { patient_diet_template_id: number | string, patient_id: number | string, person_id: number | string }>({
            query: (args) => {
                return {
                    url: `dietitian/patient/deletePatientDietTemplate`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.status ? ["dieticianPatientDietTemplate"] : [],
        }),
        readDieticianPatientDietTemplate: builder.query<DieticianPatientDietTemplateReadModel, { patient_diet_template_id: number | string, patient_id?: number | string, person_id?: number | string }>({
            query: (args?: { patient_diet_template_id: number | string, patient_id?: number | string, person_id?: number | string }) => {
                return {
                    url: `dietitian/patient/readPatientDietTemplate`,
                    params: args
                }
            },
        }),
        getPatientDropdown: builder.query<DropdownListModel, { label?: string }>({
            query: (args?: { label?: string }) => {
                return {
                    url: `dietitian/patient/dropDown`,
                    params: args
                }
            },
            providesTags: ["dieticianPatientDietTemplate"]
        }),
        printDietTemplate: builder.query<void, { patient_diet_template_id?: string, patient_id?: string, dietitian_id?: string }>({
            query: (args?: { patient_diet_template_id?: string, patient_id?: string, dietitian_id?: string }) => ({
                url: `patient/diet/pdf`,
                responseHandler: async (response: Response) => {
                    const blobUrl = window.URL.createObjectURL(await response.blob());
                    //console.log(JSON.stringify(response.headers));
                    let fileName = response.headers.get("content-disposition")?.split('filename=')[1].split(';')[0];
                    fileName = decodeURIComponent(fileName ?? "download.pdf");
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = fileName ?? "download.pdf";
                    a.click();
                    a.parentNode?.removeChild(a);
                },
                keepUnusedDataFor: 0,
                params: args
            }),
            //transformResponse: (response: any) => response.blob()
        }),
    })
})

export const {
    useGetDieticianPatientDietTemplateListQuery,
    useCreateDieticianPatientDietTemplateMutation,
    useUpdateDieticianPatientDietTemplateMutation,
    useDeleteDieticianPatientDietTemplateMutation,
    useLazyReadDieticianPatientDietTemplateQuery,
    useReadDieticianPatientDietTemplateQuery,
    useLazyGetPatientDropdownQuery,
    useLazyPrintDietTemplateQuery
} = dieticianPatientDietTemplateApi;


export default dieticianPatientDietTemplateApi;