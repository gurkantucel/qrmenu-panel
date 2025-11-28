import { configureStore } from '@reduxjs/toolkit'
import definitionApi from './features/definition/definition-api'
import authApi from './features/auth/auth-api'
import personApi from './features/person/person-api'
import modalSlice from './features/definition/modalSlice'
import menuItemSlice from './features/auth/menuItemSlice'
import patientTabSlice from './features/definition/patientTabSlice'
import appointmentCalendarModalSlice from './features/branch/appointmentCalendarModalSlice'
import appointmentCalendarApi from './features/branch/appointment-calendar-api'
import appointmentProcessTypeApi from './features/branch/appointment-process-type-api'
import appointmentProcessApi from './features/settings/appointment-process-api'
import personTypeApi from './features/settings/person-type-api'
import staticPageApi from './features/static-page/static-page-api'
import orderApi from './features/order/order-api'
import currentAccountApi from './features/current-account/current-account-api'
import statisticApi from './features/statistic/statistic-api'
import dietTemplateApi from './features/settings/diet-template-api'
import branchApi from './features/branch/branch-api'
import categoryApi from './features/category/category-api'
import menuApi from './features/menu/menu-api'
import commonApi from './features/common/common-api'
import imageGalleryApi from './features/image-gallery/image-gallery-api'
import selectedFoodApi from './features/selected-food/selected-food-api'
import qrCodeApi from './features/qr-code/qr-code-api'
import packageApi from './features/package/package-api'
import userApi from './features/user/user-api'
import translateApi from './features/translate/translate-api'

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
    [orderApi.reducerPath]: orderApi.reducer,
    [packageApi.reducerPath]: packageApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [translateApi.reducerPath]: translateApi.reducer,
    //
    [definitionApi.reducerPath]: definitionApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [personApi.reducerPath]: personApi.reducer,
    [appointmentCalendarApi.reducerPath]: appointmentCalendarApi.reducer,
    [appointmentProcessTypeApi.reducerPath]: appointmentProcessTypeApi.reducer,
    [appointmentProcessApi.reducerPath]: appointmentProcessApi.reducer,
    [personTypeApi.reducerPath]: personTypeApi.reducer,
    [staticPageApi.reducerPath]: staticPageApi.reducer,
    [currentAccountApi.reducerPath]: currentAccountApi.reducer,
    [statisticApi.reducerPath]: statisticApi.reducer,
    [dietTemplateApi.reducerPath]: dietTemplateApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
    branchApi.middleware,
    categoryApi.middleware,
    menuApi.middleware,
    commonApi.middleware,
    imageGalleryApi.middleware,
    selectedFoodApi.middleware,
    qrCodeApi.middleware,
    orderApi.middleware,
    packageApi.middleware,
    userApi.middleware,
    translateApi.middleware,
    //
    definitionApi.middleware,
    authApi.middleware,
    personApi.middleware,
    appointmentCalendarApi.middleware,
    appointmentProcessTypeApi.middleware,
    appointmentProcessApi.middleware,
    personTypeApi.middleware,
    staticPageApi.middleware,
    currentAccountApi.middleware,
    statisticApi.middleware,
    dietTemplateApi.middleware,
  ]),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch