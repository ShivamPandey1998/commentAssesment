import React, { useState, useEffect } from 'react';
import Comment from './comment';
import  styles from "./box.css";

const CommentBox = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Load comments from local storage on initial render
  useEffect(() => {
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, []);

  // Save comments to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  // Handle new comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      setComments([...comments, { text: newComment, replies: [] }]);
      setNewComment('');
    }
  };

  // Handle comment editing
  const handleCommentEdit = (index, newText) => {
    const updatedComments = [...comments];
    updatedComments[index].text = newText;
    setComments(updatedComments);
  };

  // Handle reply submission
  const handleReplySubmit = (commentIndex, text) => {
    const updatedComments = [...comments];
    updatedComments[commentIndex].replies.push({ text });
    setComments(updatedComments);
  };

  return (
    <div className = "commentBox">
      <form onSubmit={handleCommentSubmit}>
        <textarea
          className="commentInput"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button className="addButton" type="submit">Add Comment</button>
      </form>
      {comments.map((comment, index) => (
        <Comment
          key={index}
          comment={comment}
          onEdit={(newText) => handleCommentEdit(index, newText)}
          onReplySubmit={(text) => handleReplySubmit(index, text)}
        />
      ))}
    </div>
  );
};

export default CommentBox;
