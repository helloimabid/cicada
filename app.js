document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginSection = document.getElementById("login-section");
  const puzzleSection = document.getElementById("puzzle-section");
  const completionSection = document.getElementById("completion-section");
  const timesupSection = document.getElementById("timesup-section");

  const startBtn = document.getElementById("start-btn");
  const userIdInput = document.getElementById("userId");
  const loginError = document.getElementById("login-error");

  const welcomeMessage = document.getElementById("welcome-message");
  const timerDisplay = document.getElementById("timer");

  // Puzzle 1 Elements
  const puzzle1Div = document.getElementById("puzzle-1");
  const base32String = document.getElementById("base32-string");
  const base32Input = document.getElementById("base32-input");
  const base32SubmitBtn = document.getElementById("submit-base32");
  const base32Error = document.getElementById("base32-error");

  // Puzzle 2 Elements
  const puzzle2Div = document.getElementById("puzzle-2");
  const base64Strings = document.getElementById("base64-strings");
  const base64Input = document.getElementById("base64-input");
  const base64SubmitBtn = document.getElementById("submit-base64");
  const base64Error = document.getElementById("base64-error");

  // Completion and Leaderboard
  const finalTimeDisplay = document.getElementById("final-time");
  const leaderboardTableBody = document.querySelector(
    "#leaderboard-table tbody"
  );

  let puzzlesData = {};
  let currentUser = {};
  let timerInterval;
  const TOTAL_TIME = 3600; // 1 hour in seconds

  // --- BASE32 DECODER ---
  // (JavaScript doesn't have a native Base32 decoder)
  function base32Decode(base32) {
    const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    let result = "";
    base32 = base32.toUpperCase().replace(/=+$/, "");

    for (let i = 0; i < base32.length; i++) {
      const val = base32chars.indexOf(base32.charAt(i));
      if (val === -1) throw new Error("Invalid Base32 character found");
      bits += val.toString(2).padStart(5, "0");
    }

    for (let i = 0; i + 8 <= bits.length; i += 8) {
      const chunk = bits.substr(i, 8);
      result += String.fromCharCode(parseInt(chunk, 2));
    }
    return result;
  }

  // --- TIMER LOGIC ---
  const startTimer = () => {
    let timeLeft = localStorage.getItem("timeLeft");
    if (!timeLeft) {
      timeLeft = TOTAL_TIME;
      localStorage.setItem("startTime", Date.now());
    }

    timerInterval = setInterval(() => {
      const elapsedTime = Math.floor(
        (Date.now() - localStorage.getItem("startTime")) / 1000
      );
      timeLeft = TOTAL_TIME - elapsedTime;
      localStorage.setItem("timeLeft", timeLeft);

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("startTime");
        localStorage.removeItem("timeLeft");
        showSection(timesupSection);
        return;
      }
      updateTimerDisplay(timeLeft);
    }, 1000);
  };

  const updateTimerDisplay = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    timerDisplay.textContent = `${h}:${m}:${s}`;
  };

  // --- LEADERBOARD LOGIC ---
  const updateLeaderboard = () => {
    const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.sort((a, b) => a.time - b.time); // Sort by fastest time

    leaderboardTableBody.innerHTML = ""; // Clear existing rows
    scores.forEach((score, index) => {
      const timeTaken = TOTAL_TIME - score.time;
      const m = Math.floor(timeTaken / 60)
        .toString()
        .padStart(2, "0");
      const s = (timeTaken % 60).toString().padStart(2, "0");

      const row = `<tr>
                <td>${index + 1}</td>
                <td>${score.id}</td>
                <td>${m}:${s}</td>
            </tr>`;
      leaderboardTableBody.innerHTML += row;
    });
  };

  const addScoreToLeaderboard = (id, time) => {
    const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    // Prevent duplicate entries
    if (!scores.some((score) => score.id === id)) {
      scores.push({ id, time });
      localStorage.setItem("leaderboard", JSON.stringify(scores));
    }
    updateLeaderboard();
  };

  // --- UI/SECTION MANAGEMENT ---
  const showSection = (sectionToShow) => {
    [loginSection, puzzleSection, completionSection, timesupSection].forEach(
      (section) => {
        section.classList.remove("active");
        section.classList.add("hidden");
      }
    );
    sectionToShow.classList.remove("hidden");
    sectionToShow.classList.add("active");
  };

  // --- PUZZLE LOGIC ---
  const startChallenge = (userId) => {
    currentUser = puzzlesData[userId];
    currentUser.id = userId;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    welcomeMessage.textContent = `Welcome, ${userId}`;
    base32String.textContent = currentUser.base32_encoded;
    // Shuffle and display base64 words
    base64Strings.textContent = currentUser.base64_encoded
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .join(" | ");

    showSection(puzzleSection);
    startTimer();
  };

  // Event Listeners
  startBtn.addEventListener("click", () => {
    const userId = userIdInput.value.trim().toUpperCase();
    if (puzzlesData[userId]) {
      const scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
      if (scores.some((score) => score.id === userId)) {
        loginError.textContent = "This ID has already completed the challenge.";
        return;
      }
      startChallenge(userId);
    } else {
      loginError.textContent = "Invalid Identifier.";
    }
  });

  base32SubmitBtn.addEventListener("click", () => {
    const userAnswer = base32Input.value.trim().toUpperCase();
    if (userAnswer === currentUser.base32_solution) {
      puzzle1Div.classList.add("hidden");
      puzzle2Div.classList.remove("hidden");
      base32Error.textContent = "";
    } else {
      base32Error.textContent = "Incorrect key. Try again.";
    }
  });

  base64SubmitBtn.addEventListener("click", () => {
    const userAnswer = base64Input.value.trim().toLowerCase();
    if (userAnswer === currentUser.base64_solution) {
      clearInterval(timerInterval);
      const timeLeft = localStorage.getItem("timeLeft");
      addScoreToLeaderboard(currentUser.id, parseInt(timeLeft));

      const timeTaken = TOTAL_TIME - timeLeft;
      const m = Math.floor(timeTaken / 60)
        .toString()
        .padStart(2, "0");
      const s = (timeTaken % 60).toString().padStart(2, "0");
      finalTimeDisplay.textContent = `${m}:${s}`;

      localStorage.removeItem("currentUser");
      localStorage.removeItem("startTime");
      localStorage.removeItem("timeLeft");

      showSection(completionSection);
    } else {
      base64Error.textContent =
        "Incorrect sentence. Re-evaluate and try again.";
    }
  });

  // --- INITIALIZATION ---
  const init = async () => {
    try {
      const response = await fetch("puzzles.json");
      puzzlesData = await response.json();

      // Check if a user was in the middle of a challenge on page reload
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        currentUser = JSON.parse(savedUser);
        startChallenge(currentUser.id);
      }

      updateLeaderboard();
    } catch (error) {
      console.error("Could not load puzzles.json", error);
      loginSection.innerHTML = "<h1>Error: Could not load challenge data.</h1>";
    }
  };

  init();
});
