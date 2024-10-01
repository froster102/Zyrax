import { createSlice } from '@reduxjs/toolkit'

const initialState = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {
    wishlist: {
        items: []
    },
    cart: {
        items: [],
        appliedCoupon: {
            code: '',
            discount: 0,
            maxDiscountAmount: 0
        }
    },
    addresses: [],
    selected_gender: 'men'
}

function saveToLocalStorage(state) {
    localStorage.setItem('user', JSON.stringify({
        wishlist: state.wishlist,
        cart: state.cart,
        addresses: state.addresses,
        selected_gender: state.selected_gender
    }))
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const { product, sync = false, items = [] } = action.payload
            if (sync) {
                const itemMap = new Map(state.wishlist.items.map(item => [item._id, item]))
                for (const item of items) {
                    if (!itemMap.has(item._id)) {
                        state.wishlist.items.push(item)
                    }
                }
                saveToLocalStorage(state)
            } else {
                state.wishlist.items.push(product)
                saveToLocalStorage(state)
            }
        },
        removeFromWishlist: (state, action) => {
            state.wishlist.items = state.wishlist.items.filter((item) => item._id !== action.payload.productId)
            saveToLocalStorage(state)
        },
        moveToCart: (state, action) => {
            const { itemToMove, selectedSize, selectedQty = 1 } = (action.payload)
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
            const itemMap = new Map(state.cart.items.map(item => [`${item?.product?._id}-${item?.selectedSize}`, item]))
            newItems.forEach(newItem => {
                const itemKey = `${newItem?.product?._id}-${newItem?.selectedSize}`
                if (itemMap.has(itemKey)) {
                    const existingItem = itemMap.get(itemKey)
                    existingItem.selectedQty += newItem.selectedQty || 1
                    itemMap.set(itemKey, existingItem)
                } else {
                    itemMap.set(itemKey, { ...newItem })
                }
            })
            state.cart.items = Array.from(itemMap.values())
            saveToLocalStorage(state)
        },
        updateCartItems: (state, action) => {
            const { itemId, selectedQty, selectedSize, index } = action.payload
            const existingItemIndex = state.cart.items.findIndex(item => item.product._id === itemId && item.selectedSize === selectedSize)
            if (existingItemIndex !== -1) {
                state.cart.items[existingItemIndex].selectedQty = selectedQty
                if (existingItemIndex !== index) {
                    state.cart.items.splice(index, 1)
                }
            } else {
                state.cart.items[index].selectedQty = selectedQty
                state.cart.items[index].selectedSize = selectedSize
            }
            saveToLocalStorage(state)
        },
        removeFromCart: (state, action) => {
            const { productId, selectedSize } = action.payload
            state.cart.items = state.cart.items.filter((item) => !(item?.product._id === productId && item?.selectedSize === selectedSize))
            if (state.cart.items.length === 0) state.cart.appliedCoupon = {
                code: '',
                discount: 0,
                maxDiscountAmount: 0
            }
            saveToLocalStorage(state)
        },
        resetCart: (state) => {
            state.cart.items = []
            state.cart.appliedCoupon = {
                code: '',
                discount: 0,
                maxDiscountAmount: 0
            }
            saveToLocalStorage(state)
        },
        applyCoupon: (state, action) => {
            const { coupon } = action.payload
            state.cart.appliedCoupon = coupon
            saveToLocalStorage(state)
        },
        removeAppliedCoupon: (state) => {
            state.cart.appliedCoupon = {
                code: '',
                discount: 0,
                maxDiscountAmount: 0
            }
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
        resetCartAndWishlist: (state) => {
            state.wishlist.items = []
            state.cart.items = []
            state.addresses = []
            saveToLocalStorage(state)
        },
        addAddress: (state, action) => {
            state.addresses = action.payload.addresses
            saveToLocalStorage(state)
        }
    }

})

export const {
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    syncCart,
    addToCart,
    updateCartItems,
    removeFromCart,
    applyCoupon,
    removeAppliedCoupon,
    moveToWishlist,
    resetCart,
    selectGender,
    resetCartAndWishlist,
    addAddress
} = userSlice.actions
export default userSlice.reducer

export const selectActiveGender = state => state.user.selected_gender
export const selectWishlistItems = state => state.user.wishlist.items
export const selectCartItems = state => state.user.cart.items
export const selectAppliedCoupon = state => state.user.cart.appliedCoupon