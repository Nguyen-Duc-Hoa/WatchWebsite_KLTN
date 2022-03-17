import React from "react";
import { Comment, Avatar } from "antd";

function Commenting({
  id,
  avatar,
  author,
  content,
  datetime,
  children,
  actions,
  replyFrom,
  onReply,
}) {
  // https://joeschmoe.io/api/v1/random
  let srcAvatar = null;
  if (avatar !== "null" && avatar !== null) {
    srcAvatar = `data:image/png;base64,${avatar}`;
  } else {
    srcAvatar =
      "https://joeschmoe.io/api/v1/random";
  }
  return (
    <Comment
      actions={
        !actions && [
          <span
            key="comment-nested-reply-to"
            onClick={() => onReply(id, author, replyFrom)}
          >
            Reply to
          </span>,
        ]
      }
      author={author}
      datetime={datetime}
      avatar={
        <Avatar
          src={srcAvatar}
          alt={author}
        />
      }
      content={content}
    >
      {children}
    </Comment>
  );
}

export default Commenting;
