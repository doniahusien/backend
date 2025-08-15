import { createSelector } from 'reselect';

const selectProductsState = (state) => state.products?.products || [];

export const selectToys = createSelector(
  [selectProductsState],
  (products) => {
    console.log('Selector called', products);
    return products;
  }
);
