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
import appointmentCalendarModalSlice from './features/branch/appointmentCalendarModalSlice'
import appointmentCalendarApi from './features/branch/appointment-calendar-api'
import appointmentProcessTypeApi from './features/branch/appointment-process-type-api'
import appointmentProcessApi from './features/settings/appointment-process-api'
import smsTemplateApi from './features/sms-template/sms-template-api'
import personTypeApi from './features/settings/person-type-api'
import makeAnOfferApi from './features/make-an-offer/make-an-offer-api'
import allergyHistoryApi from './features/patient/allergy-history-api'
import couponApi from './features/coupon/coupon-api'
import staticPageApi from './features/static-page/static-page-api'
import orderApi from './features/order/order-api'
import currentAccountApi from './features/current-account/current-account-api'
import statisticApi from './features/statistic/statistic-api'
import dietTemplateApi from './features/settings/diet-template-api'
import patientMeasurementApi from './features/patient/patient-measurement-api'
import smsIntegrationApi from './features/sms-integration/sms-integration-api'
import dieticianPatientDietTemplateApi from './features/patient/dietician-patient-diet-template-api'
import stockApi from './features/stock/stock-api'
import branchApi from './features/branch/branch-api'
import categoryApi from './features/category/category-api'
import menuApi from './features/menu/menu-api'
import commonApi from './features/common/common-api'
import imageGalleryApi from './features/image-gallery/image-gallery-api'
import selectedFoodApi from './features/selected-food/selected-food-api'
import qrCodeApi from './features/qr-code/qr-code-api'

export const store = configureStore({
  reducer: {
    modal: modalSlice,
    patientTab: patientTabSlice,
    appointmentCalendarModal: appointmentCalendarModalSlice,
    menuItem: menuItemSlice,
    [branchApi.reducerPath]: branchApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [menuApi.reducerPath]: menuApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
    [imageGalleryApi.reducerPath]: imageGalleryApi.reducer,
    [selectedFoodApi.reducerPath]: selectedFoodApi.reducer,
    [qrCodeApi.reducerPath]: qrCodeApi.reducer,
    //
    [definitionApi.reducerPath]: definitionApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [personApi.reducerPath]: personApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [diseaseHistoryApi.reducerPath]: diseaseHistoryApi.reducer,
    [medicineHistoryApi.reducerPath]: medicineHistoryApi.reducer,
    [familyDiseaseHistoryApi.reducerPath]: familyDiseaseHistoryApi.reducer,
    [surgeryHistoryApi.reducerPath]: surgeryHistoryApi.reducer,
    [treatmentHistoryApi.reducerPath]: treatmentHistoryApi.reducer,
    [injectionHistoryApi.reducerPath]: injectionHistoryApi.reducer,
    [allergyHistoryApi.reducerPath]: allergyHistoryApi.reducer,
    [healthInformationApi.reducerPath]: healthInformationApi.reducer,
    [patientFileApi.reducerPath]: patientFileApi.reducer,
    [tenantPaymentApi.reducerPath]: tenantPaymentApi.reducer,
    [appointmentCalendarApi.reducerPath]: appointmentCalendarApi.reducer,
    [appointmentProcessTypeApi.reducerPath]: appointmentProcessTypeApi.reducer,
    [appointmentProcessApi.reducerPath]: appointmentProcessApi.reducer,
    [smsTemplateApi.reducerPath]: smsTemplateApi.reducer,
    [personTypeApi.reducerPath]: personTypeApi.reducer,
    [makeAnOfferApi.reducerPath]: makeAnOfferApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [staticPageApi.reducerPath]: staticPageApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [currentAccountApi.reducerPath]: currentAccountApi.reducer,
    [statisticApi.reducerPath]: statisticApi.reducer,
    [dietTemplateApi.reducerPath]: dietTemplateApi.reducer,
    [patientMeasurementApi.reducerPath]: patientMeasurementApi.reducer,
    [smsIntegrationApi.reducerPath]: smsIntegrationApi.reducer,
    [dieticianPatientDietTemplateApi.reducerPath]: dieticianPatientDietTemplateApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    branchApi.middleware,
    categoryApi.middleware,
    menuApi.middleware,
    commonApi.middleware,
    imageGalleryApi.middleware,
    selectedFoodApi.middleware,
    qrCodeApi.middleware,
    //
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
    appointmentCalendarApi.middleware,
    appointmentProcessTypeApi.middleware,
    appointmentProcessApi.middleware,
    smsTemplateApi.middleware,
    personTypeApi.middleware,
    makeAnOfferApi.middleware,
    couponApi.middleware,
    staticPageApi.middleware,
    orderApi.middleware,
    currentAccountApi.middleware,
    statisticApi.middleware,
    dietTemplateApi.middleware,
    patientMeasurementApi.middleware,
    smsIntegrationApi.middleware,
    dieticianPatientDietTemplateApi.middleware,
    stockApi.middleware
  ]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch