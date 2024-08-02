import { createSlice } from '@reduxjs/toolkit'

const initialState = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) :
    {
        user: {
            token: null,
        },
        admin: {
            token: null,
        },
        role: null
    }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserCredentials: (state, action) => {
            const { token, role } = action.payload
            state.user.token = token
            state.role = role
            localStorage.setItem('auth', JSON.stringify({ ...initialState, user: { token }, role }))
        },
        setAdminCredentials: (state, action) => {
            const { token, role } = action.payload
            state.admin.token = token
            state.role = role
            localStorage.setItem('auth', JSON.stringify({ ...initialState, admin: { token }, role }))
        },
        userLogout: (state, action) => {
            state.user.token = null
            state.role = null
            localStorage.setItem('auth', JSON.stringify({ ...initialState, user: {token:null}, role: null }))
        },
        adminLogout: (state, action) => {
            state.admin.token = null
            state.role = null
            localStorage.setItem('auth', JSON.stringify({ ...initialState, admin: {token: null}, role: null }))
        }
    }
})

export const { setUserCredentials, setAdminCredentials, userLogout, adminLogout } = authSlice.actions
export default authSlice.reducer

export const selectUserToken = state => state.auth.user.token
export const selectAdminToken = state => state.auth.admin.token
