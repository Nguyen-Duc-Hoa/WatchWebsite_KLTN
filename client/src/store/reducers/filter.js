import * as actionTypes from "../actions/actionTypes";

const initalState = {
  sortBy: "bestSelling",
  gender: -1,
  prices: null,
  brands: [],
  search: null
};

const filterReducer = (state = initalState, action) => {
  switch (action.type) {
    case actionTypes.FILTER:
      return {
        ...state,
        ...action.payload
      }
    case actionTypes.FILTER_SET_GENDER:
      return {
        ...state,
        gender: action.payload,
      };
    case actionTypes.FILTER_SET_BRAND:
      return {
        ...state,
        brands: [action.payload],
      };
    case actionTypes.FILTER_RESET:
      return {
        sortBy: "bestSelling",
        gender: -1,
        prices: null,
        brands: [],
        search: null
      };
    case actionTypes.FILTER_SEARCH:
      return {
        ...state,
        search: action.payload
      }
    default:
      return state;
  }
};

export default filterReducer;
