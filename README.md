<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />

# KAI KANNAK 🖐️🧮

## Basic Details

### Team Name: Trust Me Bro

### Team Members

- Team Lead: Abhishek B - SBCE PATTOOR
- Member 2: Ajmal S - SBCE PATTOOR

### Project Description

Kai Kannak is a completely unnecessary calculator controlled using hand gestures through a webcam. Instead of clicking traditional buttons, users move their hand to navigate through floating numbers and mathematical operators and close their fist to catch them and build mathematical expressions.

The project combines React, MediaPipe hand tracking, real-time gesture recognition, floating UI elements and dynamic meme-style audio feedback. The application reacts to the user's gesture performance, calculation speed, successful or failed interactions, and final result by playing different sounds.

The result is a calculator that doesn't just calculate — it judges your performance while doing it.

### The Problem (that doesn't exist)

Traditional calculators have made mathematics far too convenient.

A normal calculator allows users to simply look at a button, move their finger towards it, press it, and immediately obtain the answer.

This is obviously a serious problem.

Our imaginary problem is:

> "How can we make calculating unnecessarily difficult while making it much more fun?"

We identified several completely unnecessary issues with traditional calculators:

- Calculator buttons are too easy to find.
- Users can directly click the required number.
- Mathematical operators stay in one convenient location.
- Calculations can be completed very quickly.
- There is absolutely no need to wave your hand around the screen.
- Users never have to physically "catch" a number before using it.

Therefore, we decided to remove the convenience entirely.

### The Solution (that nobody asked for)

We created a calculator where the buttons don't exist.

Instead, numbers and mathematical operators float around the screen as interactive objects.

The user controls the floating mathematical environment using their hand.

The webcam captures the user's hand, and MediaPipe detects the hand landmarks in real time. The application uses the detected hand position to determine movement and control the floating objects.

#### Basic interaction:

- 🖐️ Open hand → Navigation mode
- ➡️ Move hand right → Floating objects move left
- ⬅️ Move hand left → Floating objects move right
- ⬆️ Move hand up → Floating objects move down
- ⬇️ Move hand down → Floating objects move up
- ✊ Close hand → Catch/select a nearby floating object
- 🔢 Catch a number → Add it to the expression
- ➕ Catch an operator → Add it to the expression
- `=` Catch equals → Evaluate the expression
- 🔄 Reset/Clear → Start a new calculation

For example, to calculate:

```text
7 + 3
```

the user has to:

```text
Find 7
   ↓
Move hand towards 7
   ↓
Close fist
   ↓
Catch 7
   ↓
Find +
   ↓
Close fist
   ↓
Catch +
   ↓
Find 3
   ↓
Close fist
   ↓
Catch 3
   ↓
Find =
   ↓
Close fist
   ↓
Calculate
   ↓
Result: 10
```
### Dynamic Meme Sound Feedback

The calculator also includes a dynamic meme sound system that reacts to the user's performance.

Instead of simply performing calculations silently, the application evaluates what happens during the interaction and provides different audio feedback based on the user's actions.

Examples include:

- 🎯 Successfully catching an object → Positive/reward meme sound
- 🔥 Fast and successful calculation → Hype/victory sound
- 🐌 Slow interaction → Funny/sarcastic sound
- 🤦 Missing floating objects repeatedly → Funny failure sound
- ❌ Invalid expression → Error/failure sound
- 💀 Invalid mathematical operation → Special error sound
- 🏆 Successfully completing a calculation → Victory sound

This makes the user's gesture performance part of the experience.

The calculator therefore reacts to both:

1. **What the user calculates**
2. **How well the user interacts with the floating objects**

This turns a simple calculator into an unnecessarily competitive gesture-based experience.

## Technical Details

### Technologies/Components Used

For Software:

- JavaScript
- React
- Vite
- MediaPipe Hand Landmarker
- MediaPipe Tasks Vision
- Browser MediaDevices API
- HTML5
- CSS3
- React Hooks
- HTML5 Audio API
- Local audio/meme sound assets
- Git
- GitHub
- Visual Studio Code

For Hardware:

- Laptop/Desktop computer
- Built-in webcam or external USB webcam
- Keyboard and mouse for initial application setup
- No additional electronic hardware required

### Technology Stack

The project is implemented entirely as a browser-based React application.

#### Frontend

- React is used to build the user interface and manage application state.
- Vite is used as the development server and build tool.
- JavaScript is used for gesture processing, calculator logic, object movement and application control.
- CSS is used for the visual design, animations and floating-object effects.

#### Computer Vision

MediaPipe Hand Landmarker is used to detect and track the user's hand through the webcam.

The detected hand landmarks provide information about:

- Hand position
- Finger positions
- Palm position
- Finger extension
- Hand openness
- Closed-fist state

The application converts these landmark coordinates into controls for the floating calculator.

#### Webcam

The browser's MediaDevices API is used to request webcam access and obtain a real-time video stream.

The webcam stream is processed directly in the browser.

No external server is required for webcam processing.

#### Calculator Engine

A custom JavaScript calculator engine handles:

