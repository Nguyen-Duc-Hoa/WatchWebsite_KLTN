import * as actionTypes from "../actions/actionTypes";

const initialState = {
  brands: [],
  currentPage: 1,
  totalPage: 1,
  loading: false,
};

const brandReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.BRAND_WAITING:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.BRAND_STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.BRAND_FETCH_SUCCESS:
      const brandsArray = [];
      action.payload.Brands.forEach((brand) => {
        brandsArray.push({
          key: brand.BrandId,
          id: brand.BrandId,
          name: brand.Name,
          image: brand.Image,
        });
      });
      return {
        ...state,
        brands: [...brandsArray],
        totalPage: action.payload.TotalPage,
        currentPage: action.payload.CurrentPage,
      };
    default:
      return state;
  }
};

export default brandReducer;
