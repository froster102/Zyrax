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
    selected_gender: 'men',
    cartSummary: {
        mrpTotal: 0,
        totalCartAmount: 0,
        totalCouponDiscount: 0,
        offerAmount: 0
    },
    defaultDeliveryAddress: ''
}

function saveToLocalStorage(state) {
    localStorage.setItem('user', JSON.stringify({
        wishlist: state.wishlist,
        cart: state.cart,
        selected_gender: state.selected_gender,
        cartSummary: state.cartSummary,
        defaultDeliveryAddress : state.defaultDeliveryAddress
    }))
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const { items = [] } = action.payload
            const itemMap = new Map(state.wishlist.items.map(item => [item._id, item]))
            for (const item of items) {
                if (!itemMap.has(item._id)) {
                    state.wishlist.items.push(item)
                }
            }
            saveToLocalStorage(state)
        },
        removeFromWishlist: (state, action) => {
            state.wishlist.items = state.wishlist.items.filter((item) => item._id !== action.payload.itemId)
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
            const existingItemIndex = state.cart.items.findIndex(item => item.productId._id === itemId && item.selectedSize === selectedSize)
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
            state.cart.items = state.cart.items.filter((item) => !(item?.productId._id === productId && item?.selectedSize === selectedSize))
            if (state.cart.items.length === 0) state.cart.appliedCoupon = {
                code: '',
                discount: 0,
                maxDiscountAmount: 0
            }
            saveToLocalStorage(state)
        },
        resetCart: (state) => {
            state.cart.items = []
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
        updateCartSummary: (state, action) => {
            state.cartSummary = {
                ...state.cartSummary,
                ...action.payload
            }
        },
        setDefaultDeliveryAddress: (state, action) => {
            state.defaultDeliveryAddress = action.payload
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
    updateCartSummary,
    setDefaultDeliveryAddress
} = userSlice.actions
export default userSlice.reducer

export const selectActiveGender = state => state.user.selected_gender
export const selectWishlistItems = state => state.user.wishlist.items
export const selectCartItems = state => state.user.cart.items
export const selectAppliedCoupon = state => state.user.cart.appliedCoupon
export const selectCartSummary = state => state.user.cartSummary
export const selectDefaultDeliveryAddress = state => state.user.defaultDeliveryAddress