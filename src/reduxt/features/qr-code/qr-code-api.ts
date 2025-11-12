import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { QrCodeModel } from './models/qr-code-model';
import { CreateResultModel } from 'utils/models/create-result-model';

const qrCodeApi = createApi({
    reducerPath: "qrCodeApi",
    tagTypes: ["qrCode"],
    baseQuery: baseQueryWithReauth,
    //refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getQrCodeList: builder.query<QrCodeModel, { branchId: string }>({
            query: (args) => {
                return {
                    url: `qrCodes/list`,
                    params: args
                }
            },
            providesTags: ["qrCode"]
        }),
        createQrCode: builder.mutation<CreateResultModel, FormData>({
            query: (body) => {
                return {
                    url: `qrCodes/create`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["qrCode"] : [],
        }),
        deleteImageGallery: builder.mutation<CreateResultModel, { imageId: string }>({
            query: (args) => {
                return {
                    url: `qrCodes/delete`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.success ? ["qrCode"] : [],
        }),
    })
})

export const {
    useGetQrCodeListQuery,
    useCreateQrCodeMutation,
    useDeleteImageGalleryMutation,
} = qrCodeApi

export default qrCodeApi;