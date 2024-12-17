import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export enum ModalEnum {
    newPerson,
    deletePerson,
    updatePerson,
    viewPerson,
    newPatient,
    deletePatient,
    viewPatient
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
            state.data = { open: false }
        },
        resetModalState: () => initialState
    }
})

export const { setModal, closeModal, resetModalState } = modalSlice.actions

export default modalSlice.reducer