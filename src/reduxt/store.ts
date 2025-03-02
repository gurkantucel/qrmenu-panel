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
import tenantPaymentApi from './features/patient/tenant-payment-api'
import appointmentCalendarModalSlice from './features/appointment/appointmentCalendarModalSlice'
import appointmentCalendarApi from './features/appointment/appointment-calendar-api'
import appointmentApi from './features/appointment/appointment-api'
import appointmentProcessTypeApi from './features/appointment/appointment-process-type-api'
import appointmentProcessApi from './features/settings/appointment-process-api'
import smsTemplateApi from './features/sms-template/sms-template-api'
import personTypeApi from './features/settings/person-type-api'
import makeAnOfferApi from './features/make-an-offer/make-an-offer-api'
import allergyHistoryApi from './features/patient/allergy-history-api'
import couponApi from './features/coupon/coupon-api'
import staticPageApi from './features/static-page/static-page-api'
import orderApi from './features/order/order-api'
import currentAccountApi from './features/current-account/current-account-api'

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
    [allergyHistoryApi.reducerPath] : allergyHistoryApi.reducer,
    [healthInformationApi.reducerPath] : healthInformationApi.reducer,
    [patientFileApi.reducerPath] : patientFileApi.reducer,
    [tenantPaymentApi.reducerPath] : tenantPaymentApi.reducer,
    [appointmentApi.reducerPath] : appointmentApi.reducer,
    [appointmentCalendarApi.reducerPath]: appointmentCalendarApi.reducer,
    [appointmentProcessTypeApi.reducerPath] : appointmentProcessTypeApi.reducer,
    [appointmentProcessApi.reducerPath] : appointmentProcessApi.reducer,
    [smsTemplateApi.reducerPath] : smsTemplateApi.reducer,
    [personTypeApi.reducerPath] : personTypeApi.reducer,
    [makeAnOfferApi.reducerPath] : makeAnOfferApi.reducer,
    [couponApi.reducerPath] : couponApi.reducer,
    [staticPageApi.reducerPath] : staticPageApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [currentAccountApi.reducerPath]: currentAccountApi.reducer
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
    allergyHistoryApi.middleware,
    healthInformationApi.middleware,
    patientFileApi.middleware,
    tenantPaymentApi.middleware,
    appointmentApi.middleware,
    appointmentCalendarApi.middleware,
    appointmentProcessTypeApi.middleware,
    appointmentProcessApi.middleware,
    smsTemplateApi.middleware,
    personTypeApi.middleware,
    makeAnOfferApi.middleware,
    couponApi.middleware,
    staticPageApi.middleware,
    orderApi.middleware,
    currentAccountApi.middleware
  ]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch