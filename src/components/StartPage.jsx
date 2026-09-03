function StartPage({ onStart }) {
  return (
    <main
      className="start-page"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url('/classroom-bg.png')",
      }}
    >
      <div className="start-overlay">

        <div className="start-icon">
          ✋
        </div>

        <div className="start-eyebrow">
          GESTURE CONTROLLED
        </div>

        <h1>
          KAI KANNAK
        </h1>

        <div className="start-subtitle">
          FLOATING GESTURE CALCULATOR
        </div>

        <p className="start-description">
          A calculator where numbers and operators float freely.
          Move your hand, catch the bubbles, and build your expression.
        </p>

        <button
          className="start-button"
          onClick={() => {
            const audio = new Audio("/start-sound.mpeg");
            audio.play();
            onStart();
          }}
        >
          <span>▶</span>
          START
        </button>

        <div className="start-instructions">

          <div>
            <strong>✋</strong>
            <span>MOVE</span>
          </div>

          <div>
            <strong>✊</strong>
            <span>CATCH</span>
          </div>

          <div>
            <strong>🫧</strong>
            <span>CALCULATE</span>
          </div>

        </div>

        <div className="start-footer">
          NO BUTTONS. JUST YOUR HAND.
        </div>

      </div>
    </main>
  );
}

export default StartPage;