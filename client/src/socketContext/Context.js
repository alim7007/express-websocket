import React , {createContext, useState, useRef, useEffect} from 'react'
import { dish } from "../utils/dish";
import io from "socket.io-client";
import Peer from "simple-peer";
// import useLocalStorage from '../hooks/useLocalStorage';
// import { useHistory } from 'react-router-dom';
const SocketContext = createContext();


const ContextProvider = ({ children }) => {
  const [name, setName] = useState("")
  const [peers, setPeers] = useState([]);
  const [audioFlag, setAudioFlag] = useState(true);
  const [videoFlag, setVideoFlag] = useState(true);
  const [userUpdate, setUserUpdate] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageNote, setMessageNote] = useState(false);
  const [messageNoteNum, setMessageNoteNum] = useState(-1);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const dishEl = document.querySelector('#Dish')
  const chatCont = document.querySelector(".chat_messages_container") 
  const [roomID, setRoomID] = useState('')
  const [switchCamera, setSwitchCamera] = useState(false)
  // const videoConstraints = {
  //   minAspectRatio: 1.333,
  //   minFrameRate: 60,
  //    facingMode: switchCamera ? {exact: 'environment'}:'user' ,
  //   // height: window.innerHeight / 1.8,g
  //   // width: window.innerWidth / 2,
  // };
  useEffect(() => {
    socketRef.current = io.connect("/",{ 
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: 99999
}
);
    if(roomID !== ""){
        createStream();
      }
  }, [roomID]);

useEffect(() => {
  console.log(switchCamera)
}, [switchCamera])
  function createStream() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", roomID, name);
        socketRef.current.on("all users", (users) => {
          const peeers = [];
          users.forEach((user) => {
            const peer = createPeer(user.socketID, socketRef.current.id, name, stream);
            peersRef.current.push({
              peerID: user.socketID,
              peerName: user.username,
              peer,
            });
            peeers.push({
              peerID: user.socketID,
              peerName: user.username,
              peer,
            });
            // console.log(peeers)
          });
          setPeers(peeers);
        });
        socketRef.current.on("user joined", (payload) => {
          // console.log("user JOINED",payload)
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peerName: payload.callerName,
            peer,
          });
          if(dishEl) dish(dishEl)
          let peeers = []
          peersRef.current.forEach(peer=>{
            peeers.push(peer)
          })
          setPeers(peeers);
        });
        socketRef.current.on("user left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peersLeft = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peersLeft;
          setPeers(peersLeft);
          if(dishEl) dish(dishEl)
        });

          socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        })

        socketRef.current.on("change", (payload) => {
          setUserUpdate(payload);
        });

        socketRef.current.on("chat_message", (users) => {
          const messages = users[roomID].roomMessage
          setMessages(messages)
          setMessageNote(true)
          chatCont.scrollTop = chatCont.scrollHeight
        });

      });
  }

  useEffect(() => {
          setMessageNoteNum(messageNoteNum + 1)
  }, [messages])
  
  useEffect(()=>{
    console.log(Peer.length)
    if(dishEl) dish(dishEl)
  },[peers])


  function createPeer(userToSignal, callerID, callerName, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        callerName,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });
    peer.signal(incomingSignal);

    return peer;
  }

  const switcher = (switcher) =>{
            if (userVideo.current.srcObject) {
              userVideo.current.srcObject.getTracks().forEach(function (track) {
                if (track.kind === switcher) {
                  if (track.enabled) {
                    if(switcher === "video"){
                      socketRef.current.emit("change", [...userUpdate,{
                      id: socketRef.current.id,
                      videoFlag: false,
                      audioFlag,
                    }]);
                    track.enabled = false;
                    setVideoFlag(false);
                    }else if(switcher === "audio"){
                      socketRef.current.emit("change",[...userUpdate, {
                      id: socketRef.current.id,
                      videoFlag,
                      audioFlag: false,
                    }]);
                    track.enabled = false;
                    setAudioFlag(false);
                    }
                  } else {
                    if(switcher === "video"){
                      socketRef.current.emit("change", [...userUpdate,{
                      id: socketRef.current.id,
                      videoFlag: true,
                      audioFlag,
                    }]);
                    track.enabled = true;
                    setVideoFlag(true);
                    }else if(switcher === "audio"){
                      socketRef.current.emit("change",[...userUpdate, {
                      id: socketRef.current.id,
                      videoFlag,
                      audioFlag: true,
                    }]);
                    track.enabled = true;
                    setAudioFlag(true);
                    }  
                  }
                }
              });
            }
  }


    return (
        <SocketContext.Provider value={
            {name,
             setName,
             roomID,
             setRoomID,
             userVideo,
             socketRef,
             switcher,
             videoFlag,
             audioFlag,
             peers,
             userUpdate,
             messages,
             messageNote,
             messageNoteNum,
             setMessageNoteNum,
             setMessageNote,
             setSwitchCamera,
             switchCamera,
             }}>
            {children}
        </SocketContext.Provider>
    )
}

export {ContextProvider, SocketContext}
