import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from 'utils/base-query-with-reauth';
import { ChangePasswordResultModel, UpdatePasswordBodyModel } from '../auth/models/auth-models';

const userApi = createApi({
    reducerPath: "userApi",
    tagTypes: ["user"],
    baseQuery: baseQueryWithReauth,
    //refetchOnMountOrArgChange: true,
    endpoints: (builder) => ({
        changePassword: builder.mutation<ChangePasswordResultModel, UpdatePasswordBodyModel>({
            query: (body) => {
                return {
                    url: `auth/updatePassword`,
                    method: "POST",
                    body: body
                }
            },
        })
    })
})

export const {
    useChangePasswordMutation
} = userApi

export default userApi;