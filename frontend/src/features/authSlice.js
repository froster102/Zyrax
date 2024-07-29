import { createSlice } from '@reduxjs/toolkit'

const initialState = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')) :
    {
        user: {
            token: null,
        },
        admin: {
            token: null
        }
    }

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserCredentials: (state, action) => {
            const { token } = action.payload
            state.user.token = token
            localStorage.setItem('auth', JSON.stringify({ ...initialState, user: { token } }))
        },
        setAdminCredentials: (state, action) => {
            const { token } = action.payload
            console.log(token)
            state.admin.token = token
            localStorage.setItem('auth', JSON.stringify({ ...initialState, admin: { token } }))
        },
        userLogout: (state, action) => {
            state.user.token = null
            localStorage.setItem('auth', JSON.stringify({ ...initialState, user: null }))
        },
        adminLogout: (state, action) => {
            state.admin.token = null
            localStorage.setItem('auth', JSON.stringify({ ...initialState, admin: null }))
        }
    }
})

export const { setUserCredentials, setAdminCredentials, userLogout, adminLogout } = authSlice.actions
export default authSlice.reducer

export const selectUserToken = state => state.auth.user.token
export const selectAdminToken = state => state.auth.admin.token
