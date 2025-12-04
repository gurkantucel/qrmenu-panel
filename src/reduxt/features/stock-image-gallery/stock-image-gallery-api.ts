import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { StockImageGalleryModel } from './models/image-gallery-model';

const stockImageGalleryApi = createApi({
    reducerPath: "stockImageGalleryApi",
    tagTypes: ["stockImageGallery"],
    baseQuery: baseQueryWithReauth,
    //refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        getStockImageGalleryList: builder.query<StockImageGalleryModel, void>({
            query: () => {
                return {
                    url: `common/getStockImageGallery`,
                }
            },
            providesTags: ["stockImageGallery"]
        }),
    })
})

export const {
    useGetStockImageGalleryListQuery,
} = stockImageGalleryApi

export default stockImageGalleryApi;