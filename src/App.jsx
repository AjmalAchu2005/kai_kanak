import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import Camera from "./components/Camera";

// ==================================================
// CONSTANTS
// ==================================================

const BUBBLE_SIZE = 70;
const BUBBLE_RADIUS = BUBBLE_SIZE / 2;
const WALL_PADDING = 4;

const INITIAL_OBJECTS = [
  // Numbers: 0 - 9
  { id: 1, value: "0", type: "number", x: 10, y: 20 },
  { id: 2, value: "1", type: "number", x: 30, y: 20 },
  { id: 3, value: "2", type: "number", x: 50, y: 20 },
  { id: 4, value: "3", type: "number", x: 70, y: 20 },
  { id: 5, value: "4", type: "number", x: 90, y: 20 },

  { id: 6, value: "5", type: "number", x: 10, y: 70 },
  { id: 7, value: "6", type: "number", x: 30, y: 70 },
  { id: 8, value: "7", type: "number", x: 50, y: 70 },
  { id: 9, value: "8", type: "number", x: 70, y: 70 },
  { id: 10, value: "9", type: "number", x: 90, y: 70 },

  // Operators
  { id: 11, value: "+", type: "operator", x: 20, y: 45 },
  { id: 12, value: "-", type: "operator", x: 40, y: 45 },
  { id: 13, value: "×", type: "operator", x: 60, y: 45 },
  { id: 14, value: "÷", type: "operator", x: 80, y: 45 },

  // Equals
  { id: 15, value: "=", type: "equals", x: 50, y: 50 },
];

// ==================================================
// CALCULATOR
// ==================================================

function calculateExpression(expression) {
  if (!expression) return null;

  const normalized = expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/\s+/g, "");

  if (!/^[0-9+\-*/.]+$/.test(normalized)) {
    return null;
  }

  const tokens = normalized.match(/(\d*\.?\d+|[+\-*/])/g);

  if (!tokens || tokens.length === 0) {
    return null;
  }

  if (tokens.join("") !== normalized) {
    return null;
  }

  const numbers = [];
  const operators = [];

  let expectingNumber = true;

  for (const token of tokens) {
    if (!isNaN(token)) {
      numbers.push(Number(token));
      expectingNumber = false;
    } else {
      if (expectingNumber) {
        return null;
      }

      operators.push(token);
      expectingNumber = true;
    }
  }

  if (expectingNumber) {
    return null;
  }

  // ----------------------------------------------
  // Multiplication / Division
  // ----------------------------------------------

  const reducedNumbers = [numbers[0]];
  const reducedOperators = [];

  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i];
    const nextNumber = numbers[i + 1];

    if (operator === "*") {
      const previous = reducedNumbers.pop();
      reducedNumbers.push(previous * nextNumber);
    } else if (operator === "/") {
      if (nextNumber === 0) {
        return null;
      }

      const previous = reducedNumbers.pop();
      reducedNumbers.push(previous / nextNumber);
    } else {
      reducedOperators.push(operator);
      reducedNumbers.push(nextNumber);
    }
  }

  // ----------------------------------------------
  // Addition / Subtraction
  // ----------------------------------------------

  let result = reducedNumbers[0];

  for (let i = 0; i < reducedOperators.length; i++) {
    if (reducedOperators[i] === "+") {
      result += reducedNumbers[i + 1];
    } else if (reducedOperators[i] === "-") {
      result -= reducedNumbers[i + 1];
    }
  }

  return Number.isFinite(result) ? result : null;
}

// ==================================================
// APP
// ==================================================

