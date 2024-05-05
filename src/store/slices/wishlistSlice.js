
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { db } from '../../firebase/firebase';
import { collection, doc, getDocs } from 'firebase/firestore';

export const fetchWishlistItems = createAsyncThunk(
    'wishlist/fetchWishlistItems',
    async (userId) => {
        try {
            const userRef = doc(db, 'users', userId);
            const wishlistRef = collection(userRef, 'wishlist');
            const querySnapshot = await getDocs(wishlistRef);
            const wishlistItems = [];
            querySnapshot.forEach(doc => {
                wishlistItems.push({ id: doc.id, ...doc.data() });
            });
            return wishlistItems;
        } catch (error) {
            console.log('async thunk wishlist error', error);
        }
    }
);

const initialState = {
    wishlistItems: [],
    status: null,
};

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addWishlistItem: (state, action) => {
            state.wishlistItems.push(action.payload);
        },
        removeWishlistItem: (state, action) => {
            state.wishlistItems = state.wishlistItems.filter((item) => item._id !== action.payload);
        },
        clearWishlist: (state) => {
            state.wishlistItems = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlistItems.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchWishlistItems.fulfilled, (state, action) => {
                state.status = 'success';
                state.wishlistItems = action.payload;
            })
    },
});

export const selectWishlistItems = (state) => state.wishlist.wishlistItems;
export const selectStatus = (state) => state.wishlist.status;

export const { addWishlistItem, removeWishlistItem, clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
