$(document).ready(function () {
    const subtopicItemTemplate = `
        <div class="subtopic-fields">
            <div>
                <div>
                    <label>Subtopic Title</label>
                    <input type="text" name="SubtopicTitle[]" />
                </div>
                <div>
                    <label>Starts at (in minutes)</label>
                    <input type="number" name="From[]" min="0" />
                </div>
                <div>
                    <label>Ends at (in minutes)</label>
                    <input type="number" name="To[]" min="5" />
                </div>
            </div>
            <button type="button" class="remove-subtopic"><i class="fas fa-trash"></i></button>
        </div>
    `;

    $('#subtopics').on('click', '.fa-plus', function () {
        $('#subtopics').append(subtopicItemTemplate);
    });

    $('#subtopics').on('click', '.remove-subtopic', function () {
        $(this).closest('.subtopic-fields').remove();
    });

    $('#subtopics').on('click', '.fa-plus', function () {
        $('#subtopic-helper').hide();
    });
});
