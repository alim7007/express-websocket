import React,{useState, useContext} from 'react'
import { SocketContext } from '../socketContext/Context'
import {BiLeftArrow} from 'react-icons/bi'
import {RiMailSendLine} from 'react-icons/ri'

const Chat = ({phone, openChat,setOpenChat, setMessageNote}) => {
    const [chat_text, setChat_text] = useState('')
      const { name, socketRef, messages } = useContext(SocketContext)

    return (
    <div className={phone ?  `${openChat ? 'open_chatContainerPhone' : 'chatContainerPhone'}`:'chatContainer'}>
      <div className="chat_header">
        {phone ?<> 
        <span onClick={()=>{
          setOpenChat(false)
          setMessageNote(false)
        }}><BiLeftArrow/></span>Chat</>
        :""}</div>
        {/* //////////////////////////////// */}
        <div className="adChat"></div>
        {/* /////////  space for AD //////////// */}
      <div className="chat_messages_container">
        {messages.map((message,i)=>(
        <div key={i} className={message.username === name ? "chat_my_message" : "chat_message"}>
          <h4><span>{message.time}</span>&nbsp;&nbsp;&nbsp;{message.username === name ? "Me" : message.username}</h4>
          <p>{message.msg}</p>
          </div>
        ))}
      </div>
      <div className="chat_form">
      <input type="text" className="chat_text" autoComplete="off" value={chat_text} onChange={(e)=>{
        setChat_text(e.target.value)
        }} name="chat_text" id="chat_text" />
        <button className="chat_btn" onClick={()=>{
          if(chat_text !== ""){
          socketRef.current.emit("chat", {chat_text, name})
          setChat_text('')
          }
        }}><RiMailSendLine/></button>
      </div>
    </div>
    )
}

export default Chat
