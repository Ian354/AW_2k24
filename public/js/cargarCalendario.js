document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar'); // Obtener el elemento con el ID 'calendar'
  var calendar = new FullCalendar.Calendar(calendarEl, { // Crear un nuevo objeto FullCalendar
      initialView: 'dayGridMonth', 
      locale: 'es', 
      firstDay: 1, 
      events: '/get-eventos', // Eventos a mostrar
      
      eventClick: function (info) {
        // Prevent default browser navigation
        info.jsEvent.preventDefault();
  
        // Populate modal with event details
        document.getElementById('modalEventTitle').textContent = info.event.title;
        document.getElementById('modalEventStart').textContent = info.event.start.toLocaleString();
        document.getElementById('modalEventEnd').textContent = info.event.end
          ? info.event.end.toLocaleString()
          : 'N/A';
        document.getElementById('modalEventDescription').textContent =
          info.event.extendedProps.description || 'No description provided';
  
        // Show the modal
        var eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
        eventModal.show();
      },
  });
  calendar.render(); // Renderizar el calendario
  });