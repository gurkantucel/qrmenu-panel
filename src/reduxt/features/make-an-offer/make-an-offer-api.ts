import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { CreateResultModel } from 'utils/models/create-result-model';
import { MakeAnOfferCreateBodyModel, MakeAnOfferListResultModel, MakeAnOfferReadResultModel } from './models/make-an-offer-model';

const makeAnOfferApi = createApi({
    reducerPath: "makeAnOfferApi",
    tagTypes: ["quote"],
    baseQuery: baseQueryWithReauth,
    refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getMakeAnOfferList: builder.query<MakeAnOfferListResultModel, { filterSearch?: string, page?: number, pageSize?: number }>({
            query: (args?: { filterSearch?: string, page?: number, pageSize?: number }) => {
                return {
                    url: `app/quote/list?page=${args?.page ?? 1}&pageSize=${args?.pageSize ?? 10}${args?.filterSearch != null ? `&${args.filterSearch}` : ''}`,
                }
            },
            providesTags: ["quote"]
        }),
        createMakeAnOffer: builder.mutation<CreateResultModel, MakeAnOfferCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/quote/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: ["quote"]
        }),
        updateMakeAnOffer: builder.mutation<CreateResultModel, MakeAnOfferCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/quote/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: ["quote"]
        }),
        deleteMakeAnOffer: builder.mutation<CreateResultModel, { appointment_id: number | string, patient_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/quote/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: ["quote"]
        }),
        readMakeAnOffer: builder.query<MakeAnOfferReadResultModel, { appointment_id?: number | string, patient_id?: number | string }>({
            query: (args) => {
                return {
                    url: `app/quote/read`,
                    params: args
                }
            },
            providesTags: ["quote"]
        }),
    })
})

export const {
    useGetMakeAnOfferListQuery,
    useCreateMakeAnOfferMutation,
    useUpdateMakeAnOfferMutation,
    useDeleteMakeAnOfferMutation,
    useReadMakeAnOfferQuery
} = makeAnOfferApi

export default makeAnOfferApi;