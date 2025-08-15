import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
    const response = await fetch(`https://backend-chi-sepia.vercel.app/api/cart?userId=${userId}`);
    const data = await response.json();
    return { userId, cartItems: data.carts[userId] || [] };
});

export const addToCart = createAsyncThunk("cart/addToCart", async ({ userId, item }) => {
    const response = await fetch("https://backend-chi-sepia.vercel.app/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, product: item }), 
    });
    return { userId, item };
});

export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({ userId, productId }) => {
    await fetch("https://backend-chi-sepia.vercel.app/api/cart", { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
    });
    return { userId, productId };
});

export const updateCartQuantity = createAsyncThunk(
    "cart/updateCartQuantity",
    async ({ userId, productId, change }) => {
        await fetch(`https://backend-chi-sepia.vercel.app/api/cart`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, productId, change }),
        });
        return { userId, productId, change };
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: { carts: {}, status: "idle", error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.carts[action.payload.userId] = action.payload.cartItems || [];
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                const { userId, item } = action.payload;
                if (!state.carts[userId]) state.carts[userId] = []; 

                const existingItem = state.carts[userId].find(i => i.id === item.id);
                if (existingItem) {
                    existingItem.quantity += 1; 
                } else {
                    state.carts[userId].push({ ...item, quantity: 1 });
                }
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                const { userId, productId } = action.payload;
                if (state.carts[userId]) {
                    state.carts[userId] = state.carts[userId].filter(item => item.id !== productId); // ✅ Fix: Remove item correctly
                }
            })
        .addCase(updateCartQuantity.fulfilled, (state, action) => {
            const { userId, productId, change } = action.payload;
            if (state.carts[userId]) {
                const item = state.carts[userId].find((item) => item.id === productId);
                if (item) item.quantity += change;
            }
        });
},
});

export default cartSlice.reducer;
