import { Button,Input } from '@material-ui/core';
import React,{useState} from 'react'
import {storage,db} from './firebase';
import firebase from 'firebase';
import './ImageUploader.css';
import axios from './axios'
// import { set } from 'mongoose';

 function ImageUpload({username}) {
    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [url,setUrl]=useState('');
    const [image, setImage] = useState(null)

    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload=()=>{
        console.log("hand")

       const uploadTask = storage.ref(`images/${image.name}`).put(image);
       console.log("hand")

       uploadTask.on(   
           "state_changed",
           (snapshot)=>{
               const progress=Math.round(
                   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
               );
               setProgress(progress)
           },
           (error)=>{
               console.log(error);
               alert(error.message);
           },
           ()=>{
               storage
               .ref("images")
               .child(image.name)
               .getDownloadURL()
               .then(url =>{
                   setUrl(url); 

                   axios.post('/upload',{
                       caption:caption,
                       user:username,
                       image:url,
                   
                   });
                   db.collection("posts").add({
                       timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                       caption:caption,
                       imageUrl:url,
                       username:username
                   })
                   setImage(null);
                   setProgress(0);
                   setCaption("");
               });
           }
       );
    };

  return (
    <div className="imageupload">
        <progress className="imageupload_progress"  value={progress} max="100"/>
        <Input type="text" value={caption} placeholder="enter here caption" onChange={event=>setCaption(event.target.value)} />
        <Input type="file" onChange={handleChange} />
        <Button  onClick={handleUpload}>
            Upload
        </Button>
      
    </div>
  )
}

export default ImageUpload
