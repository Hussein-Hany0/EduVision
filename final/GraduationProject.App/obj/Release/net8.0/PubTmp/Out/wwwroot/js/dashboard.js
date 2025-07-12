const connection = new signalR.HubConnectionBuilder()
    .withUrl("/predictionHub")
    .build();

connection.start().then(() => {
    console.log("Connected to PredictionHub");
}).catch(err => console.error(err));


let student_IDs = [];

connection.on("PullMindState", (MindState) => {

    if (!student_IDs.includes(MindState.userId))
    {
        student_IDs.push(MindState.userId);

        const mindStateElement = document.createElement("div");
        mindStateElement.className = `${MindState.userId}-mind-state`;
        mindStateElement.innerHTML = `
            <p><strong>User ID:</strong> ${MindState.userId}</p>
            <p><strong>State:</strong> ${MindState.state}</p>
        `;

        console.log(mindStateElement);

        document.getElementsByClassName("mindStateContainer")[0].appendChild(mindStateElement);
    }
    else
    {
        document.getElementsByClassName(`${MindState.userId}-mind-state`)[0].innerHTML = `
            <p><strong>User ID:</strong> ${MindState.userId}</p>
            <p><strong>State:</strong> ${MindState.state}</p>
        `;
    }
});
