$(document).ready(function() {
    $('.accordion').on('click', '.registrarme-btn', function(event) {
        event.preventDefault(); // Prevent the default form submission

        var buttonId = $(this).attr('id');
        var form = $(this).closest('form');

        $.ajax({
            type: 'POST',
            url: `/apuntar/${buttonId}`,
            data: form.serialize(),
            success: function(response) {
                // Adaptar el modal basado en la respuesta
                $('#confirmationModalTitle').text(response.title);
                $('#confirmationModal .modal-body').text(response.message);
                // Mostrar el modal de confirmación
                $('#confirmationModal').modal('show');
            },
            error: function(xhr, status, error) {
                alert('An error occurred: ' + error);
            }
        });
    });
});