$(document).ready(function() {
    // Click a la notificación
    $('.notif-item').on('click', function() {
        var emailId = $(this).data('email-id');
        $('.email-content').hide();
        $('#contenido-' + emailId).show();
    });

    // Notificacion previa
    $('.prev-notif').on('click', function() {
        var emailId = $(this).data('email-id');
        var prevEmailId = emailId + 1;
        if (prevEmailId >= 0) {
            $('.notif-content').hide();
            $('#contenido-' + prevEmailId).show();
        }esults, mostrados.length
    });

    // Notifiacion siguiente
    $('.next-notif').on('click', function() {
        var emailId = $(this).data('email-id');
        var nextEmailId = emailId - 1;
        console.log($('.list-group').length)
        if ($('#contenido-' + nextEmailId).length) {
            $('.notif-content').hide();
            $('#contenido-' + nextEmailId).show();
        }
    });
});

setInterval(function() {
    $.ajax({
        url: '/inbox/fetch-notifications',
        method: 'GET',
        success: function(response) {
            var notifications = response.notifications;
            var notificationCount = response.notificationCount;
            console.log(notificationCount);
            var emailListHtml = '';
            var emailContentHtml = '';
            for(var i = notificationCount + notifications.length - 1; i >= notificationCount; i--) {
                var notificacion = notifications[i - notificationCount];
                if (!$('#titulo-' + i).length) {
                    emailListHtml += `
                        <li class="list-group-item active shadow-sm rounded notif-item" id="titulo-${i}">
                            <div class="row">
                                <div class="col-sm-2">
                                    <div class="initial-avatar bg-success bg-gradient">EU</div>
                                </div>
                                <div class="col-sm-8">
                                    <div>
                                        <p class="mb-1 text-singleline text-dark">Eventos UCM Team </p>
                                        <p class="text-muted mb-0 text-singleline">${notificacion.titulo}</p>
                                    </div>
                                </div>
                                <div class="col-sm-2">
                                    <div>
                                        <p class="mb-1 text-muted">${(notificacion.hora).toLocaleTimeString('es-ES', { hour: 'numeric', minute: 'numeric'})}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    `;
                    emailContentHtml += `
                        <div class="notif-content" id="contenido-${i}" style="display: none;">
                            <div class="p-2 pt-4">
                                <div class="btn-toolbar mb-3 d-flex justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                                    <div class="input-group">
                                        <button type="button" class="btn text-muted prev-notif" data-email-id="${i}"><i class="fa-solid fa-chevron-left"></i></button>
                                        <button type="button" class="btn text-muted next-notif" data-email-id="${i}"><i class="fa-solid fa-angle-right"></i></button>
                                    </div>
                                    <div class="btn-group me-2" role="group" aria-label="First group">
                                        <button type="button" class="btn text-muted"><i class="fa-solid fa-trash-can"></i></button>
                                    </div>
                                </div>
        
                                <p class="text-muted mb-1">${`Fecha: ${notificacion.hora.getDate()}/${notificacion.hora.getMonth()} ${(notificacion.hora).toLocaleTimeString('es-ES', { hour: 'numeric', minute: 'numeric'})}` }</p>
                                <h5 class="mb-3">${notificacion.titulo}</h5>
        
                                <div style="font-family: Arial, sans-serif;">
                                    <p class="mb-3">${notificacion.contenido}</p>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
            $(`.list-group`).prepend(emailListHtml);
            $(`#contenido-notifs`).prepend(emailContentHtml);
        }
    });
}, 5000);