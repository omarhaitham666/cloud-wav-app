import { createSlice } from "@reduxjs/toolkit";

export interface CartItem {
  ProductId: string;
  name: string;
  Price: number;
  image: string;
  quantity: number;
}
interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        (item) => item.ProductId === action.payload.ProductId
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ProductId: newItem.ProductId,
          name: newItem.name,
          Price: newItem.Price,
          image: newItem.image,
          quantity: 1,
        });
      }
      state.totalAmount += newItem.Price;
    },
    removeItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.ProductId === id);
      if (existingItem) {
        state.totalAmount -= existingItem.Price * existingItem.quantity;
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.ProductId !== id);
        }
      }
    },
    incrementQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.ProductId === id);
      if (existingItem) {
        state.totalAmount += existingItem.Price;
        existingItem.quantity += 1;
        if (existingItem.quantity > 20) {
          existingItem.quantity = 20;
        }
      }
    },
    decrementQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.ProductId === id);
      if (existingItem) {
        state.totalAmount -= existingItem.Price;
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
        } else {
          existingItem.quantity = 1;
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addItem,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