- Addition
- Subtraction
- Multiplication
- Division
- Equals
- Clear/Reset
- Expression construction
- Result calculation

The calculator accepts only supported mathematical operators and values rather than executing arbitrary JavaScript expressions.

### Implementation

For Software:

The application is divided into several logical components.

```text
                    ┌───────────────────┐
                    │      WEBCAM       │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │     MediaPipe     │
                    │  Hand Landmarker  │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Gesture Detection │
                    └─────────┬─────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
          Hand Movement              Hand Gesture
                 │                         │
                 ▼                         ▼
        Move Floating World         Detect Fist
                                           │
                                           ▼
                                   Find Nearby Object
                                           │
                                           ▼
                                     Catch Object
                                           │
                                           ▼
                                   Update Expression
                                           │
                                           ▼
                                  Calculator Engine
                                           │
                                           ▼
                                        Result
```

### Hand Tracking

MediaPipe detects hand landmarks from the webcam stream.

The application continuously receives the detected hand coordinates.

The primary hand position is used as the navigation point.

```text
Current Hand Position
        │
        ▼
Compare With Previous Position
        │
        ▼
Calculate Delta
        │
        ├───────────────┐
        │               │
        ▼               ▼
       ΔX              ΔY
        │               │
        ▼               ▼
Horizontal          Vertical
Movement            Movement
        │               │
        ▼               ▼
Move Floating       Move Floating
World Opposite      World Opposite
Direction           Direction
```

A movement dead-zone is used to prevent small natural hand movements from continuously moving the floating objects.

### Floating World Movement

The floating calculator uses a virtual world offset.

The application maintains:

```text
worldOffsetX
worldOffsetY
```

When the hand moves horizontally or vertically, the corresponding world offset is updated.

Conceptually:

```text
handDeltaX = currentHandX - previousHandX

handDeltaY = currentHandY - previousHandY
```

The floating world moves in the opposite direction:

```text
worldOffsetX -= handDeltaX * sensitivity

worldOffsetY -= handDeltaY * sensitivity
```

This creates the effect that the user is navigating through a large floating mathematical space.

### Floating Objects

Each number and operator is represented as an independent floating object.

Each object contains information such as:

```text
id
value
type
x
y
caught
animationState
```

Example:

```javascript
{
    id: 1,
    value: "7",
    type: "number",
    x: 450,
    y: 300,
    caught: false
}
```

Numbers include:

```text
0
1
2
3
4
5
6
7
8
9
```

Operators include:

```text
+
-
×
÷
=
```

The objects can move around the screen while maintaining their own positions within the virtual floating world.

### Catch Mechanism

The catch mechanic is the main interaction of the project.

The application detects whether the user's hand is open or closed.

```text
             🖐️
              │
              ▼
        Navigation Mode


             ✊
              │
              ▼
         Catch Mode
```

When the user closes their hand:

1. The hand position is converted to screen coordinates.
2. The application searches for nearby floating objects.
3. The nearest object is calculated.
4. A catch radius is checked.
5. If an object is within the radius, it becomes selected.
6. The selected object is added to the expression.
7. A catch animation is triggered.
8. The object is temporarily removed or marked as caught.

The application also prevents the same object from being caught repeatedly while the fist remains closed.

### Expression Building

Every successfully caught object is added to the expression according to the calculator rules.

Example:

```text
Catch 7
   ↓
Expression: 7

Catch +
   ↓
Expression: 7 +

Catch 3
   ↓
Expression: 7 + 3

Catch =
   ↓
Expression: 7 + 3 =

Result: 10
```

The application validates the sequence of numbers and operators to prevent invalid expressions.

### Dynamic Audio Feedback

The application includes a dynamic audio feedback system that responds to both gesture performance and calculator events.

The system tracks interaction information such as:

- Object catch success
- Object catch failure
- Gesture accuracy
- Calculation speed
- Invalid expressions
- Successful calculations
- Mathematical errors
- Overall interaction performance

Based on these events, appropriate meme-style sounds are played.

