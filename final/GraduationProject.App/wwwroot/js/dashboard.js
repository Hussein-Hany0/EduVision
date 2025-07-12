const connection = new signalR.HubConnectionBuilder()
    .withUrl("/predictionHub")
    .build();

connection.start().then(() => {
    console.log("Connected to PredictionHub");
}).catch(err => console.error(err));

const warningSound = new Audio('../sounds/ALERT.mp3');

let student_IDs = [];
let studentStates = [];

const stateEmojis = {
    Anger: "😠",
    Disgust: "🤢",
    Fear: "😨",
    Happiness: "😄",
    Sadness: "😢",
    Surprise: "😲",
    Neutral: "😐",
};

connection.on("PullMindState", (MindState) => {
    if (!student_IDs.includes(MindState.userId)) {
        student_IDs.push(MindState.userId);
        studentStates.push(MindState.state);
        addStudentToStateView(MindState.userName, MindState.state, MindState.hand, MindState.gaze);
    } else {
        const index = student_IDs.indexOf(MindState.userId);
        studentStates[index] = MindState.state;
        updateStudentState(MindState.userName, MindState.state, MindState.hand, MindState.gaze);
    }

    updateStatistics();

    if (studentStates.filter(state => state === "Anger").length >= Math.ceil(student_IDs.length / 3)) {
        showPopup("⚠️ Warning: 1/3 of the students are feeling 'Anger'. Please address this issue.");
        warningSound.currentTime = 0;
        warningSound.play();
    }
});

function addStudentToStateView(name, state, hand, gaze) {
    const stateViewContainer = document.querySelector(".students-grid");
    const studentElement = document.createElement("div");
    const safeClass = name.replace(/\s+/g, '_');

    studentElement.className = `student-state ${safeClass}`;
    studentElement.innerHTML = `
        <div class="state-content">
            <div class="left-column">
                <span class="state-emoji" style="font-size: 2rem;">${stateEmojis[state] || "❓"}</span>
                <p class="student-name">${name}</p>
                <p class="student-state-label">${state}</p>
            </div>
            <div class="divider"></div>
            <div class="right-column">
                <p class="student-hand">✋ Hand: ${hand}</p>
                <p class="student-gaze">👁️ Gaze: ${gaze}</p>
            </div>
        </div>
    `;
    stateViewContainer.appendChild(studentElement);
}



function updateStudentState(name, state, hand, gaze) {
    const safeClass = name.replace(/\s+/g, '_');
    const studentElement = document.querySelector(`.student-state.${safeClass}`);
    if (studentElement) {
        const emojiSpan = studentElement.querySelector(".state-emoji");
        const stateLabel = studentElement.querySelector(".student-state-label");

        emojiSpan.textContent = stateEmojis[state] || "❓";
        stateLabel.textContent = state;

        const handLabel = studentElement.querySelector(".student-hand");
        const gazeLabel = studentElement.querySelector(".student-gaze");

        if (handLabel) handLabel.textContent = `✋ Hand: ${hand}`;
        if (gazeLabel) gazeLabel.textContent = `👁️ Gaze: ${gaze}`;
    }
}



function updateStatistics() {
    const totalStudents = studentStates.length;
    const positiveStates = studentStates.filter(state =>
        ["Happiness", "Surprise", "Neutral"].includes(state)
    ).length;

    document.getElementById("totalStudents").textContent = totalStudents;
    document.getElementById("positiveStates").textContent = `${((positiveStates / totalStudents) * 100).toFixed(1)}%`;
    document.getElementById("negativeStates").textContent = `${(((totalStudents - positiveStates) / totalStudents) * 100).toFixed(1)}%`;
}

function showPopup(message) {
    const popup = document.getElementById("popupNotification");
    const messageElement = document.getElementById("popupMessage");
    messageElement.textContent = message;
    popup.style.display = "block";
}

function dismissPopup() {
    const popup = document.getElementById("popupNotification");
    popup.style.display = "none";
}
