import { useRef } from 'react'
import './VideoConference.css'

function VideoConference() {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const startCall = () => {
        console.log('start call')
    }
  return (
    <div className='video-container'>
    <video ref={remoteVideoRef} id="remoteVideo" autoPlay ></video>
    <video ref={localVideoRef} id="localVideo" autoPlay muted ></video>
    <button onClick={startCall}>Start Call</button>
</div>
  )
}

export default VideoConference