```text
                 USER GESTURE
                      │
                      ▼
              Gesture Detection
                      │
                      ▼
             Interaction Result
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
     Success        Failure       Slow/Bad
        │             │             │
        ▼             ▼             ▼
   Reward Sound    Fail Sound   Funny Sound
        │             │             │
        └─────────────┼─────────────┘
                      │
                      ▼
                CALCULATION
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
          Correct            Error
             │                 │
             ▼                 ▼
       Victory Sound       Error Sound

### Calculator Operations

The calculator supports:

- Addition
- Subtraction
- Multiplication
- Division
- Equals
- Clear/Reset

The multiplication symbol `×` can be converted internally to `*` for calculation.

Division by zero is handled as an invalid mathematical operation rather than allowing an invalid result.

### User Interface

The interface is designed around a playful chalkboard-inspired visual theme.

The landing page uses a chalkboard-style background with the application interface positioned over the central area.

The calculator screen contains:

- Floating numbers
- Floating mathematical operators
- Hand/cursor indicator
- Expression display
- Result display
- Webcam preview
- Reset/Clear control
- Gesture instructions

The goal is to make the application feel more like a small interactive game than a conventional calculator.

# Installation

Clone the repository:

```bash
git clone [YOUR_GITHUB_REPOSITORY_URL]
```

Navigate to the project directory:

```bash
cd kai_kannak
```

Install the required dependencies:

```bash
npm install
```

# Run

Start the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

Usually:

```text
http://localhost:5173
```

Open the URL in a modern browser.

The browser will request permission to access the webcam.

Select:

```text
Allow
```

to enable hand tracking.

### Project Documentation

For Software:

# Screenshots 

<img width="1920" height="1080" alt="Screenshot (37)" src="https://github.com/user-attachments/assets/d27f407c-3886-4789-bacf-298bad4f53c4" />


*Landing page of the Floating Gesture Calculator showing the chalkboard-themed background, project title, introductory text and Start Calculator interface.*

<img width="1920" height="1080" alt="Screenshot (38)" src="https://github.com/user-attachments/assets/e1bf59db-0022-48c1-b008-5e4ad2d73f99" />


*Main calculator interface showing numbers and mathematical operators floating freely around the screen instead of being arranged as traditional calculator buttons.*

<img width="1920" height="1080" alt="Screenshot (38)" src="https://github.com/user-attachments/assets/e1bf59db-0022-48c1-b008-5e4ad2d73f99" />


*Gesture control interface showing the webcam feed and hand tracking used to navigate through the floating mathematical environment.*

<img width="1920" height="1080" alt="Screenshot (39)" src="https://github.com/user-attachments/assets/6ca7ef79-9ff1-4719-a219-59800f522867" />


*The user closes their hand into a fist near a floating number or operator to catch and select the object.*

<img width="1920" height="1080" alt="Screenshot (40)" src="https://github.com/user-attachments/assets/38e5eebb-43e6-4720-8885-6cb76b68e6e5" />


*The completed mathematical expression and final calculated result displayed by the application.*

# Diagrams

<img width="1536" height="1024" alt="ChatGPT Image Sep 3, 2026, 06_49_33 PM" src="https://github.com/user-attachments/assets/d2616965-462d-4de0-9779-0a261fe8d805" />


*Complete workflow of the Floating Gesture Calculator showing webcam input, MediaPipe hand tracking, gesture recognition, floating world navigation, object detection, object catching, expression construction and calculator execution.*

![Architecture](diagrams/architecture.png)

*System architecture showing the interaction between the webcam, MediaPipe, gesture controller, React frontend, floating-object system and calculator engine.*

### Workflow Description

```text
                    START
                      │
                      ▼
               Launch React App
                      │
                      ▼
             Request Webcam Access
                      │
                      ▼
                Start Webcam
                      │
                      ▼
            MediaPipe Hand Tracking
                      │
                      ▼
             Detect Hand Landmarks
                      │
                      ▼
              Detect Hand Position
                      │
                      ▼
            Calculate Hand Movement
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
       Hand Movement       Closed Fist
             │                 │
             ▼                 ▼
     Move Floating World    Find Object
                               │
                               ▼
                         Catch Object
                               │
                               ▼
                      Add To Expression
                               │
                               ▼
                       Update Calculator
                               │
                               ▼
                         Is "=" Caught?
                               │
                               ▼
                         Calculate Result
                               │
                               ▼
                         Display Result
                               │
                               ▼
                         Reset / Continue
                               │
                               └──────────► LOOP
```

For Hardware:

# Schematic & Circuit

Not applicable.

The project does not require any custom electronic circuit, microcontroller or external electronic components.

The only hardware required is a laptop or desktop computer with a webcam.

# Build Photos

Not applicable.

This is a software-only project. No physical hardware assembly or electronic construction is required.

*Laptop/Desktop computer and webcam used to run the software and capture hand gestures.*

![Build](screenshots/development.png)

*Development process showing the React application, webcam integration and gesture-controlled interface.*

<img width="1920" height="1080" alt="Screenshot (40)" src="https://github.com/user-attachments/assets/d13a1073-67e7-4b3e-ac3e-263fcbf0dc03" />


*Final working version of the Floating Gesture Calculator.*

### Project Demo

# Video

[Add your demo video link here]

*The demonstration video shows the complete working system, including the chalkboard-themed landing page, webcam initialization, real-time hand tracking, floating numbers and operators, hand-based navigation, closed-fist object catching, expression construction and final calculation.*

# Additional Demos

[Add any extra demo materials or links here]

Possible additional demo materials include:

- Live deployed application
- GitHub repository
- Short GIF showing the gesture interaction
- Screen recording of the calculator
- Project presentation
- Architecture diagram
- Workflow diagram

## Team Contributions

- AJMAL S &#58; React frontend development, landing page design, chalkboard-themed UI, floating calculator interface, animations and overall application integration, testing, debugging and project documentation.

- ABHISHEK B &#58; MediaPipe integration, webcam functionality, hand landmark detection, hand movement tracking, open-hand detection and closed-fist gesture recognition, Calculator engine, expression handling, floating-object management, catch/collision system.

---

Made with ❤️ at TinkerHub Useless Projects

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)

![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)
