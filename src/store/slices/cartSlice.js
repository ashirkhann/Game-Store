import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../../firebase/firebase';
import { collection, doc, getDocs } from 'firebase/firestore';

export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async (userId) => {
        try {
            const userRef = doc(db, 'users', userId);
            const cartRef = collection(userRef, 'cart');
            const querySnapshot = await getDocs(cartRef);
            const cartItems = [];
            querySnapshot.forEach(doc => {
                cartItems.push({ id: doc.id, ...doc.data() });
            });
            return cartItems;
        } catch (error) {
            console.log('async thunk cart error', error);
        }
    }
);

const initialState = {
    cartItems: [],
    status: null,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCartItem: (state, action) => {
            state.cartItems.push(action.payload);
        },
        removeCartItem: (state, action) => {
            state.cartItems = state.cartItems.filter((item) => item._id !== action.payload);
        },
        clearCart: (state) => {
            state.cartItems = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartItems.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.cartItems = action.payload;
                state.status = 'success';
            })

    },
});

export const selectCartItems = (state) => state.cart.cartItems;
export const selectStatus = (state) => state.cart.status;

export const { addCartItem, removeCartItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
