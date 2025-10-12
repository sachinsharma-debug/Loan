import { createSlice } from '@reduxjs/toolkit'

const initialState = { companyid:"" }

const counterSlice = createSlice({
  name: 'Store',
  initialState,
  reducers: {
    setcompanyid: (state,action) => {
             state.companyid=action.payload
    }
  },
})

export const { setcompanyid } = counterSlice.actions
export default counterSlice.reducer
