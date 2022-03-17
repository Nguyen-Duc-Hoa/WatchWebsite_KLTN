import * as actionTypes from "./actionTypes";

export const updateBrand = (brandInfo, isAdd, notify, token) => {
  return (dispatch) => {
    dispatch(wating());
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/brands/`, {
      method: isAdd ? "POST" : "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(brandInfo),
    })
      .then((response) => {
        if (response.ok) {
          dispatch(stopLoading());
          notify(
            `${isAdd ? "ADD" : "EDIT"} SUCCESS`,
            `You have already ${isAdd ? "added" : "edited"} a ${
              isAdd && "new"
            } brand!`,
            "success"
          );
        } else {
          return new Promise.reject();
        }
      })
      .catch(() => {
        dispatch(stopLoading());
        notify(
          `${isAdd ? "ADD" : "EDIT"} FAILED`,
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  };
};

export const fetchBrands = (currentPage, notify, token) => {
  return (dispatch) => {
    dispatch(wating());
    fetch(
      `${process.env.REACT_APP_HOST_DOMAIN}/api/brands/GetBrandsWithPagination?currentPage=${currentPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        dispatch(stopLoading());
        dispatch(fetchBrandsSuccess(result));
      })
      .catch(() => {
        dispatch(stopLoading());
        notify(
          "LOAD FAILED",
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  };
};

export const deleteBrands = (deletiveArray, notify, token) => {
  return (dispatch) => {
    dispatch(wating());
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/brands/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(deletiveArray),
    })
      .then((response) => {
        if (response.ok) {
          return fetch(
            `${process.env.REACT_APP_HOST_DOMAIN}/api/brands/GetBrandsWithPagination?currentPage=1`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        else {
          return Promise.reject();
        }
      })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        dispatch(stopLoading());
        dispatch(fetchBrandsSuccess(result));
        notify("DELETE SUCCESS", "You have already deleted brands.", "success");
      })
      .catch(() => {
        dispatch(stopLoading());
        notify(
          "DELETE FAILED",
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  };
};

const fetchBrandsSuccess = (result) => {
  return {
    type: actionTypes.BRAND_FETCH_SUCCESS,
    payload: result,
  };
};

const stopLoading = () => {
  return {
    type: actionTypes.BRAND_STOP_LOADING,
  };
};

const wating = () => {
  return {
    type: actionTypes.BRAND_WAITING,
  };
};

export const fetchAllBrands = () => {
  return (dispatch) => {
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/brands/GetAll`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        if(result) {
          dispatch(fetchBrandsSuccess(result));
        }
        else {
          throw Error
        }
      })
      .catch((err) => {
        console.log("fetch all brands error", err);
      });
  };
};
