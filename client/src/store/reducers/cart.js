import * as actionTypes from "../actions/actionTypes";

const initialState = {
  cart: [],
  loading: false,
  total: 0,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CART_WAITING:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.CART_STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.CART_FETCH_SUCCESS:
      const total = action.payload.reduce((prev, curr) => prev + curr.Price, 0);
      return {
        ...state,
        cart: [...action.payload],
        total: total,
      };
    case actionTypes.CART_UPDATE_QUANTITY:
      let newData = [];
      if (action.payload.quantity === 0) {
        newData = state.cart.filter(
          (ele) => ele.Id !== action.payload.productId
        );
      } else {
        newData = state.cart.map((ele) => {
          if (ele.Id === action.payload.productId) {
            return {
              ...ele,
              Quantity: action.payload.quantity,
              Price: (ele.Price / ele.Quantity) * action.payload.quantity,
            };
          }
          return ele;
        });
      }
      const updateTotal = newData.reduce((prev, curr) => prev + curr.Price, 0);
      return {
        ...state,
        cart: newData,
        total: updateTotal
      };
    default:
      return state;
  }
};

export default cartReducer;
