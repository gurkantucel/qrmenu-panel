import { PayloadAction, createSlice } from "@reduxjs/toolkit"


interface TokenState {
    token?: string
}

const initialState: TokenState = {
    token: ""
}

export const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<TokenState>) => {
            state = action.payload
        },
        resetTokenState: () => initialState
    }
})

export const { setToken, resetTokenState } = tokenSlice.actions

export default tokenSlice.reducer