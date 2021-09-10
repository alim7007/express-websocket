import React,{useRef, useEffect} from 'react'
import {RiCameraFill, RiCameraOffFill} from 'react-icons/ri'
import {FaMicrophoneSlash, FaMicrophone} from 'react-icons/fa'

const Video = (props) => {
  const ref = useRef();

  const videoConstraints = {
    minAspectRatio: 1.333,
    minFrameRate: 60,
     facingMode: props.switchCamera ? {exact: 'environment'}:'user' ,
    // height: window.innerHeight / 1.8,g
    // width: window.innerWidth / 2,
  };

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

    return (
        <div id="Camera" className="Camera">
      <h1 className="camera_username">
        {props.userName}
        </h1>
      <video videoConstraints={videoConstraints} className='styled_video' playsInline autoPlay ref={ref} />
      <div className="small_controls">
        <div className="small_icon_components">
          {props.videoFlagTemp ? <RiCameraFill/> : <RiCameraOffFill/>}
        </div>
          &nbsp;&nbsp;&nbsp;
        <div className="small_icon_components">
          {props.audioFlagTemp ? <FaMicrophone/> : <FaMicrophoneSlash/>}
        </div>
      </div>
    </div>
    )
}

export default Video

