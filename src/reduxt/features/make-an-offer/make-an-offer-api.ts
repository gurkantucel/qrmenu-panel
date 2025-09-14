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
            invalidatesTags: (result) => result?.status ? ["quote"] : [],
        }),
        updateMakeAnOffer: builder.mutation<CreateResultModel, MakeAnOfferCreateBodyModel>({
            query: (body) => {
                return {
                    url: `app/quote/update`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.status ? ["quote"] : [],
        }),
        deleteMakeAnOffer: builder.mutation<CreateResultModel, { quote_id: number | string }>({
            query: (args) => {
                return {
                    url: `app/quote/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.status ? ["quote"] : [],
        }),
        readMakeAnOffer: builder.query<MakeAnOfferReadResultModel, { quote_id?: number | string }>({
            query: (args) => {
                return {
                    url: `app/quote/read`,
                    params: args
                }
            },
            providesTags: ["quote"]
        }),
        printMakeAnOffer: builder.query<void, { quote_id?: number | string }>({
            query: (args?: { quote_id?: number | string }) => ({
                url: `app/quote/print`,
                responseHandler: async (response: Response) => {
                    const blobUrl = window.URL.createObjectURL(await response.blob());
                    console.log(JSON.stringify(response.headers));
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
    useGetMakeAnOfferListQuery,
    useCreateMakeAnOfferMutation,
    useUpdateMakeAnOfferMutation,
    useDeleteMakeAnOfferMutation,
    useReadMakeAnOfferQuery,
    useLazyReadMakeAnOfferQuery,
    useLazyPrintMakeAnOfferQuery
} = makeAnOfferApi

export default makeAnOfferApi;