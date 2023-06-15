import React from 'react';
import "./reply.css"

const Reply = ({ reply }) => {
  return (
    <div className="reply">
    <p className="replyText">{reply.text}</p>
  </div>
  );
};

export default Reply;
