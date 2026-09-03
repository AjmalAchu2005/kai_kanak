import { useEffect, useRef, useState } from "react";
import useHandTracking from "../hooks/useHandTracking";

function Camera({ onHandUpdate, onGestureUpdate }) {
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState("");

  const {
    handPosition,
    handDetected,
    gesture,
  } = useHandTracking(videoRef);

  // Send hand position to App
  useEffect(() => {
    onHandUpdate?.(handPosition);
  }, [handPosition, onHandUpdate]);

  // Send gesture to App
  useEffect(() => {
    onGestureUpdate?.(gesture);
  }, [gesture, onGestureUpdate]);

  // Start camera
  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera error:", error);
        setCameraError("Camera access denied");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="camera-screen">
      {cameraError ? (
        <div className="camera-placeholder">
          <span>⚠</span>
          <small>{cameraError}</small>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          />

          <div className="tracking-status">
            {handDetected
              ? gesture === "FIST"
                ? "✊ FIST"
                : gesture === "OPEN"
                  ? "✋ OPEN HAND"
                  : "✋ HAND DETECTED"
              : "SEARCHING..."}
          </div>
        </>
      )}
    </div>
  );
}

export default Camera;