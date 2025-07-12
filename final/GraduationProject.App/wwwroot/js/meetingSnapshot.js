const connection = new signalR.HubConnectionBuilder()
    .withUrl("/predictionHub")
    .build();

// ✅ يستقبل إشارات hand mode من أي حد
connection.on("PullHandMode", (data) => {
    console.log("Received HandMode:", data);

    if (data.hand === "raised_hand") {
        showPopup(`${data.userName} has raised their hand`);
        document.getElementById("raiseHandSound")?.play().catch(console.warn);
    } else if (data.hand === "like") {
        showFloatingIcon("👍");
        document.getElementById("likeSound")?.play().catch(console.warn);
    } else if (data.hand === "dislike") {
        showFloatingIcon("👎");
        document.getElementById("dislikeSound")?.play().catch(console.warn);
    }
});

connection.start()
    .then(() => {
        console.log("✅ SignalR connected");

        // لو الشخص هو localParticipant فقط، شغّل captureLocalFrames
        if (isLocalParticipant) {
            captureLocalFrames(meeting);
        }
    })
    .catch(err => console.error("❌ SignalR connection error:", err));

function captureLocalFrames(meeting) {
    let videoElement = document.getElementById(`${meeting.localParticipant.id}-video`);

    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;

    const ctx = canvas.getContext("2d");

    setInterval(() => {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        let imageData = canvas.toDataURL("image/png").split(',')[1];

        const mindState = {
            userId: user.userId,
            userName: user.userName,
            meetingId: meetingId,
            base64Image: imageData,
        };

        fetch("https://4.172.209.173:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mindState),
        })
            .then(res => res.json())
            .then(data => {
                console.log("Prediction:", data);

                // Push full state
                connection.invoke("PushMindState", JSON.stringify(data));

                // Push hand mode with userName
                connection.invoke("PushHandMode", {
                    hand: data.hand,
                    userName: user.userName,
                });

                // Local effect
                if (data.hand === "raised_hand") {
                    showPopup(`${mindState.userName} has raised their hand`);
                    document.getElementById("raiseHandSound")?.play().catch(console.warn);
                } else if (data.hand === "like") {
                    showFloatingIcon("👍");
                    document.getElementById("likeSound")?.play().catch(console.warn);
                } else if (data.hand === "dislike") {
                    showFloatingIcon("👎");
                    document.getElementById("dislikeSound")?.play().catch(console.warn);
                }

            })
            .catch(err => console.error("State Fetch Error:", err));
    }, 10000);
}
