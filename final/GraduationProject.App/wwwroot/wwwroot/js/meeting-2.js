const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const camera_button = document.querySelector(".camer-button");


let isCameraActive = false;
let stream;
let snapshotInterval;

camera_button.addEventListener('click', async () => {
    if (isCameraActive) {

        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            video.srcObject = null;
            stream = null;
        }
        clearInterval(snapshotInterval);
        isCameraActive = false;
    } else {

        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });

            video.srcObject = stream;

            snapshotInterval = setInterval(() => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const imageData = canvas.toDataURL('image/png');
                const base64Image = imageData.split(',')[1];

                const payload = {
                    userId: currentUser.id,
                    frame: base64Image,
                };

                fetch('/Meeting/CaptureFrames', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }).then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text); });
                    }
                }).catch(error => console.error("Error:", error));

            }, 5000);

            isCameraActive = true;
        } catch (err) {
            alert("The camera can't be opened: " + err.message);
        }
    }
});