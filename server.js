const path=require('path');
const http =require('http');
const express =require('express');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users');


const app=express();
const server = http.createServer(app);
const io= socketio(server);
const botName='Bot';
//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));
//Run when client connects
 io.on('connection',socket=>{
  socket.on('joinRoom',({username,room}) => {
    const user=userJoin(socket.id,username,room);

    socket.join(user.room);



    // console.log('New Ws Connection..');
   //Welcome current user
   socket.emit('message',formatMessage(botName,'Welcome to ChatCord'));

   //Broadcast when a user connects 
   socket.broadcast.to(user.room).emit('message',formatMessage(botName,` ${user.username}  has joined the chat`));//tell everyone 
   
   //send users and room info
   io.to(user.room).emit('roomUsers',{
      room:user.room,
      users: getRoomUsers(user.room)
   });
  });
   
    //Runs when client Disconnects 
    socket.on('disconnect',()=>{
      const user=userLeave(socket.id);
      if(user){
      io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
     }
      //send users and room info
      io.to(user.room).emit('roomUsers',{
        room:user.room,
        users: getRoomUsers(user.room)
      });
});

    //Listen for chatMEssage
    socket.on('chatMessage',(msg)=> {
      const user=getCurrentUser(socket.id);
     // console.log(msg);
     io.to(user.room).emit('message',formatMessage(user.username,msg));
    });
 });
const PORT = 3000 || process.env.PORT;

server.listen(PORT,() =>console.log(`Server running on port ${PORT}`));
