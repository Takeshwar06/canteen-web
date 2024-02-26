import React, { useState, useRef } from 'react';

const Timmer = () => {
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  const requestCameraPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      // Access granted, set the camera stream in the component's state
      setCameraStream(stream);

      // Attach the camera stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      // Handle permission error or other errors
      console.error('Error accessing camera:', error);
    }
  };

  return (
    <div>
      <button onClick={requestCameraPermissions}>Request Camera Permission</button>

      {cameraStream && (
        <div>
          <p>Camera stream is active:</p>
          <video ref={videoRef} autoPlay playsInline muted />
        </div>
      )}
    </div>
  );
};

export default Timmer;
