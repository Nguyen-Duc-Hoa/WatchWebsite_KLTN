import * as actionTypes from "../actions/actionTypes";

const initialState = {
  showSidebar: false,
  showOverlay: false,
  showCart: false,
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OPEN_SIDEBAR:
      return {
        ...state,
        showSidebar: true,
      };

    case actionTypes.CLICK_ON_OVERLAY:
      return {
        ...state,
        showSidebar: false,
        showOverlay: false,
        showCart: false,
      };

    case actionTypes.CLOSE_SIDEBAR:
      return {
        ...state,
        showSidebar: false,
      };

    case actionTypes.OPEN_OVERLAY:
      return {
        ...state,
        showOverlay: true,
      };

    case actionTypes.CLOSE_OVERLAY:
      return {
        ...state,
        showOverlay: false,
      };

    case actionTypes.OPEN_CART:
      return {
        ...state,
        showCart: true,
      };

    case actionTypes.CLOSE_CART:
      return {
        ...state,
        showCart: false,
      };

    default:
      return state;
  }
};

export default uiReducer;
