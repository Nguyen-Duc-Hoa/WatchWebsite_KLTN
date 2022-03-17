import { useEffect, useState, useRef } from "react";
import { useForceUpdate } from "./useForceUpdate";
import { notify } from "../helper/notify";

export const useFetchData = (route, setEditingKey, updateData, token) => {
  const [data, setData] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [shouldUpdate, forceUpdate] = useForceUpdate();
  const deletiveArray = useRef([]);

  useEffect(() => {
    fetchData();
  }, [currentPage, shouldUpdate, searchKey]);

  const fetchData = () => {
    setSpinning(true);
    fetch(`${route.get}?currentPage=${currentPage}&searchKey=${searchKey}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        const dataArray = updateData(result);
        setData(dataArray);
        setTotalPage(result.TotalPage);
        setSpinning(false);
      })
      .catch(() => {
        setSpinning(false);
        notify(
          "LOAD FAILED",
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  };

  const updateReq = (type, objData, update) => {
    setLoading(true);
    fetch(route.post, {
      method: type,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(objData),
    })
      .then((response) => {
        if (response.ok && type === "POST") {
          notify(
            `${type === "POST" ? "ADD" : "EDIT"} SUCCESS`,
            `You have already ${type === "POST" ? "added" : "edited"} a ${
              type === "POST" && "new"
            } item.`,
            "success"
          );
          setLoading(false);
          forceUpdate();
        } else if (response.ok && type === "PUT") {
          const updateData = update();
          setData(updateData);
          setEditingKey && setEditingKey("");
          setLoading(false);
        } else {
          return new Promise.reject();
        }
      })
      .catch(() => {
        setLoading(false);
        notify(
          `${type === "POST" ? "ADD" : "EDIT"} FAILED`,
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  };

  const deleteReq = () => {
    setSpinning(true);
    fetch(route.delete, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deletiveArray.current),
    })
      .then((response) => {
        if (response.ok) {
          notify(
            "DELETE SUCCESS",
            "You have already deleted item(s).",
            "success"
          );
          setSpinning(false);
          setCurrentPage(1);
          forceUpdate();
        } else {
          return Promise.reject();
        }
      })
      .catch(() => {
        setSpinning(false);
        notify(
          "DELETE FAILED",
          "Something went wrong :( Please try again.",
          "error"
        );
      });
  };

  return {
    data,
    currentPage,
    setCurrentPage,
    totalPage,
    loading,
    spinning,
    updateReq,
    deleteReq,
    deletiveArray,
    searchKey,
    setSearchKey,
    forceUpdate,
  };
};
