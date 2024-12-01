document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      locale: 'es',  
      firstDay: 1,
      initialView: 'dayGridMonth'
    });
    calendar.render();
  });