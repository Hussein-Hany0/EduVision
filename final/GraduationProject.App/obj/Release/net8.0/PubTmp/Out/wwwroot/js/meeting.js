window.onload = async function () {


    const API_BASE_URL = "https://api.videosdk.live";
    TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5NjY5ZjAzNS1mMzlkLTQ1Y2YtOWNjMS0wZDExMGZmNmIwNDAiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0MDM0MDA0NywiZXhwIjoxNzQ4MTE2MDQ3fQ.PlOi937ozJmrCH6OYyTrZkrioEFWdWcXo3SNZtuDFrA";

    let isMicEnabled = true;
    let isCameraEnabled = true;

    let meeting;

    async function startMeeting(TOKEN, meetingId, name) {

        window.VideoSDK.config(TOKEN);

        let customVideoTrack, customAudioTrack;

        if (isCameraEnabled) {
            let cameras = await window.VideoSDK.getCameras();
            let currentCamera = cameras[0];

            customVideoTrack = await window.VideoSDK.createCameraVideoTrack({
                cameraId: currentCamera.deviceId ? currentCamera.deviceId : undefined,
                optimizationMode: "motion",
                multiStream: false,
            });
        }

        if (isMicEnabled) {

            let mics = await window.VideoSDK.getMicrophones();
            let currentMic = mics[0];

            customAudioTrack = await window.VideoSDK.createMicrophoneAudioTrack({
                microphoneId: currentMic.deviceId ? currentMic.deviceId : undefined,
                encoderConfig: "high_quality",
                noiseConfig: {
                    noiseSuppresion: true,
                    echoCancellation: true,
                    autoGainControl: true,
                },
            });
        }

        meeting = window.VideoSDK.initMeeting({
            meetingId: meetingId,
            name: name,
            micEnabled: isMicEnabled,
            webcamEnabled: isCameraEnabled,
            maxResolution: "fullhd",
            customCameraVideoTrack: customVideoTrack,
            customMicrophoneAudioTrack: customAudioTrack,
        });

        meeting.join();

        createLocalParticipant(meeting);

        meeting.localParticipant.on("stream-enabled", (stream) => {
            setTrack(
                stream,
                localParticipantAudio,
                meeting.localParticipant,
                (isLocal = true)
            );
        });

        meeting.on("meeting-left", () => {
            window.location.reload();
            document.getElementById("join-page").style.display = "flex";
        });

        meeting.on("participant-joined", (participant) => {
            let videoElement = createVideoElement(participant.id);

            let resizeObserver = new ResizeObserver(() => {
                participant.setViewPort(
                    videoElement.offsetWidth,
                    videoElement.offsetHeight
                );
            });
            resizeObserver.observe(videoElement);
            let audioElement = createAudioElement(participant.id);
            remoteParticipantId = participant.id;

            participant.on("stream-enabled", (stream) => {
                setTrack(stream, audioElement, participant, (isLocal = false));
            });
            videoContainer.appendChild(videoElement);

            videoContainer.appendChild(audioElement);
        });

        meeting.on("participant-left", (participant) => {
            let vElement = document.getElementById(`${participant.id}-video`);
            vElement.parentNode.removeChild(vElement);

            let aElement = document.getElementById(`a-${participant.id}`);
            aElement.parentNode.removeChild(aElement);

            document.getElementById(`p-${participant.id}`).remove();
        });

        addDomEvents();
    }

    async function validateMeeting(meetingId, joinMeetingName) {
        if (TOKEN != "") {
            const url = `${API_BASE_URL}/v2/rooms/validate/${meetingId}`;

            const options = {
                method: "GET",
                headers: { Authorization: TOKEN },
            };

            const result = await fetch(url, options)
                .then((response) => response.json())
                .catch((error) => {
                    alert("Invalid Meeting Id");
                    return;
                });

            if (result.roomId === meetingId)
                startMeeting(TOKEN, meetingId, joinMeetingName);
        }
    }

    async function joinMeeting(isNewMeeting) {

        if (!isNewMeeting)
            validateMeeting(meetingId, hostName);

        if (isNewMeeting && TOKEN != "") {

            const url = `${API_BASE_URL}/v2/rooms`;
            const options = {
                method: "POST",
                headers: { Authorization: TOKEN, "Content-Type": "application/json" },
            };

            const { roomId } = await fetch(url, options)
                .then((response) => response.json())
                .catch((error) => alert("error", roomId));

            document.getElementById("meetingId").value = roomId;
            meetingId = roomId;

            console.log(roomId);

            if (roomId)
                await startMeeting(TOKEN, roomId, "admin");
        }
    }

    async function requestPermissions() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop stream after permission granted
            console.log("Camera and microphone permissions granted");
        } catch (error) {
            console.error("Permission denied for camera or microphone", error);
            alert("You need to allow camera and microphone access!");
        }
    }

    await requestPermissions();

    await joinMeeting(isNewMeeting);

    captureLocalFrames(meeting);
};