import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { LoginBodyModel, LoginResultModel, RegisterBodyModel, ResetPasswordBodyModel, UsernameBodyModel } from './models/auth-models';
import { CreateResultModel } from 'utils/models/create-result-model';

const authApi = createApi({
    reducerPath: "authApi",
    tagTypes: ["auth_api"],
    baseQuery: fetchBaseQuery({ 
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/app`,
        headers:{
            "Access-Control-Allow-Origin" : "*"
        }
}),
    endpoints: (builder) => ({
        register: builder.mutation<CreateResultModel, RegisterBodyModel>({
            query: (body) => {
                return {
                    url: `register`,
                    method: "POST",
                    body: body
                }
            },
        }),
        login: builder.mutation<LoginResultModel, LoginBodyModel>({
            query: (body) => {
                return {
                    url: `login`,
                    method: "POST",
                    body: body
                }
            },
        }),
        forgetPassword: builder.mutation<CreateResultModel, UsernameBodyModel>({
            query: (body) => {
                return {
                    url: `forgetPassword`,
                    method: "POST",
                    body: body
                }
            },
        }),
        resetPassword: builder.mutation<CreateResultModel, ResetPasswordBodyModel>({
            query: (body) => {
                return {
                    url: `resetPassword`,
                    method: "POST",
                    body: body
                }
            },
        })
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useForgetPasswordMutation,
    useResetPasswordMutation
} = authApi;

export default authApi;