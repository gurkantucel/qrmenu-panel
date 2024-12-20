import { configureStore } from '@reduxjs/toolkit'
import definitionApi from './features/definition/definition-api'
import authApi from './features/auth/auth-api'
import personApi from './features/person/person-api'
import modalSlice from './features/definition/modalSlice'
import patientApi from './features/patient/patient-api'
import patientTabSlice from './features/definition/patientTabSlice'
import diseaseHistoryApi from './features/patient/disease-history-api'
import medicineHistoryApi from './features/patient/medicine-history-api'
import familyDiseaseHistoryApi from './features/patient/family-disease-history-api'

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    patientTab: patientTabSlice,
    [definitionApi.reducerPath]: definitionApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [personApi.reducerPath]: personApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [diseaseHistoryApi.reducerPath]: diseaseHistoryApi.reducer,
    [medicineHistoryApi.reducerPath]: medicineHistoryApi.reducer,
    [familyDiseaseHistoryApi.reducerPath]: familyDiseaseHistoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    definitionApi.middleware,
    authApi.middleware,
    personApi.middleware,
    patientApi.middleware,
    diseaseHistoryApi.middleware,
    medicineHistoryApi.middleware,
    familyDiseaseHistoryApi.middleware
  ]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch