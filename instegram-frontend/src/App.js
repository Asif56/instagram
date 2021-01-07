import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post'
import { db, auth } from './firebase'
import { Button, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal'
import ImageUploader from './ImageUploader'
// import InstagramEmbed from 'react-instagram-embed'
import axios from './axios';
import Pusher from 'pusher-js'
import FlipMove from "react-flip-move";
import InstagramEmbed  from 'react-instagram-embed'


function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([])
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [openSignIn, setOpenSignIn] = useState(false)



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser)
      } else {
        setUser(null)
      }
    })
    return () => {
      unsubscribe();
    }
  }, [user, username])

  const fetchData= async  ()=>
   await axios.get('/sync').then((response)=>{
     console.log(response);
     setPosts(response.data)
   });

  useEffect(()=>{
    var pusher = new Pusher('fa5ae1cd64a681d2a355', {
      cluster: 'ap2'
    });

    var channel = pusher.subscribe('posts');
    channel.bind('inserted', (data)=> {
      // alert(JSON.stringify(data));
      fetchData();

    });
  },[])

  useEffect(() => {
   fetchData();
  }, []);

  console.log('posts are>>>' ,posts)

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));
    setOpen(false);
  }
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    console.log("sign in")
    setOpenSignIn(false);
  }


  return (
    <div className="app">

      <Modal
        open={open}
        onClose={() => setOpen(false)}

      >
        <div style={modalStyle} className={classes.paper}>
          {/* <h2>i am modal</h2> */}
          <form className="app_signup">
            <center>
              <img className="app_headerimg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/196px-Instagram_logo.svg.png" />
            </center>

            <Input
              placeholder="username"
              value={username}
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              value={email}
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Signup</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img className="app_headerimg" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/196px-Instagram_logo.svg.png" />
            </center>

            {/* <Input
             placeholder="username"
             value={username}
             type="text"
             onChange={(e)=>setUsername(e.target.value)}
             /> */}
            <Input
              placeholder="email"
              value={email}
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signIn}>Sign In</Button>
          </form>

        </div>
      </Modal>
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/1920px-Instagram_logo.svg.png"
        />
        {
          user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
              <div className="app_logoin">
                <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                <Button onClick={() => setOpen(true)}>Sign up</Button>
              </div>

            )
        }
      </div>

      <div className="app_post">
        <div className="app__postLeft">
          <FlipMove>
          {
            posts.map((post) => (
              <Post 
              key={post._id}
               postId={post._id}
                user={user}
                 username={post.user}
                  caption={post.caption}
                   imageUrl={post.image} />
            ))
          }
          </FlipMove>
        </div>
        <div className="app__postRight">
        <InstagramEmbed
        url='https://www.instagram.com/p/Zw9o4/'
        // clientAccessToken='123|456'
        maxWidth={340}
        hideCaption={false}
        containerTagName="div"
        protocol=""
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
/>
        </div>

      </div>




    <div className="app_imageUploader">
    {
        user?.displayName ? (
          <ImageUploader username={user.displayName} />
        ) : (
            <h3>Sorry you do need to login to upload</h3>
          )
      }

    </div>
    
    </div>

  );
}

export default App;
