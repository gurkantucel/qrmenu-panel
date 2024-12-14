import { configureStore } from '@reduxjs/toolkit'
import definitionApi from './features/definition/definition-api'
import authApi from './features/auth/auth-api'

export const store = configureStore({
  reducer: {
    [definitionApi.reducerPath]: definitionApi.reducer,
    [authApi.reducerPath]: authApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    definitionApi.middleware,
    authApi.middleware
  ]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch