// Constants
const API_BASE_URL = "https://api.videosdk.live";


// Declaring variables
let videoContainer = document.getElementById("videoContainer");
let micButton = document.getElementById("micButton");
let camButton = document.getElementById("camButton");
let copy_meeting_id = document.getElementById("meetingid");

let meetingMicButton = document.getElementById("meetingMicButton");
let meetingCamButton = document.getElementById("meetingCamButton");

let meeting = "";

let micEnable = false;
let webCamEnable = false;

let previewCamera = document.getElementById("previewCamera");
let preivewVideoStream = null;
let isCameraPermissionAllowed = true;
let isMicrophonePermissionAllowed = true;
let deviceChangeEventListener;

window.addEventListener("load", async function () {

    let AudioVideoPermissionMap;

    try {
        AudioVideoPermissionMap = await VideoSDK.checkPermissions('audio_video');
    } catch (ex) {
        console.log("Error in checkPermissions ", ex);
    }


    if (AudioVideoPermissionMap.get("video") === false || AudioVideoPermissionMap.get("audio") === false) {
        AudioVideoPermissionMap = await window.VideoSDK.requestPermission('audio_video');
    }

    await enableCamera();
    await enableMic();
});

const setAudioOutputDevice = (deviceId) => {
    // console.log(deviceId);
    console.log(deviceId);
    const audioTags = document.getElementsByTagName("audio");
    for (let i = 0; i < audioTags.length; i++) {
        console.log(audioTags[i])
        audioTags.item(i).setSinkId(deviceId);
    }
};

function showJoinMeetingInputFields() {
    const inputElement = document.querySelectorAll(".join-meeting-input-fields");
    inputElement.forEach((element) => {
        element.style.display = "block"
    })

    document.querySelectorAll(".create-meeting-input-fields").forEach((btn => {
        btn.style.display = 'none'
    }))
}


async function togglePreviewMic() {
    if (micEnable) {
        micEnable = false;
    } else {
        enableMic();
    }
}
async function togglePreviewCamera() {
    if (preivewVideoStream) {
        webCamEnable = false;
        previewCamera.srcObject = null;

        const tracks = preivewVideoStream.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });

        preivewVideoStream = null;
    }
    else {
        enableCamera();
    }
}

async function enableCamera() {

    let cameras = await window.VideoSDK.getCameras();
    let currentCamera = cameras[0];

    if (preivewVideoStream !== null) {
        const tracks = preivewVideoStream.getTracks();
        tracks.forEach((track) => {
            track.stop();
        });
        preivewVideoStream = null;
        previewCamera.srcObject = null;
    }

    if (isCameraPermissionAllowed) {
        let mediaStream;

        let cameras = await window.VideoSDK.getCameras();
        let currentCamera = cameras[0];

        try {
            mediaStream = await window.VideoSDK.createCameraVideoTrack({
                cameraId: currentCamera.deviceId ? currentCamera.deviceId : undefined,
                optimizationMode: "motion",
                multiStream: false,
            });
        } catch (ex) {
            console.log("Exception in enableCamera", ex);
        }

        if (mediaStream) {
            preivewVideoStream = mediaStream;
            previewCamera.srcObject = mediaStream;
            previewCamera.play().catch((error) =>
                console.log("videoElem.current.play() failed", error)
            );

            webCamEnable = true;
        }

    }
}

async function enableMic() {
    let currentMic = await this.window.VideoSDK.getMicrophones()[0];

    if (isMicrophonePermissionAllowed)
        micEnable = true;
}