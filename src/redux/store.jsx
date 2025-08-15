import { configureStore } from "@reduxjs/toolkit";
import authReducer from './features/authSlice'
import productsReducer from './features/productSlice'
import cartsReducer from './features/cartSlice'
const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productsReducer,
        carts:cartsReducer
    }
})
export default store;