$(document).ready(function() {
    $(document).on('click', '.eliminar-btn', function(event) {
        event.preventDefault(); // Prevent the default form submission

        var buttonId = $(this).attr('id');

        $.ajax({
            type: 'POST',
            url: `/usuario/eventos/eliminar/${buttonId}`,
            success: function(response) {
                // Adaptar el modal basado en la respuesta
                $('#eliminarEventoModal .modal-title').text(response.title);
                $('#eliminarEventoModal .modal-body').text(response.message);
                // Mostrar el modal de confirmación
                $('#eliminarEventoModal').modal('show');
            },
            error: function(xhr, status, error) {
                alert('An error occurred: ' + error);
            }
        });
    });

    $(document).on('click', '#cerrarModalEliminar', function(event) {
        // refrescar la página
        location.reload();
    });
});