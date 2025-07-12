document.addEventListener("DOMContentLoaded", () => {
    // Add click event listeners to all gender and role input fields
    document.querySelectorAll('input[name="Gender"], input[name="Role"]').forEach(input => {
        input.addEventListener("click", function () {
            // Remove the 'active' class from all parent divs within the respective groups
            if (this.name === "Gender") {
                document.querySelectorAll('.gender > div').forEach(div => div.classList.remove("active"));
            } else if (this.name === "Role") {
                document.querySelectorAll('.role > div').forEach(div => div.classList.remove("active"));
            }

            // Add the 'active' class to the parent div of the clicked input
            const parentDiv = this.closest('div');
            if (parentDiv) {
                parentDiv.classList.add("active");
            }
        });
    });
});