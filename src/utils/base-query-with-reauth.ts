import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { RefreshTokenResultModel } from 'reduxt/features/auth/models/refresh-token-result-model';
import { resetTokenState, setToken } from 'reduxt/features/auth/tokenSlice';

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    prepareHeaders(headers, api) {
        const token = getCookie("token");
        if (token) {
            headers.set("Authorization", `Bearer ${token}`)
        }
    },
})

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
    // wait until the mutex is available without locking it
    await mutex.waitForUnlock()
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        // checking whether the mutex is locked
        if (!mutex.isLocked()) {
            deleteCookie("token");
            const release = await mutex.acquire()
            try {
                var refreshToken = getCookie("refreshToken");
                const refreshResult = await baseQuery({
                    url: 'token/refresh',
                    body: JSON.stringify({"refresh_token": refreshToken}),
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    }
                },
                    { ...api },
                    extraOptions
                )
                if (refreshResult.data) {
                    console.log(refreshResult.data);
                    var refreshModel = refreshResult.data as RefreshTokenResultModel;
                    setCookie("token",refreshModel.token)
                    setCookie("refreshToken",refreshModel.refresh_token)
                    api.dispatch(setToken({ token: refreshModel.token}))
                    // retry the initial query
                    result = await baseQuery(args, api, extraOptions)
                } else {
                    api.dispatch(resetTokenState())
                }
            } finally {
                // release must be called once the mutex should be released again.
                release()
            }
        } else {
            // wait until the mutex is available without locking it
            await mutex.waitForUnlock()
            result = await baseQuery(args, api, extraOptions)
        }
    }
    return result
}