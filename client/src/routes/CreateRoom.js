import React,{useState, useContext, useEffect} from "react";
import { v1 as uuid } from "uuid";
import { SocketContext } from "../socketContext/Context";
import './createRoom.css'
import logo from '../images/logo.svg'

const CreateRoom = (props) => {
    const [phone, setPhone] = useState(false)
    const [roomName, setRoomName] = useState('')
      const {name , setName} = useContext(SocketContext)


    function create() {
        const id = uuid();
        if(name !== "" && roomName !== ""){
         props.history.push(`/room/${roomName}=${id}`);
        }
    }

    function join() {
        if(name !== "" && roomName !== ""){
          if(roomName.includes('/room/')){
            let roomSplit = roomName.split("/room/", 3)
            return props.history.push(`/room/${roomSplit[1]}`);
          }else{
            props.history.push(`/room/${roomName}`);
          }
        }
    }

    useEffect(() => {
      if(window.innerWidth < 760){
          setPhone(true)
        }else{
          setPhone(false)
        }
    }, [])

      window.addEventListener('resize',()=>{
        if(window.innerWidth < 760){
          setPhone(true)
        }else{
          setPhone(false)
        }
      })

    return (
      <div className="homepage">
      <div className="starter_form">
        <img className="logoHomepage" src={logo} alt="" />
        <div>
          <input placeholder="Name" className="joinInput" autoComplete="off" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <input placeholder="Room name (join room)" className="joinInput" autoComplete="off" type="text" onChange={(event) => setRoomName(event.target.value)} />
        </div>
        <div className="btn_container">
        <button className="joinBtn" onClick={create}>Create room</button>
        <button className="joinBtn" onClick={join}>Join room</button>
        </div>
        <p className='chat_explenation'>
          1. Create Your own room by just writing your name and click Create Room. <br />
          2. Copy the link to the clipboard by clicking copy button in the chat. <br />
          3. Send the room-link to your friends for them to join you.
        </p>
      {phone ? <div className="adHomepage"></div>:""}
      </div>
      {phone ? "":<div className="adHomepage"></div>}
      </div>
    );
};

export default CreateRoom;
