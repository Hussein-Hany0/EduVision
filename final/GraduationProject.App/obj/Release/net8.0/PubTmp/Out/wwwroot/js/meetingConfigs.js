let isCameraPermissionAllowed = true;
let isMicrophonePermissionAllowed = true;

function copyMeetingCodeToClipboard() {
    navigator.clipboard.writeText(copy_meeting_id.value)
        .then(() => {
            console.log("Meeting ID copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy: ", err);
        });
}

function addDomEvents() {
    meetingMicButton.addEventListener("click", () => {
        if (isMicrophonePermissionAllowed && !isMicEnabled) {
            meeting.enableMic();
        }
        else {
            meeting.muteMic();
            isMicEnabled = false;
        }
    });

    meetingCamButton.addEventListener("click", async () => {
        if (isCameraPermissionAllowed && !isCameraEnabled) {
            meeting.enableWebcam();
        } else {
            meeting.disableWebcam();
            isCameraEnabled = false;
        }
    });
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
        audioElement
            .play()
            .catch((error) => console.error("audioElem.play() failed", error));
    }
}

function createVideoElement(participantId) {
    let videoElement = document.createElement("video");
    videoElement.setAttribute("id", `${participantId}-video`);
    videoElement.setAttribute("autoplay", true);
    videoElement.setAttribute("playsinline", true);
    videoElement.setAttribute("muted", true);
    videoElement.setAttribute("width", 360);
    videoElement.setAttribute("height", 680);
    return videoElement;
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