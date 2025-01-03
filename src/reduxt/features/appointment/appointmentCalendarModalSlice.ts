import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export enum AppointmentCalendarModalEnum {
    appointmentCalendar
}

type Model = {
    open: boolean
    modalType?: AppointmentCalendarModalEnum
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

export const appointmentCalendarModalSlice = createSlice({
    name: "appointmentCalendarModal",
    initialState,
    reducers: {
        setCalendarModal: (state, action: PayloadAction<Model>) => {
            state.data = action.payload
        },
        closeCalendarModal: (state) => {
            state.data = { open: false }
        },
        resetCalendarModalState: () => initialState
    }
})

export const { setCalendarModal, closeCalendarModal, resetCalendarModalState } = appointmentCalendarModalSlice.actions

export default appointmentCalendarModalSlice.reducer