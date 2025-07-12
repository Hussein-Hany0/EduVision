function captureLocalFrames(meeting) {
    let videoElement = document.getElementById(`${meeting.localParticipant.id}-video`);
    console.log(videoElement);

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.width;
    console.log(canvas.width);
    canvas.height = videoElement.height;
    console.log(canvas.height);

    const ctx = canvas.getContext("2d");
   
    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/predictionHub")
        .build();

    connection.start().then(() => {
        console.log("Connected to PredictionHub");

        setInterval(() => {
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

            let imageData = canvas.toDataURL("image/png").split(',')[1];

            const mindState = {
                userId: user.userId,
                meetingId: meetingId,
                base64Image: imageData,
            };


            fetch("http://127.0.0.1:5000/predict-single", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mindState),
            })
                .then(response => {
                    try {
                        console.log(response);
                        connection.invoke("PushMindState", JSON.stringify(response));

                    } catch (e) {
                        console.error("error:", e);
                    }
                })
                .catch(error => console.error("Fetch Error:", error));

        }, 3000);

    }).catch(err => console.error("Connection Error:", err));

}