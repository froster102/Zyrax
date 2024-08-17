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
        syncWishlist: (state, action) => {
            console.log(action.payload)
            const dbItems = Array.isArray(action.payload) ? action.payload : [action.payload]
            state.wishlist.items = dbItems
            saveToLocalStorage(state)
        },
        addToWishlist: (state, action) => {
            const newItems = Array.isArray(action.payload) ? action.payload : [action.payload]
            newItems.forEach(newItem => {
                if (!state.wishlist.items.find(item => item._id === newItem._id)) {
                    console.log(newItem)
                    state.wishlist.items.push(newItem)
                }
            })
            saveToLocalStorage(state)
        },
        removeFromWishlist: (state, action) => {
            state.wishlist.items = state.wishlist.items.filter((item) => item._id !== action.payload._id)
            saveToLocalStorage(state)
        },
        moveToCart: (state, action) => {
            const { itemToMove, selectedSize, selectedQty = 1 } = (action.payload)
            console.log(itemToMove, selectedSize, selectedQty)
            if (!state.cart.items.find(item => item.product?._id === itemToMove._id)) state.cart.items.push({ product: itemToMove, selectedSize, selectedQty })
            state.wishlist.items = state.wishlist.items.filter(item => item._id !== itemToMove?._id)
            saveToLocalStorage(state)
        },
        syncCart: (state, action) => {
            const dbItems = Array.isArray(action.payload) ? action.payload : [action.payload]
            state.cart.items = dbItems
            saveToLocalStorage(state)
        },
        addToCart: (state, action) => {
            const newItems = Array.isArray(action.payload) ? action.payload : [action.payload]
            console.log(newItems)
            const itemMap = new Map(state.cart.items.map(item => [item?.product?._id, item]))
            newItems.forEach(newItem => {
                if (newItem?.product?._id) {
                    itemMap.set(newItem?.product?._id, newItem)
                }
            })
            state.cart.items = Array.from(itemMap.values())
            saveToLocalStorage(state)
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            state.cart.items = state.cart.items.filter((item) => item?.product._id !== productId)
            saveToLocalStorage(state)
        },
        moveToWishlist: (state, action) => {
            const { itemToMove } = action.payload
            if (!state.wishlist.items.find(item => item._id === itemToMove._id)) state.wishlist.items.push(itemToMove)
            state.cart.items = state.cart.items.filter((item) => item?.product._id !== itemToMove._id)
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

export const { syncWishlist,addToWishlist, removeFromWishlist, moveToCart, syncCart, addToCart, removeFromCart, moveToWishlist, selectGender, resetCartAndWishlist } = userSlice.actions
export default userSlice.reducer

export const selectActiveGender = state => state.user.selected_gender
export const selectWishlistItems = state => state.user.wishlist.items
export const selectCartItems = state => state.user.cart.items