function App() {
  // ------------------------------------------------
  // REFS
  // ------------------------------------------------

  const worldRef = useRef(null);

  const bubblePositionsRef = useRef([]);
  const caughtIdsRef = useRef(new Set());

  const previousGestureRef = useRef("NONE");
  const animationFrameRef = useRef(null);

  // ------------------------------------------------
  // STATE
  // ------------------------------------------------

  const [handPosition, setHandPosition] = useState(null);
  const [handDetected, setHandDetected] = useState(false);
  const [gesture, setGesture] = useState("NONE");

  const [bubblePositions, setBubblePositions] = useState([]);

  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);

  const [caughtIds, setCaughtIds] = useState(new Set());

  // ==================================================
  // BUBBLE INITIALIZATION
  // ==================================================

  const initializeBubbles = useCallback(() => {
    const world = worldRef.current;

    if (!world) return;

    const width = world.clientWidth;
    const height = world.clientHeight;

    const MIN_X = BUBBLE_RADIUS + WALL_PADDING;
    const MAX_X = width - BUBBLE_RADIUS - WALL_PADDING;

    const MIN_Y = BUBBLE_RADIUS + WALL_PADDING;
    const MAX_Y = height - BUBBLE_RADIUS - WALL_PADDING;

    const bubbles = INITIAL_OBJECTS.map((object, index) => {
      const x = Math.max(
        MIN_X,
        Math.min(MAX_X, (object.x / 100) * width)
      );

      const y = Math.max(
        MIN_Y,
        Math.min(MAX_Y, (object.y / 100) * height)
      );

      // Different direction for each bubble.
      const angle =
        ((index * 47) % 360) * (Math.PI / 180);

      // Moderate speed.
      const speed = 1.3 + (index % 3) * 0.35;

      return {
        ...object,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      };
    });

    bubblePositionsRef.current = bubbles;
    setBubblePositions(bubbles);
  }, []);

  // ==================================================
  // HAND TRACKING
  // ==================================================

  const handleHandUpdate = useCallback((position) => {
    if (!position) {
      setHandPosition(null);
      setHandDetected(false);
      return;
    }

    setHandPosition(position);
    setHandDetected(true);

    // Hand movement does NOT affect bubbles.
  }, []);

  // ==================================================
  // CATCH BUBBLE WITH FIST
  // ==================================================

  const catchBubble = useCallback(() => {
    if (!handPosition || !worldRef.current) {
      return;
    }

    const world = worldRef.current;

    const width = world.clientWidth;
    const height = world.clientHeight;

    // Inverted cursor.
    const cursorX = handPosition.x * width;
    const cursorY = (1 - handPosition.y) * height;

    const catchRadius = 55;

    let closestBubble = null;
    let closestDistance = Infinity;

    for (const bubble of bubblePositionsRef.current) {
      if (caughtIdsRef.current.has(bubble.id)) {
        continue;
      }

      const dx = bubble.x - cursorX;
      const dy = bubble.y - cursorY;

      const distance = Math.sqrt(
        dx * dx + dy * dy
      );

      if (
        distance <= catchRadius &&
        distance < closestDistance
      ) {
        closestBubble = bubble;
        closestDistance = distance;
      }
    }

    if (!closestBubble) {
      return;
    }

    caughtIdsRef.current.add(closestBubble.id);

    setCaughtIds(new Set(caughtIdsRef.current));

    // ----------------------------------------------
    // Equals
    // ----------------------------------------------

    if (closestBubble.type === "equals") {
      const calculated =
        calculateExpression(expression);

      if (calculated === null) {
        setResult("ERROR");
      } else {
        setResult(calculated);
      }

      return;
    }

    // ----------------------------------------------
    // Number / Operator
    // ----------------------------------------------

    setExpression(
      (previous) =>
        previous + closestBubble.value
    );

    setResult(null);
  }, [handPosition, expression]);

  // ==================================================
  // GESTURE UPDATE
  // ==================================================

  const handleGestureUpdate = useCallback(
    (newGesture) => {
      setGesture(newGesture);

      // Catch only when fist starts.
      if (
        newGesture === "FIST" &&
        previousGestureRef.current !== "FIST"
      ) {
        catchBubble();
      }

      previousGestureRef.current = newGesture;
    },
    [catchBubble]
  );

  // ==================================================
  // BUBBLE PHYSICS
  // ==================================================

  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = (currentTime) => {
      const world = worldRef.current;

      if (!world) {
        animationFrameRef.current =
          requestAnimationFrame(updatePhysics);

        return;
      }

      // IMPORTANT:
      // We now measure the actual .world element.
      const width = world.clientWidth;
      const height = world.clientHeight;

      // ----------------------------------------------
      // STRICT BOUNDARY
      // ----------------------------------------------

      const MIN_X =
        BUBBLE_RADIUS + WALL_PADDING;

      const MAX_X =
        width - BUBBLE_RADIUS - WALL_PADDING;

      const MIN_Y =
        BUBBLE_RADIUS + WALL_PADDING;

      const MAX_Y =
        height - BUBBLE_RADIUS - WALL_PADDING;

      // ----------------------------------------------
      // Frame timing
      // ----------------------------------------------

      const deltaTime = Math.min(
        (currentTime - lastTime) / 16.67,
        2
      );

      lastTime = currentTime;

      // Copy current bubbles.
      const bubbles =
        bubblePositionsRef.current.map(
          (bubble) => ({
            ...bubble,
          })
        );

      // ==================================================
      // MOVE BUBBLES
      // ==================================================

      for (const bubble of bubbles) {
        if (
          caughtIdsRef.current.has(
            bubble.id
          )
        ) {
          continue;
        }

        bubble.x +=
          bubble.vx * deltaTime;

        bubble.y +=
          bubble.vy * deltaTime;

        // ----------------------------------------------
        // LEFT WALL
        // ----------------------------------------------

        if (bubble.x < MIN_X) {
          bubble.x = MIN_X;
          bubble.vx =
            Math.abs(bubble.vx);
        }

        // ----------------------------------------------
        // RIGHT WALL
        // ----------------------------------------------

        if (bubble.x > MAX_X) {
          bubble.x = MAX_X;
          bubble.vx =
            -Math.abs(bubble.vx);
        }

        // ----------------------------------------------
        // TOP WALL
        // ----------------------------------------------

        if (bubble.y < MIN_Y) {
          bubble.y = MIN_Y;
          bubble.vy =
            Math.abs(bubble.vy);
        }

        // ----------------------------------------------
        // BOTTOM WALL
        // ----------------------------------------------

        if (bubble.y > MAX_Y) {
          bubble.y = MAX_Y;
          bubble.vy =
            -Math.abs(bubble.vy);
        }
      }

      // ==================================================
      // BUBBLE ↔ BUBBLE COLLISION
      // ==================================================

      for (let i = 0; i < bubbles.length; i++) {
        for (
          let j = i + 1;
          j < bubbles.length;
          j++
        ) {
          const a = bubbles[i];
          const b = bubbles[j];

          if (
            caughtIdsRef.current.has(a.id) ||
            caughtIdsRef.current.has(b.id)
          ) {
            continue;
          }

          const dx = b.x - a.x;
          const dy = b.y - a.y;

          const distance = Math.sqrt(
            dx * dx + dy * dy
          );

          const minimumDistance =
            BUBBLE_RADIUS * 2;

          if (
            distance > 0 &&
            distance < minimumDistance
          ) {
            // ------------------------------------------
            // Collision normal
            // ------------------------------------------

            const nx = dx / distance;
            const ny = dy / distance;

            // ------------------------------------------
            // Separate bubbles
            // ------------------------------------------

            const overlap =
              minimumDistance - distance;

            a.x -=
              nx * (overlap / 2);

            a.y -=
              ny * (overlap / 2);

            b.x +=
              nx * (overlap / 2);

            b.y +=
              ny * (overlap / 2);

            // ------------------------------------------
            // Relative velocity
            // ------------------------------------------

            const relativeVelocityX =
              b.vx - a.vx;

            const relativeVelocityY =
              b.vy - a.vy;

            const velocityAlongNormal =
              relativeVelocityX * nx +
              relativeVelocityY * ny;

            // Already moving apart.
            if (
              velocityAlongNormal > 0
            ) {
              continue;
            }

            // ------------------------------------------
            // Elastic collision
            // ------------------------------------------

            const impulse =
              -velocityAlongNormal;

            a.vx -=
              impulse * nx;

            a.vy -=
              impulse * ny;

            b.vx +=
              impulse * nx;

            b.vy +=
              impulse * ny;
          }
        }
      }

      // ==================================================
      // FINAL STRICT BOUNDARY CLAMP
      // ==================================================

      for (const bubble of bubbles) {
        if (bubble.x < MIN_X) {
          bubble.x = MIN_X;
          bubble.vx =
            Math.abs(bubble.vx);
        }

        if (bubble.x > MAX_X) {
          bubble.x = MAX_X;
          bubble.vx =
            -Math.abs(bubble.vx);
        }

        if (bubble.y < MIN_Y) {
          bubble.y = MIN_Y;
          bubble.vy =
            Math.abs(bubble.vy);
        }

        if (bubble.y > MAX_Y) {
          bubble.y = MAX_Y;
          bubble.vy =
            -Math.abs(bubble.vy);
        }
      }

      // ==================================================
      // KEEP SPEED MODERATE
      // ==================================================

      for (const bubble of bubbles) {
        const speed = Math.sqrt(
          bubble.vx * bubble.vx +
          bubble.vy * bubble.vy
        );

        const maxSpeed = 3.5;
        const minSpeed = 0.8;

        if (speed > maxSpeed) {
          bubble.vx =
            (bubble.vx / speed) *
            maxSpeed;

          bubble.vy =
            (bubble.vy / speed) *
            maxSpeed;
        }

        if (
          speed < minSpeed &&
          speed > 0
        ) {
          bubble.vx =
            (bubble.vx / speed) *
            minSpeed;

          bubble.vy =
            (bubble.vy / speed) *
            minSpeed;
        }
      }

      // ==================================================
      // SAVE FRAME
      // ==================================================

      bubblePositionsRef.current =
        bubbles;

      setBubblePositions(bubbles);

      animationFrameRef.current =
        requestAnimationFrame(
          updatePhysics
        );
    };

    animationFrameRef.current =
      requestAnimationFrame(
        updatePhysics
      );

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }
    };
  }, []);

  // ==================================================
  // INITIALIZE
  // ==================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeBubbles();
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeBubbles]);

  // ==================================================
  // RESET
  // ==================================================

  const handleReset = useCallback(() => {
    setExpression("");
    setResult(null);

    caughtIdsRef.current.clear();

    setCaughtIds(new Set());

    previousGestureRef.current =
      "NONE";

    initializeBubbles();
  }, [initializeBubbles]);

  // ==================================================
  // CURSOR
  // ==================================================

  const cursorStyle = handPosition
    ? {
      left:
        `${handPosition.x * 100}%`,
      top:
        `${(1 - handPosition.y) * 100}%`,
    }
    : {
      left: "-100px",
      top: "-100px",
    };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="app">

      {/* ==============================================
          HEADER
      ============================================== */}

      <header className="header">

        <div className="eyebrow">
          GESTURE CONTROLLED
        </div>

        <h1>
          FLOATING CALCULATOR
        </h1>

        <div className="status">

          <div>
            {handDetected
              ? "SYSTEM READY"
              : "SEARCHING FOR HAND"}
          </div>

          <div>
            {expression ||
              "EXPRESSION"}
          </div>

          <div>
            {result !== null
              ? `= ${result}`
              : "Move your hand to begin"}
          </div>

        </div>

      </header>

      {/* ==============================================
          PLAYGROUND
      ============================================== */}

      <section className="playground">

        {/* IMPORTANT:
            worldRef is attached to .world.
            This is the actual bubble boundary.
        */}

        <div
          ref={worldRef}
          className="world"
        >

          {/* ==========================================
              BUBBLES
          ========================================== */}

          {bubblePositions.map(
            (bubble) => {

              const isCaught =
                caughtIds.has(
                  bubble.id
                );

              return (
                <div
                  key={bubble.id}
                  className={`floating-object ${bubble.type}`}
                  style={{
                    left:
                      `${bubble.x}px`,
                    top:
                      `${bubble.y}px`,
                    opacity:
                      isCaught
                        ? 0
                        : 1,
                    pointerEvents:
                      "none",
                  }}
                >
                  {bubble.value}
                </div>
              );
            }
          )}

          {/* ==========================================
              GESTURE CURSOR
          ========================================== */}

          <div
            className="gesture-cursor"
            style={cursorStyle}
          >

            <div className="cursor-ring">
              {gesture === "FIST"
                ? "✊"
                : "☝"}
            </div>

            <div className="cursor-label">
              {gesture === "FIST"
                ? "CATCH"
                : "MOVE"}
            </div>

          </div>

        </div>

        {/* ============================================
            CAMERA
        ============================================ */}

        <div className="camera-preview">

          <Camera
            onHandUpdate={
              handleHandUpdate
            }
            onGestureUpdate={
              handleGestureUpdate
            }
          />

        </div>

        {/* ============================================
            CONTROLS
        ============================================ */}

        <div className="controls">

          <div className="controls-title">
            ◈ GESTURE CONTROLS
          </div>

          <div>
            ✋ Move hand
          </div>

          <div>
            ☝ Touch bubbles
          </div>

          <div>
            ✊ Close fist Catch object
          </div>

          <div>
            🫧 Bubble collision
          </div>

          <div>
            ESC CLEAR EXPRESSION
          </div>

          <button
            onClick={handleReset}
          >
            RESET
          </button>

        </div>

      </section>

    </main>
  );
}

export default App;