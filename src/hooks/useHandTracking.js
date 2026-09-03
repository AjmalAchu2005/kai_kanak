import { useEffect, useRef, useState } from "react";
import {
    FilesetResolver,
    HandLandmarker,
} from "@mediapipe/tasks-vision";

const WASM_PATH =
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm";

const MODEL_PATH =
    "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

function getHandGesture(hand) {
    const wrist = hand[0];

    const indexTip = hand[8];
    const indexPip = hand[6];

    const middleTip = hand[12];
    const middlePip = hand[10];

    const ringTip = hand[16];
    const ringPip = hand[14];

    const pinkyTip = hand[20];
    const pinkyPip = hand[18];

    const fingersCurled =
        indexTip.y > indexPip.y &&
        middleTip.y > middlePip.y &&
        ringTip.y > ringPip.y &&
        pinkyTip.y > pinkyPip.y;

    if (fingersCurled) {
        return "FIST";
    }

    return "OPEN";
}

function useHandTracking(videoRef) {
    const handLandmarkerRef = useRef(null);
    const animationFrameRef = useRef(null);

    const [handPosition, setHandPosition] = useState(null);
    const [handDetected, setHandDetected] = useState(false);
    const [gesture, setGesture] = useState("NONE");

    useEffect(() => {
        let cancelled = false;

        const setupHandTracking = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(WASM_PATH);

                const handLandmarker =
                    await HandLandmarker.createFromOptions(
                        vision,
                        {
                            baseOptions: {
                                modelAssetPath: MODEL_PATH,
                                delegate: "GPU",
                            },
                            runningMode: "VIDEO",
                            numHands: 1,
                        }
                    );

                if (cancelled) {
                    handLandmarker.close();
                    return;
                }

                handLandmarkerRef.current = handLandmarker;

                detectHands();
            } catch (error) {
                console.error(
                    "MediaPipe initialization error:",
                    error
                );
            }
        };

        const detectHands = () => {
            const video = videoRef.current;
            const handLandmarker = handLandmarkerRef.current;

            if (!video || !handLandmarker) {
                animationFrameRef.current =
                    requestAnimationFrame(detectHands);
                return;
            }

            if (video.readyState >= 2) {
                const results = handLandmarker.detectForVideo(
                    video,
                    performance.now()
                );

                if (
                    results.landmarks &&
                    results.landmarks.length > 0
                ) {
                    const hand = results.landmarks[0];

                    // Index finger controls the hand position
                    const indexFinger = hand[8];

                    const currentGesture = getHandGesture(hand);

                    setHandDetected(true);

                    setHandPosition({
                        x: indexFinger.x,
                        y: indexFinger.y,
                    });

                    setGesture(currentGesture);
                } else {
                    setHandDetected(false);
                    setHandPosition(null);
                    setGesture("NONE");
                }
            }

            animationFrameRef.current =
                requestAnimationFrame(detectHands);
        };

        setupHandTracking();

        return () => {
            cancelled = true;

            if (animationFrameRef.current) {
                cancelAnimationFrame(
                    animationFrameRef.current
                );
            }

            if (handLandmarkerRef.current) {
                handLandmarkerRef.current.close();
                handLandmarkerRef.current = null;
            }
        };
    }, [videoRef]);

    return {
        handPosition,
        handDetected,
        gesture,
    };
}

export default useHandTracking;