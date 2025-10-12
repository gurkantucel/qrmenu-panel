import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export enum ModalEnum {
    newPerson,
    deletePerson,
    updatePerson,
    updatePersonPassword,
    viewPerson,
    newPatient,
    deletePatient,
    viewPatient,
    newPatientDiseaseHistory,
    deletePatientDiseaseHistory,
    newPatientMedicineHistory,
    deletePatientMedicineHistory,
    newPatientAllergyHistory,
    deletePatientAllergyHistory,
    newPatientFamilyDiseaseHistory,
    deletePatientFamilyDiseaseHistory,
    newPatientSurgeryHistory,
    deletePatientSurgeryHistory,
    newPatientTreatmentHistory,
    deletePatientTreatmentHistory,
    newPatientInjectionHistory,
    deletePatientInjectionHistory,
    newPatientFile,
    deletePatientFile,
    newPatientPaymentHistory,
    updateStatusPatientPayment,
    deletePatientPaymentHistory,
    viewPatientPaymentHistory,
    newAppointment,
    viewAppointment,
    updateAppointment,
    deleteAppointment,
    newAppointmentProcessType,
    updateAppointmentProcessType,
    deleteAppointmentProcessType,
    newAppointmentProcess,
    updateAppointmentProcess,
    deleteAppointmentProcess,
    viewAppointmentProcess,
    readAppointmentProcess,
    updateAppointmentStatus,
    smsTemplateUpdateStatus,
    deleteInfoModal,
    newPersonType,
    updatePersonType,
    deletePersonType,
    newMakeAnOffer,
    updateMakeAnOffer,
    viewMakeAnOffer,
    deleteMakeAnOffer,
    aydinlatmaMetni,
    uyelikSozlesmesi,
    kvkk,
    viewOrder,
    newDietTemplate,
    deleteDietTemplate,
    viewDietTemplate,
    newMeasurement,
    deleteMeasurement,
    viewMeasurement,
    newDieticianPatientDietTemplate,
    deleteDieticianPatientDietTemplate,
    viewDieticianPatientDietTemplate,
    newStock,
    deleteStock,
    updateStock,
    viewStock,
    newSendSms,
    viewSendSms,
}

type Model = {
    open: boolean
    modalType?: ModalEnum
    title?: string
    id?: number | string
    data?: any
}

interface ModalState {
    data: Model
}

const initialState: ModalState = {
    data: { open: false }
}

export const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setModal: (state, action: PayloadAction<Model>) => {
            state.data = action.payload
        },
        closeModal: (state) => {
            state.data = { open: false, id: undefined }
        },
        resetModalState: () => initialState
    }
})

export const { setModal, closeModal, resetModalState } = modalSlice.actions

export default modalSlice.reducer