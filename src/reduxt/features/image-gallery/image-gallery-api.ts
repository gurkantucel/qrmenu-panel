import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { ImageGalleryModel, UpdateImageGalleryOrderBodyModel } from './models/image-gallery-model';
import { CreateResultModel } from 'utils/models/create-result-model';

const imageGalleryApi = createApi({
    reducerPath: "imageGalleryApi",
    tagTypes: ["imageGallery"],
    baseQuery: baseQueryWithReauth,
    //refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getImageGalleryList: builder.query<ImageGalleryModel, { branchSlug: string }>({
            query: (args) => {
                return {
                    url: `company/getImageGallery`,
                    params: args
                }
            },
            providesTags: ["imageGallery"]
        }),
        createImageGallery: builder.mutation<CreateResultModel, FormData>({
            query: (body) => {
                return {
                    url: `company/createImageGallery`,
                    method: "POST",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["imageGallery"] : [],
        }),
        deleteImageGallery: builder.mutation<CreateResultModel, { imageId: string }>({
            query: (args) => {
                return {
                    url: `company/deleteImage`,
                    method: "DELETE",
                    params: args
                }
            },
            invalidatesTags: (result) => result?.success ? ["imageGallery"] : [],
        }),
        updateImageGalleryOrder: builder.mutation<CreateResultModel, UpdateImageGalleryOrderBodyModel>({
            query: (body) => {
                return {
                    url: `company/updateImageGalleryOrder`,
                    method: "PUT",
                    body: body
                }
            },
            invalidatesTags: (result) => result?.success ? ["imageGallery"] : [],
        }),
    })
})

export const {
    useGetImageGalleryListQuery,
    useCreateImageGalleryMutation,
    useDeleteImageGalleryMutation,
    useUpdateImageGalleryOrderMutation
} = imageGalleryApi

export default imageGalleryApi;