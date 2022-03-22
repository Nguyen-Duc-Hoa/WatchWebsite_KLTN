import * as actionTypes from "../actions/actionTypes";

const intialState = {
  address: null,
  name: null,
  phone: null,
  voucherCode: null,
  voucherDiscount: 0
};

const orderReducer = (state = intialState, action) => {
  switch (action.type) {
    case actionTypes.ORDER_SET_INFO:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default orderReducer;
