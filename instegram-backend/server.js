// import mongoose from 'mongoose';
// import express, { Router } from 'express'
// import cors from 'cors';
// import pusher from 'pusher'
const mongoose =require('mongoose');
const express =require('express');
const cors =require('cors');
const Pusher =require('pusher');
const dbModel =require("./dbModel");

// app confirm
const app =express()
const port = process.env.PORT || 8080;
const pusher = new Pusher({
    appId: "1118002",
    key: "fa5ae1cd64a681d2a355",
    secret: "1d4d2e169942f659639a",
    cluster: "ap2",
    useTLS: true,
  });

//MIDDLEWARE
app.use(express.json())
app.use(cors())

// /Router

//Db config
const connection_url='mongodb+srv://admin:B9EGBH6y6NdkxkRZ@cluster0.scazx.mongodb.net/instaDB?retryWrites=true&w=majority'
mongoose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.once('open',()=>{
    console.log("DB connection")

   const changeStream= mongoose.connection.collection('posts').watch()

   changeStream.on('change',(change)=>{
       console.log("change triggring on Pusher")
       console.log(change)
       console.log('end of change')

       if(change.operationType==='insert'){
           console.log('triggering pusher uploading')
          const postDetails = change.fullDocument;
          pusher.trigger('posts','inserted',{
              user:postDetails.user,
              caption:postDetails.caption,
              image:postDetails.image,
          })
       }else{
           console.log("error triggering pusher")
       }
   })
})


app.get('/',(req,res)=>res.status(200).send("hello world"));

app.post('/upload',(req,res)=>{
   const body=req.body;
   dbModel.create(body,(err,data)=>{
       if(err){
           res.status(500).send(err)
       }else{
           res.status(201).send(data);
       }
   })
})
app.get('/sync',(req,res)=>{
  dbModel.find((err,data)=>{
      if(err){
          res.status(500).send(err)
      }else{
          res.status(200).send(data)
      }
  })
})


app.listen(port,()=>console.log("listning on localhost"))

// B9EGBH6y6NdkxkRZ
