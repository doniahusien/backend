import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Fetch Cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
  const response = await fetch(`/api/cart?userId=${userId}`);
  const data = await response.json();
  return { userId, cartItems: data.carts[userId] || [] };
});

// ✅ Add to Cart
export const addToCart = createAsyncThunk("cart/addToCart", async ({ userId, item }) => {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, product: item }),
  });
  const data = await response.json();

  if (!data.item) {
    throw new Error(data.message || "Failed to add to cart");
  }

  return { userId, item: data.item }; // ✅ always return what server saved
});

// ✅ Remove from Cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async ({ userId, productId }) => {
  await fetch("/api/cart", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId }),
  });
  return { userId, productId };
});

// ✅ Update Quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, change }) => {
    await fetch(`/api/cart`, {
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
      // ✅ fetch
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.carts[action.payload.userId] = action.payload.cartItems || [];
      })
      // ✅ add
      .addCase(addToCart.fulfilled, (state, action) => {
        const { userId, item } = action.payload;
        if (!state.carts[userId]) state.carts[userId] = [];

        const existingItem = state.carts[userId].find((i) => i._id === item._id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.carts[userId].push(item); // item already has quantity from API
        }
      })
      // ✅ remove
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const { userId, productId } = action.payload;
        if (state.carts[userId]) {
          state.carts[userId] = state.carts[userId].filter((item) => item._id !== productId);
        }
      })
      // ✅ update quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { userId, productId, change } = action.payload;
        if (state.carts[userId]) {
          const item = state.carts[userId].find((item) => item._id === productId);
          if (item) {
            item.quantity = Math.max(1, item.quantity + change); // never below 1
          }
        }
      });
  },
});

export default cartSlice.reducer;
