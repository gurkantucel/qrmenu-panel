import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export enum PatientTabEnum {
    kisisel_bilgiler,
    saglik_gecmisi,
    saglik_bilgileri,
    dosyalar,
    odemeler,
    olcumler,
    randevular,
    diyetListesi
}

type Model = {
    selectTab: PatientTabEnum
    title?: string
    id?: number | string
    data?: any
}

interface PatientTabState {
    data: Model
}

const initialState: PatientTabState = {
    data: { selectTab: PatientTabEnum.kisisel_bilgiler }
}

export const patientTabSlice = createSlice({
    name: "patientTab",
    initialState,
    reducers: {
        setTab: (state, action: PayloadAction<Model>) => {
            state.data = action.payload
        },
        resetTabState: () => initialState
    }
})

export const { setTab, resetTabState } = patientTabSlice.actions

export default patientTabSlice.reducer