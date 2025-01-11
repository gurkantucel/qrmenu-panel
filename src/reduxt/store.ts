import { configureStore } from '@reduxjs/toolkit'
import definitionApi from './features/definition/definition-api'
import authApi from './features/auth/auth-api'
import personApi from './features/person/person-api'
import modalSlice from './features/definition/modalSlice'
import menuItemSlice from './features/auth/menuItemSlice'
import patientApi from './features/patient/patient-api'
import patientTabSlice from './features/definition/patientTabSlice'
import diseaseHistoryApi from './features/patient/disease-history-api'
import medicineHistoryApi from './features/patient/medicine-history-api'
import familyDiseaseHistoryApi from './features/patient/family-disease-history-api'
import surgeryHistoryApi from './features/patient/surgery-history-api'
import treatmentHistoryApi from './features/patient/treatment-history-api'
import injectionHistoryApi from './features/patient/injection-history-api'
import healthInformationApi from './features/patient/health-information-api'
import patientFileApi from './features/patient/patient-file-api'
import patientPaymentHistoryApi from './features/patient/patient-payment-history-api'
import appointmentCalendarModalSlice from './features/appointment/appointmentCalendarModalSlice'
import appointmentCalendarApi from './features/appointment/appointment-calendar-api'
import appointmentApi from './features/appointment/appointment-api'
import appointmentProcessTypeApi from './features/appointment/appointment-process-type-api'
import appointmentProcessApi from './features/settings/appointment-process-api'
import smsTemplateApi from './features/sms-template/sms-template-api'

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    patientTab: patientTabSlice,
    appointmentCalendarModal: appointmentCalendarModalSlice,
    menuItem: menuItemSlice,
    [definitionApi.reducerPath]: definitionApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [personApi.reducerPath]: personApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [diseaseHistoryApi.reducerPath]: diseaseHistoryApi.reducer,
    [medicineHistoryApi.reducerPath]: medicineHistoryApi.reducer,
    [familyDiseaseHistoryApi.reducerPath]: familyDiseaseHistoryApi.reducer,
    [surgeryHistoryApi.reducerPath] : surgeryHistoryApi.reducer,
    [treatmentHistoryApi.reducerPath] : treatmentHistoryApi.reducer,
    [injectionHistoryApi.reducerPath] : injectionHistoryApi.reducer,
    [healthInformationApi.reducerPath] : healthInformationApi.reducer,
    [patientFileApi.reducerPath] : patientFileApi.reducer,
    [patientPaymentHistoryApi.reducerPath] : patientPaymentHistoryApi.reducer,
    [appointmentApi.reducerPath] : appointmentApi.reducer,
    [appointmentCalendarApi.reducerPath]: appointmentCalendarApi.reducer,
    [appointmentProcessTypeApi.reducerPath] : appointmentProcessTypeApi.reducer,
    [appointmentProcessApi.reducerPath] : appointmentProcessApi.reducer,
    [smsTemplateApi.reducerPath] : smsTemplateApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    definitionApi.middleware,
    authApi.middleware,
    personApi.middleware,
    patientApi.middleware,
    diseaseHistoryApi.middleware,
    medicineHistoryApi.middleware,
    familyDiseaseHistoryApi.middleware,
    surgeryHistoryApi.middleware,
    treatmentHistoryApi.middleware,
    injectionHistoryApi.middleware,
    healthInformationApi.middleware,
    patientFileApi.middleware,
    patientPaymentHistoryApi.middleware,
    appointmentApi.middleware,
    appointmentCalendarApi.middleware,
    appointmentProcessTypeApi.middleware,
    appointmentProcessApi.middleware,
    smsTemplateApi.middleware
  ]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch