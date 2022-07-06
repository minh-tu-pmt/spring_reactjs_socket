import React, { useState } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;
function ChatRoom() {
  const [publicChat, setPublicChat] = useState([])
  const [privateChat, setPrivateChat] = useState(new Map());
  const [userData, setUserData] = useState({
    username: "",
    receiverName: "",
    connected: false,
    message: "",
  })
  console.log("chat rooom");
  const [tab, setTab] = useState("CHATROOM");

  const handleChange = (e) => {
    const { value } = e.target;
    setUserData({ ...userData, username: value });
  }

  const handleMessage = (e) => {
    const { value } = e.target;
    setUserData({ ...userData, message: value });
  }

  const registerUser = () => {
    let sock = new SockJS("http://192.168.1.20:8080/ws");
    stompClient = over(sock);
    stompClient.connect({}, onConnected, onError)
  }

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onPublicMessageReceivered)
    stompClient.subscribe("/user/"+userData.username+"/private",onPrivateMessageReceivered)
    userJoin();
  }
  const onError = (err) => {
    console.log(err)
  }

  const userJoin = () => {
    const chatMessage = {
      senderName: userData.username,
      status: 'JOIN',
    }
    stompClient.send('/app/message', {}, JSON.stringify(chatMessage))
  }

  const onPublicMessageReceivered = (payload) => {
    const payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChat.get(payloadData.senderName)) {
          privateChat.set(payloadData.senderName, []) 
          setPrivateChat(new Map(privateChat))
        }
        break;
      case "MESSAGE":
        publicChat.push(payload)
        setPublicChat([...publicChat])
        break;
      case "LEAVE":
        
        break;
    
      default:
        break;
    }
  }

  const onPrivateMessageReceivered = (payload) => {
    const payloadData = JSON.parse(payload.body);
    if (privateChat.get(payloadData.senderName)) {
      privateChat.get(payloadData.senderName).push(payloadData)
      setPrivateChat( new Map(privateChat))
    }
    else {
      const list = [];
      list.push(payloadData)
      privateChat.set(payloadData.senderName, list);
      setPrivateChat(new Map(privateChat));
    }
  }

  const sendPublicMessage = () => {
    if (stompClient) {
      const chatMessage = {
        senderName: userData.username,
        message: userData.message,
        status: 'MESSAGE',
      }
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage))
      setUserData({...userData, message: ""});
    }
  }

  const sendPrivateMessage = () => {
    if (stompClient) {
      const chatMessage = {
        senderName: userData.username,
        receiverName: tab,
        message: userData.message,
        status: 'MESSAGE',
      }
      if (userData.username !== tab) {
        privateChat.get(tab).push(chatMessage)
        setPrivateChat(new Map(privateChat));
      }
      stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage))
      setUserData({...userData, message: ""});
    }
  }

  return (
    <div className='container'>
      {userData.connected ? 
        <div className='chat-box'>
          <div className='member-list'>
            <ul>
              <li onClick={()=> setTab("CHATROOM")} className={`member ${tab==="CHATROOM" && "active"}`}>Chatroom</li>
              {[...privateChat.keys()].map((name, index) => (
                <li className={`member ${tab===name && "active"}`} key={index} onClick={()=> setTab(name)}> {name} </li>
              ))}
            </ul>
          </div>
          {tab === "CHATROOM" && <div className='chat-content'>
            <ul className='chat-messages'>
              {publicChat.map((chat, index) => (
                <li className='message' key={index}>
                  {chat.senderName !== userData.username && <div className='avatar'>{chat.senderName}</div>}
                  <div className='message-data'>{chat.message}</div>
                  {chat.senderName === userData.username && <div className='avatar self'>{chat.senderName}</div>}
                </li>
              ))}
            </ul>
            <div className='send-messages'>
              <input type='text' className='input-message' placeholder='enter message ...' value={userData.message} onChange={handleMessage}></input>
              <button type='button' className='send-button' onClick={sendPublicMessage}>Send</button>
            </div>
          </div>}
          {tab !== "CHATROOM" && <div className='chat-content'>
            <ul className='chat-messages'>
                {[...privateChat.get(tab)].map((chat, index) => (
                  <li className='message' key={index}>
                    {chat.senderName !== userData.username && <div className='avatar'>{chat.senderName}</div>}
                    <div className='message-data'>{chat.message}</div>
                    {chat.senderName === userData.username && <div className='avatar self'>{chat.senderName}</div>}
                  </li>
                ))}
            </ul>
            <div className='send-messages'>
              <input type='text' className='input-message' placeholder='enter private message ...' value={userData.message} onChange={handleMessage}></input>
              <button type='button' className='send-button' onClick={sendPrivateMessage}>Send</button>
            </div>
          </div>}
        </div> :
        <div className='register'>
          <input id="username" value={userData.username} onChange={handleChange}></input>
          <button type='button' onClick={registerUser}>Register</button>
        </div>
      }
    </div>
  )
}

export default ChatRoom;