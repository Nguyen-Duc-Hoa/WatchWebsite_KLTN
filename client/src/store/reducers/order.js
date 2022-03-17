import * as actionTypes from "../actions/actionTypes";

const intialState = {
  address: null,
  name: null,
  phone: null,
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
