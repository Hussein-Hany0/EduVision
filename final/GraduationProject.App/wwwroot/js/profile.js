var imageInput = document.getElementById("image-upload");
var imageTag = document.getElementsByTagName("img")[0];

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (file) {

        const imageUrl = URL.createObjectURL(file);
        imageTag.src = imageUrl;
    }
});