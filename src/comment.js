import React, { useState } from 'react';
import Reply from './reply';
import  "./comment.css"

const Comment = ({ comment, onEdit, onReplySubmit }) => {
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState('');
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Handle comment editing
  const handleEdit = () => {
    setEditing(true);
    setNewText(comment.text);
  };

  // Handle comment update
  const handleUpdate = () => {
    if (newText.trim() !== '') {
      onEdit(newText);
      setEditing(false);
    }
  };

  // Handle reply submission
  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim() !== '') {
      onReplySubmit(replyText);
      setReplyText('');
    }
  };

  return (
    <div className="comment">
      <p className="commentText">{comment.text}</p>
      <button className="editButton" onClick={handleEdit}>Edit</button>
      <button className="replyButton" onClick={() => setReplying(!replying)}>Reply</button>
      {editing && (
        <div>
          <textarea
            className="commentInput"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
          <button className="saveButton" onClick={handleUpdate}>Save</button>
        </div>
      )}
      {replying && (
        <form onSubmit={handleReplySubmit}>
          <textarea
            className="commentInput"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
          />
          <button className="addButton" type="submit">Add Reply</button>
        </form>
      )}
      {comment.replies.map((reply, index) => (
        <Reply key={index} reply={reply} />
      ))}
    </div>
  );
};

export default Comment;