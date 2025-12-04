import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export enum Modal2Enum {
    imageSelect
}

type Model2 = {
    open: boolean
    modalType?: Modal2Enum
    title?: string
    id?: number | string
    data?: any
}

interface Modal2State {
    data: Model2
}

const initialState: Modal2State = {
    data: { open: false }
}

export const modal2Slice = createSlice({
    name: "modal2",
    initialState,
    reducers: {
        setModal2: (state, action: PayloadAction<Model2>) => {
            state.data = action.payload
        },
        closeModal2: (state) => {
            state.data = { open: false, id: undefined }
        },
        resetModal2State: () => initialState
    }
})

export const { setModal2, closeModal2, resetModal2State } = modal2Slice.actions

export default modal2Slice.reducer