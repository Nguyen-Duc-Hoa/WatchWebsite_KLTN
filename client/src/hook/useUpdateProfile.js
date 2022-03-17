import { useState, useEffect } from "react";
import { notify } from "../helper/notify";
import { convertToByteArray } from "../helper/convertToByteArray";
import moment from "moment";

export const useUpdateProfile = (
  form,
  name,
  address,
  email,
  phone,
  birthday,
  avatar,
  idUser,
  onUpdateInfo,
) => {
  const [imageBase64, setImageBase64] = useState("");
  const [imageByteArray, setImageByteArray] = useState([]);
  const dateFormat = "YYYY/MM/DD";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setImageBase64(`data:image/png;base64,${avatar}`);
    setImageByteArray(convertToByteArray(avatar));
    form.setFieldsValue({
      name: (name !== "null" && name) || "",
      address: (address !== "null" && address) || "",
      email: (email !== "null" && email) || "",
      phone: (phone !== "null" && phone) || "",
      birthday: (birthday !== "null" && birthday !== null && moment(birthday, dateFormat)) || "",
    });
  }, []);

  const updateAccount = (values) => {
    if (imageByteArray.length === 0) {
      notify(
        "CHOOSE AVATAR",
        "Please choose avatar before updating.",
        "warning"
      );
      return;
    }
    setLoading(true);
    fetch(`${process.env.REACT_APP_HOST_DOMAIN}/api/user/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, avatar: imageByteArray, id: idUser }),
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
        result.Avatar &&
          setImageBase64(`data:image/png;base64,${result.Avatar}`);
        result.Avatar && setImageByteArray(convertToByteArray(result.Avatar));
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
  };

  return [
    updateAccount,
    loading,
    imageBase64,
    setImageBase64,
    setImageByteArray,
  ];
};
