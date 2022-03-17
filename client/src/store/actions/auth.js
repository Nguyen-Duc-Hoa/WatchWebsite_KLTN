import * as actionTypes from "./actionTypes";

export const login = (notify, loginInfo, redirect) => {
  return (dispatch) => {
    dispatch(waiting());
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/Account/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginInfo),
    })
      .then((response) => response.json())
      .then((result) => {
        const expires = new Date(new Date().getTime() + 3600 * 1000);
        const userInfo = {
          id: result.Id,
          username: result.Username,
          email: result.Email,
          name: result.Name,
          address: result.Address,
          phone: result.Phone,
          birthday: result.Birthday,
          avatar: result.Avatar,
          roles: [...result.Role],
          token: result.Token,
        };
        localStorage.setItem("expire", expires);
        localStorage.setItem("name", result.Name);
        localStorage.setItem("token", result.Token);
        localStorage.setItem("idUser", result.Id);
        localStorage.setItem("userName", result.Username);
        localStorage.setItem("email", result.Email);
        localStorage.setItem("address", result.Address);
        localStorage.setItem("phone", result.Phone);
        localStorage.setItem("birthday", result.Birthday);
        localStorage.setItem("avatar", result.Avatar);
        localStorage.setItem("roles", JSON.stringify([...result.Role]));
        dispatch(loginSuccess(userInfo));
        dispatch(stopLoading());
        dispatch(
          checkAuthTimeOut((expires.getTime() - new Date().getTime()) / 1000)
        );
        notify("LOGIN SUCCESS", "Welcome to our store!", "success");
        setTimeout(() => {
          redirect();
        }, 3500);
      })
      .catch(() => {
        dispatch(stopLoading());
        notify("LOGIN FAILED", "Please try again!!!", "error");
      });
  };
};

const loginSuccess = (userInfo) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload: userInfo,
  };
};

const waiting = () => {
  return {
    type: actionTypes.AUTH_WAITING,
  };
};

const checkAuthTimeOut = (expire) => {
  // console.log(expire);
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expire * 1000);
  };
};

export const logout = () => {
  localStorage.removeItem("expire");
  localStorage.removeItem("name");
  localStorage.removeItem("token");
  localStorage.removeItem("idUser");
  localStorage.removeItem("userName");
  localStorage.removeItem("email");
  localStorage.removeItem("address");
  localStorage.removeItem("phone");
  localStorage.removeItem("birthday");
  localStorage.removeItem("avatar");
  localStorage.removeItem("roles");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

const stopLoading = () => {
  return {
    type: actionTypes.AUTH_STOP_LOADING,
  };
};

export const register = (notify, { confirm, ...registerInfo }, history) => {
  return (dispatch) => {
    dispatch(waiting());
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/Account/Register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerInfo),
    })
      .then((response) => {
        if (response.ok) {
          dispatch(stopLoading());
          notify(
            "REGISTER SUCCESS",
            "Let 's log in to go shopping!",
            "success"
          );
          setTimeout(() => {
            history.push("/login");
          }, 3500);
        } else {
          return Promise.reject();
        }
      })
      .catch(() => {
        dispatch(stopLoading());
        notify("REGISTER FAILED", "Please try again!!!", "error");
      });
  };
};

export const reset = (notify, email) => {
  // console.log(email);
  return (dispatch) => {
    dispatch(waiting());
    fetch(
      `${process.env.REACT_APP_HOST_DOMAIN}/api/Account/resetpassword?email=${email}`,
      {
        method: "POST",
      }
    )
      .then((response) => {
        if (response.ok) {
          dispatch(stopLoading());
          notify(
            "RESET SUCCESS",
            "We have already sent email to your email address.",
            "success"
          );
        } else {
          return new Promise.reject();
        }
      })
      .catch(() => {
        dispatch(stopLoading());
        notify(
          "RESET FAILED",
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      // console.log("token null");
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expire"));
      if (expirationDate > new Date()) {
        const userId = localStorage.getItem("idUser");
        const username = localStorage.getItem("userName");
        const email = localStorage.getItem("email");
        const address = localStorage.getItem("address");
        const phone = localStorage.getItem("phone");
        const birthday = localStorage.getItem("birthday");
        const avatar = localStorage.getItem("avatar");
        const roles = localStorage.getItem("roles");
        const name = localStorage.getItem("name");
        dispatch(
          loginSuccess({
            id: userId,
            username: username,
            email: email,
            name: name,
            address: address,
            phone: phone,
            birthday: birthday,
            avatar: avatar,
            roles: JSON.parse(roles),
            token: token,
          })
        );
        dispatch(
          checkAuthTimeOut(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      } else {
        dispatch(logout());
      }
    }
  };
};

export const authUpdateInfo = (userInfo) => {
  // console.log(userInfo)
  return (dispatch) => {
    localStorage.setItem("name", userInfo.Name);
    localStorage.setItem("email", userInfo.Email);
    localStorage.setItem("address", userInfo.Address);
    localStorage.setItem("phone", userInfo.Phone);
    localStorage.setItem("birthday", userInfo.Birthday);
    localStorage.setItem("avatar", userInfo.Avatar);
    // console.log({
    //   name: userInfo.name,
    //   email: userInfo.email,
    //   address: userInfo.address,
    //   phone: userInfo.phone,
    //   birthday: userInfo.birthday,
    //   avatar: userInfo.avatar
    // })
    dispatch(loginSuccess({
      name: userInfo.Name,
      email: userInfo.Email,
      address: userInfo.Address,
      phone: userInfo.Phone,
      birthday: userInfo.Birthday,
      avatar: userInfo.Avatar
    }));
  };
};
