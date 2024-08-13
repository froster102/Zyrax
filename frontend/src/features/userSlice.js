import { createSlice } from '@reduxjs/toolkit'

const initialState = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {
    wishlist: {
        items: []
    },
    cart: {
        items: []
    },
    selected_gender: 'men'
}

function saveToLocalStorage(state) {
    localStorage.setItem('user', JSON.stringify({
        wishlist: state.wishlist,
        cart: state.cart,
        selected_gender: state.selected_gender
    }))

}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const newItems = Array.isArray(action.payload) ? action.payload : [action.payload]
            newItems.forEach(newItem => {
                if (!state.wishlist.items.find(item => item._id === newItem._id)) state.wishlist.items.push(newItem)
            })
            saveToLocalStorage(state)
        },
        removeFromWishlist: (state, action) => {
            state.wishlist.items = state.wishlist.items.filter((item) => item._id !== action.payload._id)
            saveToLocalStorage(state)
        },
        moveToCart: (state, action) => {
            const itemToMove = (action.payload)
            if (!state.cart.items.find(item => item._id === itemToMove._id)) state.cart.items.push(itemToMove)
            state.wishlist.items = state.wishlist.items.filter(item => item._id !== action.payload._id)
            saveToLocalStorage(state)
        },
        addToCart: (state, action) => {
            const newItems = Array.isArray(action.payload) ? action.payload : [action.payload]
            newItems.forEach(newItem => {
                if (!state.cart.items.find(item => item._id === newItem._id)) state.cart.items.push(newItem)
            })
            saveToLocalStorage(state)
        },
        removeFromCart: (state, action) => {
            console.log(action.payload)
            state.cart.items = state.cart.items.filter((item) => item._id !== action.payload._id)
            saveToLocalStorage(state)
        },
        selectGender: (state, action) => {
            state.selected_gender = action.payload
            saveToLocalStorage(state)
        },
        resetCartAndWishlist: (state, action) => {
            state.wishlist.items = []
            state.cart.items = []
            saveToLocalStorage(state)
        }
    }

})

export const { addToWishlist, removeFromWishlist, moveToCart, addToCart, removeFromCart, selectGender, resetCartAndWishlist } = userSlice.actions
export default userSlice.reducer

export const selectActiveGender = state => state.user.selected_gender
export const selectWishlistItems = state => state.user.wishlist.items
export const selectCartItems = state => state.user.cart.items