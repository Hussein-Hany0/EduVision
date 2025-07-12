let isCameraPermissionAllowed = true;
let isMicrophonePermissionAllowed = true;

let meetingLink = document.getElementById("meetingId");

function copyMeetingCodeToClipboard() {
    navigator.clipboard.writeText(meetingLink.value)
        .then(() => {
            console.log("Meeting ID copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy: ", err);
            console.log(meetingId.value);
        });
}

function addDomEvents() {
    const micButton = document.getElementById("meetingMicButton");
    const camButton = document.getElementById("meetingCamButton");

    micButton.addEventListener("click", async () => {
        if (isMicrophonePermissionAllowed) {
            if (isMicEnabled) {
                meeting.muteMic();
                isMicEnabled = false;
                micButton.innerHTML = `<i class="fas fa-microphone-slash"></i>`;
                updateMediaIcons(meeting.localParticipant.id, "audio", false); // 🔥 تحديث الأيقونة
            } else {
                if (!meeting.localParticipant.audioTrack) {
                    const mics = await window.VideoSDK.getMicrophones();
                    const currentMic = mics[0];

                    const newMicTrack = await window.VideoSDK.createMicrophoneAudioTrack({
                        microphoneId: currentMic.deviceId || undefined,
                        encoderConfig: "high_quality",
                        noiseConfig: {
                            noiseSuppresion: true,
                            echoCancellation: true,
                            autoGainControl: true,
                        },
                    });

                    meeting.changeMic(newMicTrack);
                } else {
                    meeting.unmuteMic();
                }

                isMicEnabled = true;
                micButton.innerHTML = `<i class="fas fa-microphone"></i>`;
                updateMediaIcons(meeting.localParticipant.id, "audio", true); // 🔥 تحديث الأيقونة
            }
        } else {
            alert("Microphone access denied.");
        }
    });

    camButton.addEventListener("click", async () => {
        if (isCameraPermissionAllowed) {
            if (isCameraEnabled) {
                meeting.disableWebcam();
                isCameraEnabled = false;
                camButton.innerHTML = `<i class="fas fa-video-slash"></i>`;
                updateMediaIcons(meeting.localParticipant.id, "video", false); // 🔥 تحديث الأيقونة
            } else {
                meeting.enableWebcam();
                isCameraEnabled = true;
                camButton.innerHTML = `<i class="fas fa-video"></i>`;
                updateMediaIcons(meeting.localParticipant.id, "video", true); // 🔥 تحديث الأيقونة
            }
        } else {
            alert("Camera access denied.");
        }
    });

    document.getElementById("endMeetingButton").addEventListener("click", () => {
        if (meeting) {
            meeting.leave();
        }
    });

    document.getElementById("recordButton").addEventListener("click", () => {
        showPopup("openSDK is recording the meeting");
    });
}


function openParticipantWrapper() {
    document.getElementById("participantSidebar").classList.add("open");
    updateParticipantListUI();
}


function updateParticipantListUI() {
    const list = document.getElementById("participantList");
    list.innerHTML = "";

    if (!meeting) return;

    // Show local participant
    const localItem = document.createElement("li");
    localItem.textContent = meeting.localParticipant.displayName || "You";
    list.appendChild(localItem);

    // Show remote participants
    meeting.participants.forEach((participant) => {
        const li = document.createElement("li");
        li.textContent = participant.displayName || "Anonymous";
        list.appendChild(li);
    });
}


function closeParticipantWrapper() {
    document.getElementById("participantSidebar").classList.remove("open");
}



function setTrack(stream, audioElement, participant, isLocal) {

    if (stream.kind == "video") {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(stream.track);
        let videoElement = document.getElementById(`${participant.id}-video`);
        videoElement.srcObject = mediaStream;

        videoElement
            .play()
            .catch((error) => { });

        participant.setViewPort(videoElement.offsetWidth, videoElement.offsetHeight);
    }
    if (stream.kind == "audio") {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(stream.track);
        audioElement.srcObject = mediaStream;

        if (isLocal) {
            audioElement.muted = true;
        }

        audioElement
            .play()
            .catch((error) => console.error("audioElem.play() failed", error));
    }
}

function createVideoElement(participantId) {
    // container عشان نحط الفيديو + الأيقونات جواه
    const wrapper = document.createElement("div");
    wrapper.className = "video-wrapper";
    wrapper.setAttribute("id", `wrapper-${participantId}`);

    const videoElement = document.createElement("video");
    videoElement.setAttribute("id", `${participantId}-video`);
    videoElement.setAttribute("autoplay", true);
    videoElement.setAttribute("playsinline", true);
    videoElement.setAttribute("muted", true);
    videoElement.setAttribute("width", 360);
    videoElement.setAttribute("height", 680);

    const micIcon = document.createElement("div");
    micIcon.className = "media-icon mic-icon";
    micIcon.innerHTML = `<i class="fas fa-microphone"></i>`; 

    const camIcon = document.createElement("div");
    camIcon.className = "media-icon cam-icon";
    camIcon.innerHTML = `<i class="fas fa-video"></i>`; 

    wrapper.appendChild(videoElement);
    wrapper.appendChild(micIcon);
    wrapper.appendChild(camIcon);

    return wrapper;
}

function createAudioElement(participantId) {
    let audioElement = document.createElement("audio");
    audioElement.setAttribute("id", `${participantId}-audio`);
    return audioElement;
}

function createLocalParticipant(meeting) {
    localParticipant = createVideoElement(meeting.localParticipant.id);
    localParticipantAudio = createAudioElement(meeting.localParticipant.id);
    videoContainer.appendChild(localParticipant);
}

function showPopup(message) {
    const popup = document.getElementById("popupNotification");
    const messageElement = document.getElementById("popupMessage");
    messageElement.textContent = message;
    popup.style.display = "block";

    // Optional: auto-dismiss after 5 seconds
    setTimeout(() => {
        dismissPopup();
    }, 5000);
}

function dismissPopup() {
    const popup = document.getElementById("popupNotification");
    popup.style.display = "none";
}

document.getElementById("raiseHandButton").addEventListener("click", () => {
    const sound = document.getElementById("raiseHandSound");
    if (sound) sound.play().catch(err => console.warn("Sound play failed:", err));

});

function showFloatingIcon(icon) {
    const el = document.createElement("div");
    el.className = "floating-icon";
    el.textContent = icon;
    document.body.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, 2000);
}

function updateMediaIcons(participantId, kind, enabled) {
    const wrapper = document.getElementById(`wrapper-${participantId}`);
    if (!wrapper) return;

    const micIcon = wrapper.querySelector(".mic-icon i");
    const camIcon = wrapper.querySelector(".cam-icon i");

    if (kind === "audio" && micIcon) {
        micIcon.className = enabled ? "fas fa-microphone" : "fas fa-microphone-slash";
    }

    if (kind === "video" && camIcon) {
        camIcon.className = enabled ? "fas fa-video" : "fas fa-video-slash";
    }
}
