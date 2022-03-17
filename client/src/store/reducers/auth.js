import * as actionTypes from "../actions/actionTypes";

const initialState = {
  id: null,
  username: null,
  email: null,
  name: null,
  address: null,
  phone: null,
  birthday: null,
  avatar: null,
  roles: [],
  token: null,
  loading: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_WAITING:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.LOGIN_SUCCESS:
      // console.log('old', state.avatar)
      // console.log({...state,
      //   ...action.payload})
      return {
        ...state,
        ...action.payload
      };
    case actionTypes.AUTH_STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.AUTH_LOGOUT:
      return {
        ...state,
        id: null,
        username: null,
        email: null,
        name: null,
        address: null,
        phone: null,
        birthday: null,
        avatar: null,
        roles: [],
        token: null,
        loading: false,
      };
    default:
      return state;
  }
};

export default authReducer;
