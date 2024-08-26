import { createSlice } from '@reduxjs/toolkit'

const initialState = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) :
    {
        user: {
            name: null,
            accessToken: null,
            role: null
        }
    }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserCredentials: (state, action) => {
            const { accessToken, role, name } = action.payload
            state.user.name = name
            state.user.accessToken = accessToken
            state.user.role = role
            localStorage.setItem('auth', JSON.stringify({ ...initialState, user: { accessToken, role } }))
        },
        userLogout: (state) => {
            state.user.accessToken = null
            state.user.role = null
            localStorage.setItem('auth', JSON.stringify({ ...initialState, user: { accessToken: null, role: null } }))
        }
    }
})

export const { setUserCredentials, userLogout } = authSlice.actions
export default authSlice.reducer

export const selectUserToken = state => state.auth.user.accessToken ? true : false
export const seleUserRole = state => state.auth.user.role
