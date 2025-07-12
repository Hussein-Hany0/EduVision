let isMicEnabled = true;
let isCameraEnabled = true;
let meeting;

window.onload = async function () {


    const API_BASE_URL = "https://api.videosdk.live";
    TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5NjY5ZjAzNS1mMzlkLTQ1Y2YtOWNjMS0wZDExMGZmNmIwNDAiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc1MDUyMDAzNiwiZXhwIjoxNzUzMTEyMDM2fQ.ZnS9_VP_5eZluU8f609PfFIx3eAiBwFgFum5oEH365w";

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
            window.location.href = "/home/index";
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
                setTrack(stream, audioElement, participant, false);
                updateMediaIcons(participant.id, stream.kind, true);
            });

            participant.on("stream-disabled", (stream) => {
                updateMediaIcons(participant.id, stream.kind, false);
            });

            videoContainer.appendChild(videoElement);
            videoContainer.appendChild(audioElement);

            // 🔥 Update sidebar if it's open
            if (document.getElementById("participantSidebar").classList.contains("open")) {
                updateParticipantListUI();
            }
        });


        meeting.on("participant-left", (participant) => {
            // Remove full wrapper (which includes video and icons)
            let wrapper = document.getElementById(`wrapper-${participant.id}`);
            if (wrapper) wrapper.remove();

            // Remove audio element
            let aElement = document.getElementById(`${participant.id}-audio`);
            if (aElement) aElement.remove();

            // Remove from sidebar if present
            const participantItem = document.getElementById(`p-${participant.id}`);
            if (participantItem) participantItem.remove();

            // Update sidebar
            if (document.getElementById("participantSidebar").classList.contains("open")) {
                updateParticipantListUI();
            }
        });


        const saveLectureBtn = document.getElementById("saveLectureButton");

        if (isNewMeeting || meeting.localParticipant.displayName.toLowerCase() === "admin") {
            saveLectureBtn.style.display = "block";
        }


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
                await startMeeting(TOKEN, meetingId, joinMeetingName);
        }
    }

    async function joinMeeting(isNewMeeting) {

        if (!isNewMeeting) {

            await validateMeeting(meetingId, hostName);

            document.getElementById("meetingId").value = meetingId;

        }

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

            if (roomId)
                await startMeeting(TOKEN, roomId, "admin");
        }
    }

    async function requestPermissions() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.error("Media Permission Error :", error);
        }
    }

    await requestPermissions();

    await joinMeeting(isNewMeeting);

    captureLocalFrames(meeting);
};