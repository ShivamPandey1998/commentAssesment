import React, { useState, useEffect } from 'react';
import './box.css';

const CommentBox = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const storedComments = JSON.parse(localStorage.getItem('comments'));
    if (storedComments) {
      setComments(storedComments);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (comment.trim() !== '') {
      const newComment = {
        id: Date.now(),
        text: comment,
        level: 1,
        replies: [],
      };
      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = comments.filter((comment) => comment.id !== commentId);
    setComments(updatedComments);
  };

  const handleReplyComment = (commentId, level) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          showReplyBox: true,
          replyLevel: level + 1,
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const handleReplyChange = (event, commentId) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replyText: event.target.value,
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const handleReplySubmit = (event, commentId, level) => {
    event.preventDefault();
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const newReply = {
          id: Date.now(),
          text: comment.replyText.trim(),
          level: level + 1,
          replies: [],
        };
        return {
          ...comment,
          replies: [...comment.replies, newReply],
          replyText: '',
          showReplyBox: false,
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const handleDeleteReply = (commentId, replyId) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const updatedReplies = comment.replies.filter((reply) => reply.id !== replyId);
        return {
          ...comment,
          replies: updatedReplies,
        };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const renderReplies = (replies, level, commentId) => {
    return (
      <div className={`comment-reply-level-${level}`}>
        {replies.map((reply) => (
          <div key={reply.id} className={`comment-reply comment-reply-level-${reply.level}`}>
            <p className="comment-reply-text">{reply.text}</p>
            <div className="comment-actions">
              <button
                onClick={() => handleDeleteReply(commentId, reply.id)}
                className={`comment-delete-btn ${reply.level === 1 ? 'parent-comment' : 'child-comment'}`}
              >
                Delete
              </button>
              <button
                onClick={() => handleReplyComment(commentId, reply.level)}
                className={`comment-reply-btn ${reply.level === 1 ? 'parent-comment' : 'child-comment'}`}
              >
                Reply
              </button>
            </div>
            {reply.showReplyBox && (
              <form onSubmit={(event) => handleReplySubmit(event, commentId, reply.level)}>
                <input
                  type="text"
                  value={reply.replyText}
                  onChange={(event) => handleReplyChange(event, commentId)}
                  className="reply-input"
                  placeholder="Write a reply..."
                />
                <button type="submit" className="reply-submit-btn">
                  Post
                </button>
              </form>
            )}
            {reply.replies && renderReplies(reply.replies, reply.level + 1, commentId)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="comment-box">
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={handleCommentChange}
          className="comment-input"
          placeholder="Write a comment..."
        />
        <button type="submit" className="comment-btn">
          Add Comment
        </button>
      </form>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <p className="comment-text">{comment.text}</p>
          <div className="comment-actions">
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className={`comment-delete-btn ${comment.level === 1 ? 'parent-comment' : 'child-comment'}`}
            >
              Delete
            </button>
            <button
              onClick={() => handleReplyComment(comment.id, comment.level)}
              className={`comment-reply-btn ${comment.level === 1 ? 'parent-comment' : 'child-comment'}`}
            >
              Reply
            </button>
          </div>
          {comment.showReplyBox && (
            <form onSubmit={(event) => handleReplySubmit(event, comment.id, comment.level)}>
              <input
                type="text"
                value={comment.replyText}
                onChange={(event) => handleReplyChange(event, comment.id)}
                className="reply-input"
                placeholder="Write a reply..."
              />
              <button type="submit" className="reply-submit-btn">
                Reply
              </button>
            </form>
          )}
          {comment.replies && renderReplies(comment.replies, comment.level + 1, comment.id)}
        </div>
      ))}
    </div>
  );
};

export default CommentBox;
