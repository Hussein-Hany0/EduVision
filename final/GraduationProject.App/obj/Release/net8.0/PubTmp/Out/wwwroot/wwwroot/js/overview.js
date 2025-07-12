$(document).ready(function () {
    $('td div button').click(function () {
        $(this).siblings('ul').toggle();
    });

    $(document).click(function (event) {
        if (!$(event.target).closest('td div').length) {
            $('ul').hide();
        }
    });

});