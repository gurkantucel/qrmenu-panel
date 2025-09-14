import { createApi } from '@reduxjs/toolkit/query/react'
import { CompanyTypeListResultModel } from "./models/company-type-model";
import { CountryListResultModel } from './models/country-type-model';
import { CityListResultModel } from './models/city-type-model';
import { DistrictListResultModel } from './models/district-type-model';
import { DropdownListModel } from 'utils/models/dropdown-list-model';
import { QueryStringParamsType } from 'utils/models/query-string-params-type';
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { MembershipPackagesListModel } from './models/membership-packages-model';

const definitionApi = createApi({
    reducerPath: "definitionApi",
    tagTypes: ["definitions"],
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getPackagesDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/membership-packages/dropDown`,
            providesTags: ["definitions"]
        }),
        getMembershipPackagesDetail: builder.query<MembershipPackagesListModel, void>({
            query: () => `definition/membership-packages/detailedList`,
            providesTags: ["definitions"]
        }),
        getPersonTypeDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/person-type/dropDown`,
            providesTags: ["definitions"]
        }),
        getModuleDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/module/dropDown`,
            providesTags: ["definitions"]
        }),
        getCompanyTypeList: builder.query<CompanyTypeListResultModel, void>({
            query: () => `definition/company-type/list`,
            providesTags: ["definitions"]
        }),
        getCompanyTypeDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/company-type/dropDown`,
            providesTags: ["definitions"]
        }),
        getCountryList: builder.query<CountryListResultModel, void>({
            query: () => `definition/country/list`,
            providesTags: ["definitions"]
        }),
        getCountryDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/country/dropDown`,
            providesTags: ["definitions"]
        }),
        getBranchDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/branch/dropDown`,
            providesTags: ["definitions"]
        }),
        getCityList: builder.query<CityListResultModel, QueryStringParamsType>({
            query: (args?: QueryStringParamsType) => {
                return {
                    url: `definition/city/list`,
                    params: { country_id: args?.country_id }
                }
            },
            providesTags: ["definitions"]
        }),
        getCityDropdown: builder.query<DropdownListModel, QueryStringParamsType>({
            query: (args?: QueryStringParamsType) => {
                return {
                    url: `definition/city/dropDown`,
                    params: { country_id: args?.country_id }
                }
            },
            providesTags: ["definitions"]
        }),
        getDistrictList: builder.query<DistrictListResultModel, QueryStringParamsType>({
            query: (args?: QueryStringParamsType) => {
                return {
                    url: `definition/district/list`,
                    params: { city_id: args?.city_id }
                }
            },
            providesTags: ["definitions"]
        }),
        getDistrictDropdown: builder.query<DropdownListModel, QueryStringParamsType>({
            query: (args?: QueryStringParamsType) => {
                return {
                    url: `definition/district/dropDown`,
                    params: { city_id: args?.city_id }
                }
            },
            providesTags: ["definitions"]
        }),
        getWorkAgreementTypeList: builder.query<DropdownListModel, QueryStringParamsType>({
            query: () => {
                return {
                    url: `definition/work-agreement-type/dropDown`,
                }
            },
            providesTags: ["definitions"]
        }),
        getGenderDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/gender/dropDown`,
            providesTags: ["definitions"]
        }),
        getTypeOfWorkDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/type-of-work/dropDown`,
            providesTags: ["definitions"]
        }),
        getMaritalStatusDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/marital-status/dropDown`,
            providesTags: ["definitions"]
        }),
        getNationalityDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/nationality/dropDown`,
            providesTags: ["definitions"]
        }),
        getDisabilityStatusDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/disability-status/dropDown`,
            providesTags: ["definitions"]
        }),
        getEducationDegreeDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/education-degree/dropDown`,
            providesTags: ["definitions"]
        }),
        getBankDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/bank/dropDown`,
            providesTags: ["definitions"]
        }),
        getCurrencyDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/currency/dropDown`,
            providesTags: ["definitions"]
        }),
        getDiseaseStatusDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/disease-status/dropDown`,
            providesTags: ["definitions"]
        }),
        getTreatmentMethodDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/treatment-method/dropDown`,
            providesTags: ["definitions"]
        }),
        getKinshipDegreeDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/kinship-degree/dropDown`,
            providesTags: ["definitions"]
        }),
        getInjectionTypeDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/injection-type/dropDown`,
            providesTags: ["definitions"]
        }),
        getBloodTypeDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/blood-type/dropDown`,
            providesTags: ["definitions"]
        }),
        getPatientReferenceDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/patient-reference/dropDown`,
            providesTags: ["definitions"]
        }),
        getPatientProcessTypeDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/appointment-process-type/dropDown`,
            providesTags: ["definitions"]
        }),
        getPaymentMethodDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/payment-method/dropDown`,
            providesTags: ["definitions"]
        }),
        getAppointmentStatusDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/appointment-status/dropDown`,
            providesTags: ["definitions"]
        }),
        getAppointmentProcessTypeDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/appointment-process-type/dropDown`,
            providesTags: ["definitions"]
        }),
        getPaymentKindDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/payment-kind/dropDown`,
            providesTags: ["definitions"]
        }),
        getAppointmentTypeDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/appointment-type/dropDown`,
            providesTags: ["definitions"]
        }),
        getMealTimeDropdown: builder.query<DropdownListModel, void>({
            query: () => `definition/meal-time/dropDown`,
            providesTags: ["definitions"]
        }),
    })
})

export const {
    useGetPackagesDropdownQuery,
    useGetMembershipPackagesDetailQuery,
    useLazyGetPersonTypeDropdownQuery,
    useLazyGetModuleDropdownQuery,
    useGetCompanyTypeListQuery,
    useGetCompanyTypeDropdownQuery,
    useLazyGetCompanyTypeDropdownQuery,
    useGetCountryListQuery,
    useGetCountryDropdownQuery,
    useLazyGetCountryDropdownQuery,
    useGetBranchDropdownQuery,
    useLazyGetCityListQuery,
    useLazyGetCityDropdownQuery,
    useLazyGetDistrictListQuery,
    useLazyGetDistrictDropdownQuery,
    useLazyGetWorkAgreementTypeListQuery,
    useGetGenderDropdownQuery,
    useLazyGetGenderDropdownQuery,
    useLazyGetTypeOfWorkDropdownQuery,
    useLazyGetMaritalStatusDropdownQuery,
    useLazyGetNationalityDropdownQuery,
    useLazyGetDisabilityStatusDropdownQuery,
    useLazyGetEducationDegreeDropdownQuery,
    useLazyGetBankDropdownQuery,
    useLazyGetCurrencyDropdownQuery,
    useLazyGetDiseaseStatusDropdownQuery,
    useLazyGetTreatmentMethodDropdownQuery,
    useLazyGetKinshipDegreeDropdownQuery,
    useLazyGetInjectionTypeDropdownQuery,
    useLazyGetBloodTypeDropdownQuery,
    useLazyGetPatientReferenceDropdownQuery,
    useLazyGetPatientProcessTypeDropdownQuery,
    useLazyGetPaymentMethodDropdownQuery,
    useGetAppointmentStatusDropdownQuery,
    useLazyGetAppointmentStatusDropdownQuery,
    useLazyGetAppointmentProcessTypeDropdownQuery,
    useLazyGetPaymentKindDropdownQuery,
    useGetAppointmentTypeDropdownQuery,
    useLazyGetAppointmentTypeDropdownQuery,
    useLazyGetMealTimeDropdownQuery,
} = definitionApi

export default definitionApi;