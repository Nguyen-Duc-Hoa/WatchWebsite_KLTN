import { notification } from "antd";

export const notify = (message, description, type) => {
  notification[type]({
    message: message,
    description: description,
  });
};
