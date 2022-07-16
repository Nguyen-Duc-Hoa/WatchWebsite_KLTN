import { useState, useEffect } from "react";
import { notify } from "../helper/notify";
import moment from "moment";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../config/firebase";

export const useUpdateProfile = (
  form,
  name,
  address,
  email,
  phone,
  birthday,
  avatar,
  idUser,
  onUpdateInfo
) => {
  const [imageBase64, setImageBase64] = useState("");
  const dateFormat = "YYYY/MM/DD";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setImageBase64(avatar);
    form.setFieldsValue({
      name: (name !== "null" && name) || "",
      address: (address !== "null" && address) || "",
      email: (email !== "null" && email) || "",
      phone: (phone !== "null" && phone) || "",
      birthday:
        (birthday !== "null" &&
          birthday !== null &&
          moment(birthday, dateFormat)) ||
        "",
    });
  }, []);

  const updateAccount = (values) => {
    if (imageBase64.length === 0) {
      notify(
        "CHOOSE AVATAR",
        "Please choose avatar before updating.",
        "warning"
      );
      return;
    }
    setLoading(true);

    if (imageBase64.includes("base64")) {
      const storageRef = ref(storage, idUser + new Date().getTime());
      uploadString(storageRef, imageBase64, "data_url")
        .then((_) => getDownloadURL(storageRef))
        .then((url) =>
          fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/user/`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...values, avatar: url, id: idUser }),
          })
        )
        .then((response) => {
          if (response.ok) {
            notify(
              "UPDATE SUCCESS",
              "You have already update your info.",
              "success"
            );
            setLoading(false);
            return fetch(
              `${process.env.REACT_APP_HOST_DOMAIN}/api/User?id=${idUser}`,
              {
                method: "GET",
              }
            );
          } else {
            throw Error;
          }
        })
        .then((response) => response.json())
        .then((result) => {
          result.Avatar && setImageBase64(result.Avatar);
          onUpdateInfo(result);
        })
        .catch(() => {
          notify(
            "LOAD FAILED",
            "Something went wrong :( Please try again.",
            "error"
          );
          setLoading(false);
        });
    } else {
      fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/user/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, avatar: imageBase64, id: idUser }),
      })
        .then((response) => {
          if (response.ok) {
            notify(
              "UPDATE SUCCESS",
              "You have already update your info.",
              "success"
            );
            setLoading(false);
            return fetch(
              `${process.env.REACT_APP_HOST_DOMAIN}/api/User?id=${idUser}`,
              {
                method: "GET",
              }
            );
          } else {
            throw Error;
          }
        })
        .then((response) => response.json())
        .then((result) => {
          result.Avatar && setImageBase64(result.Avatar);
          onUpdateInfo(result);
        })
        .catch(() => {
          notify(
            "LOAD FAILED",
            "Something went wrong :( Please try again.",
            "error"
          );
          setLoading(false);
        });
    }
  };

  return [updateAccount, loading, imageBase64, setImageBase64];
};
