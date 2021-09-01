import React, { useEffect, useRef, useState, useContext } from "react";
import {useHistory} from 'react-router-dom'
import {RiCameraFill, RiCameraOffFill, RiFileCopy2Fill, RiWechat2Fill} from 'react-icons/ri'
import {FaMicrophoneSlash, FaMicrophone} from 'react-icons/fa'
import {FcEndCall} from 'react-icons/fc'
// import { v1 as uuid } from "uuid";
import { SocketContext } from "../socketContext/Context";
import Chat from "../components/Chat";
import Video from "../components/Video";
import logo from '../images/logo.svg'

const Room = (props) => {
  const history = useHistory()
  const [phone, setPhone] = useState(false)
  const [alertLinkCopy, setAlertLinkCopy] = useState(false)
  const [openChat, setOpenChat] = useState(false)
  const { roomID, setRoomID, userVideo, switcher, videoFlag, audioFlag, peers, userUpdate, socketRef, messages, setMessageNote, messageNote } = useContext(SocketContext)

    useEffect(()=>{
      setRoomID(props.match.params.roomID)
      if(window.innerWidth < 760){
          setPhone(true)
        }else{
          setPhone(false)
        }
    },[])

    window.addEventListener('resize',()=>{
        if(window.innerWidth < 760){
          setPhone(true)
        }else{
          setPhone(false)
        }
      })

      useEffect(() => {
        console.log(phone)
      }, [phone])

      window.addEventListener('load',()=>{
      history.push('/')
      window.location.reload()
    })

    const alertLink = () =>{
      setAlertLinkCopy(true)
    }

    useEffect(() => {
      if(alertLinkCopy === true){
        setTimeout(()=>{setAlertLinkCopy(false)},3000)
      }
    }, [alertLinkCopy])

  return (
    <>
    <div className={openChat ? "videoAndControlsNone" : "videoAndControls"}>
      <div className="title">
        <img src={logo} style={{width:'50px', height:'50px'}} alt="" />
          &nbsp;
         Video Chat
      </div>
      <div id="Dish" className='Dish'>
      <div  id="Camera" className="Camera">
          <h1 className="camera_username">
        Me
        </h1>
        <video className='styled_video' muted ref={userVideo} autoPlay playsInline />
        
      </div>
      {/* <div  id="Camera" className="Camera"></div>
      <div  id="Camera" className="Camera"></div>
      <div  id="Camera" className="Camera"></div>
      <div  id="Camera" className="Camera"></div>
      <div  id="Camera" className="Camera"></div> */}
      {peers.map((peer, index) => {
        let audioFlagTemp = true;
        let videoFlagTemp = true;
        if (userUpdate) {
          userUpdate.forEach((entry) => {
            if (peer && peer.peerID && peer.peerID === entry.id) {
              audioFlagTemp = entry.audioFlag;
              videoFlagTemp = entry.videoFlag;
            }
          });
        }
        return (
            <Video key={peer.peerID} userName={peer.peerName} audioFlagTemp={audioFlagTemp} videoFlagTemp={videoFlagTemp} peer={peer.peer}/>
        );
      })}
    </div>
    {alertLinkCopy ? <div className="alertLinkCopy">Link copied</div> :""}
    <div className="controls">
          <div className="icon_components" onClick={()=>{
             navigator.clipboard.writeText(roomID)
             alertLink()
          }}>
            <RiFileCopy2Fill/>
          </div>
          {phone ? 
          <>
          <div className={messageNote ? "icon_components noted" :"icon_components"} onClick={()=>{
            setMessageNote(false)
            setOpenChat(true)
            }}>
              {messageNote ? <p className="messagesNum">{messages.length}</p>:""}
            <RiWechat2Fill/>
          </div>
          </> : ""
          }
          <div className="icon_components" onClick={()=>{switcher("video")}}>
            {videoFlag ? <RiCameraFill/> : <RiCameraOffFill/>}
          </div>
          {/* &nbsp;&nbsp;&nbsp; */}
          <div className="icon_components" onClick={()=>{switcher("audio")}}>
            {audioFlag ? <FaMicrophone/> : <FaMicrophoneSlash/>}
          </div>
          <div className="icon_components" onClick={()=>{
            history.push('/')
            window.location.reload()
          }}>
            <FcEndCall style={{fontSize:'20px'}}/>
          </div>
        </div>
    </div>
      <Chat phone={phone} openChat={openChat} setOpenChat={setOpenChat} setMessageNote={setMessageNote}/>
    </>
  );
};

export default Room;

