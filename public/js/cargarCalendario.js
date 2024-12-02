document.addEventListener('DOMContentLoaded', function() {
    // cargar todos los eventos de la tabla eventos de la BBDD e insertarlos en el calendario

    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      locale: 'es',  
      firstDay: 1,
      initialView: 'dayGridMonth'
    });
    calendar.render();
  });