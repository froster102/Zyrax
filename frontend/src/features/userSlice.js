import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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
            state.wishlist.items.push(action.payload)
            saveToLocalStorage(state)
        },
        removeFromWishlist: (state, action) => {
            state.wishlist.items = state.wishlist.items.filter((item) => {
                item._id !== action.payload._id
            })
            saveToLocalStorage(state)
        },
        moveToCart: (state, action) => {
            state.cart.items.push(action.payload)
            state.wishlist.items.filter((item) => {
                item._id !== action.payload._id
            })
            saveToLocalStorage(state)
        },
        addToCart: (state, action) => {
            state.cart.items.push(action.payload)
            saveToLocalStorage(state)
        },
        removeFromCart: (state, action) => {
            state.cart.items = state.cart.items.filter((item) => {
                item._id !== action.payload
            })
            saveToLocalStorage(state)
        },
        selectGender: (state, action) => {
            state.selected_gender = action.payload
            saveToLocalStorage(state)
        }
    }

})

export const { addToWishlist, removeFromWishlist, moveToCart, addToCart, removeFromCart, selectGender } = userSlice.actions
export default userSlice.reducer

export const selected_gender = state => state.user.selected_gender