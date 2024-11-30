$(document).ready(function() {
    // Handle previous email button click
    $('.prev-notif').on('click', function() {
        var emailId = $(this).data('email-id');
        var prevEmailId = emailId - 1;
        if (prevEmailId >= 0) {
            $('.notif-content').hide();
            $('#contenido-' + prevEmailId).show();
        }
    });

    // Handle next email button click
    $('.next-notif').on('click', function() {
        var emailId = $(this).data('email-id');
        var nextEmailId = emailId + 1;
        if ($('#contenido-' + nextEmailId).length) {
            $('.notif-content').hide();
            $('#contenido-' + nextEmailId).show();
        }
    });
    
});