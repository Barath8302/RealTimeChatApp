const chatForm = document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

const socket=io();

//get Username and room from URL
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});
//Join Chatroom
socket.emit('joinRoom',{username,room});

//get room and users
 socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
 });


//Message from server 
socket.on('message',(message) =>{
    console.log(message);
    outputMessage(message);

    //Scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
});

//Message Submit 
chatForm.addEventListener('submit',e =>{
    e.preventDefault();

    //Get message text
    const msg=e.target.elements.msg.value;
    //console.log(msg);

    //Emit message to server
    socket.emit('chatMessage',msg);

    //clear input
    e.target.elements.msg.value='';
});

//Output message to DOM
function outputMessage(message) {
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
     ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to DOM 
function outputRoomName(room){
    roomName.innerText=room;

}
//add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }

  //Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });