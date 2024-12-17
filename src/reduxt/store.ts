import { configureStore } from '@reduxjs/toolkit'
import definitionApi from './features/definition/definition-api'
import authApi from './features/auth/auth-api'
import personApi from './features/person/person-api'
import modalSlice from './features/definition/modalSlice'
import patientApi from './features/patient/patient-api'

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    [definitionApi.reducerPath]: definitionApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [personApi.reducerPath]: personApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    definitionApi.middleware,
    authApi.middleware,
    personApi.middleware,
    patientApi.middleware
  ]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch