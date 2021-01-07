import { Avatar } from '@material-ui/core'
import React, { forwardRef, useEffect, useState } from 'react'
import './Post.css'
import { db } from './firebase'
import firebase from 'firebase'

const Post=forwardRef(
    ({ postId,user, username, caption, imageUrl },ref) => {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map(doc => doc.data()));
                });
        }
        return () => {
            unsubscribe();

        }
    }, [postId]);

    const postComment = (e) => {
        e.preventDefault();
        db.collection('posts').doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("")
    }
    return (
        <div className="post"  ref={ref}>

            <div className="post_header">
                <Avatar
                    className="post_avatar"
                    alt=""
                    src="/static/images/avatar/1.jpeg"
                />
                <h3 className="post_username">{username}</h3>
            </div>
            <img
                className="post_image"
                src={imageUrl}
            />
            <h4 className="post_text"><strong>{username} </strong><span className='post_caption'>{caption}</span></h4>

            <div className="post_comment">
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))
                }
            </div>

            {
                user && (
                    <form className="post_commentbox">
                        <input
                            className="post_input"
                            placeholder="please comments"
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            className="post_button"
                            disabled={!comment}
                            type="submit"
                            onClick={postComment}
                        >
                            Post
    </button>
                    </form>
                )
            }


        </div>
    )
}
);


export default Post