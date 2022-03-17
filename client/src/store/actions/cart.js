import * as actionTypes from "./actionTypes";

export const fetchCart = (idUser, token) => {
  return (dispatch) => {
    dispatch(cartWaiting());
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/carts/getcart/${idUser}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch(cartStopLoading());
        dispatch(fetchCartSuccess(result));
      })
      .catch((err) => {
        console.log(err);
        dispatch(cartStopLoading());
      });
  };
};

export const updateCart = (productId, quantity, userId, token) => {
  return (dispatch) => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/carts/updatequantity`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ProductId: productId,
        count: quantity,
        UserId: userId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          dispatch(updateQuantity(productId, quantity));
        }
      })
      .catch((err) => console.log(err));
  };
};

export const addToCart = (productId, quantity, userId, token, notify) => {
  if (!quantity) {
    quantity = 1;
  }
  return (dispatch) => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/carts/AddToCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ProductId: productId,
        count: quantity,
        UserId: userId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          dispatch(fetchCart(userId, token));
        }
      })
      .catch((err) => {
        notify(
          "ERROR OCCUR",
          "Something went wrong :( Please try again.",
          "error"
        );
        console.log(err);
      });
  };
};

const updateQuantity = (productId, quantity) => {
  return {
    type: actionTypes.CART_UPDATE_QUANTITY,
    payload: { productId, quantity },
  };
};

const fetchCartSuccess = (cartInfo) => {
  return {
    type: actionTypes.CART_FETCH_SUCCESS,
    payload: cartInfo,
  };
};

const cartWaiting = () => {
  return {
    type: actionTypes.CART_WAITING,
  };
};

const cartStopLoading = () => {
  return {
    type: actionTypes.CART_STOP_LOADING,
  };
};
