// Variables globals
let currentMonthOffset = 0;
let currentDate = new Date();

// Inicialització del calendari
document.addEventListener('DOMContentLoaded', function () {
    initializeCalendar();
    setupEventListeners();
});

// Configuració dels event listeners
function setupEventListeners() {
    $('#next').click(function () {
        navigateMonth(1);
    });

    $('#prev').click(function () {
        navigateMonth(-1);
    });
}

// Inicialitza el calendari
function initializeCalendar() {
    renderCalendar();
}

// Navegació entre mesos
function navigateMonth(direction) {
    currentMonthOffset += direction;
    renderCalendar();
}

// Renderitza el calendari
function renderCalendar() {
    const calendarEl = document.getElementById('calendari');
    calendarEl.innerHTML = '';

    // Calcula el mes i any a mostrar
    const displayDate = new Date();
    displayDate.setMonth(currentDate.getMonth() + currentMonthOffset);

    const month = displayDate.getMonth();
    const year = displayDate.getFullYear();

    // Crea el caption amb el mes i any
    const monthNames = [
        "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
        "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
    ];

    const caption = calendarEl.createCaption();
    caption.textContent = `${monthNames[month].toUpperCase()} ${year}`;

    // Crea el capçaler amb els dies de la setmana
    const dayNames = [
        "dilluns", "dimarts", "dimecres", "dijous",
        "divendres", "dissabte", "diumenge"
    ];

    const thead = calendarEl.createTHead();
    const headerRow = thead.insertRow();

    dayNames.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });

    // Crea el cos del calendari
    const tbody = calendarEl.createTBody();

    // Calcula el primer dia del mes i l'últim dia del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Determina el dia de la setmana del primer dia (0 = dilluns, 6 = diumenge)
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7; // Convertir diumenge (0) a 7
    firstDayOfWeek--; // Ajustar perquè dilluns sigui 0

    // Crea les files del calendari
    let dayCount = 1;

    for (let i = 0; i < 6; i++) {
        const row = tbody.insertRow();

        for (let j = 0; j < 7; j++) {
            const cell = row.insertCell();

            if ((i === 0 && j < firstDayOfWeek) || dayCount > daysInMonth) {
                // Cel·les buides abans del primer dia o després de l'últim dia
                cell.className = 'empty-day';
                cell.innerHTML = '&nbsp;';
            } else {
                // Cel·les amb dies del mes
                const dayId = `${dayCount}-${month}-${year}`;
                cell.id = dayId;
                cell.className = getDayCellClass(j);

                // Comprova si és el dia actual
                const today = new Date();
                if (dayCount === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear() &&
                    currentMonthOffset === 0) {
                    cell.classList.add('today');
                }

                // Número del dia
                const dayNumber = document.createElement('div');
                dayNumber.textContent = dayCount;
                cell.appendChild(dayNumber);

                // Comprova si hi ha notes per a aquest dia
                const note = localStorage.getItem(dayId);
                if (note) {
                    cell.classList.add('has-note');
                    const noteIndicator = document.createElement('div');
                    noteIndicator.className = 'note-indicator';
                    noteIndicator.textContent = note;
                    cell.appendChild(noteIndicator);
                }

                // Afegeix l'esdeveniment de clic
                cell.addEventListener('click', function () {
                    openNotesModal(dayId, dayCount, month, year);
                });

                dayCount++;
            }
        }

        // Si hem arribat a l'últim dia, sortim del bucle
        if (dayCount > daysInMonth) break;
    }
}

// Retorna la classe CSS per a la cel·la del dia en funció del dia de la setmana
function getDayCellClass(dayOfWeek) {
    return (dayOfWeek === 5 || dayOfWeek === 6) ?
        'calendar-day weekend' : 'calendar-day weekday';
}

// Obre el modal per a afegir/editar notes
function openNotesModal(dayId, day, month, year) {
    const monthNames = [
        "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
        "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
    ];

    // Actualitza la data seleccionada al modal
    document.getElementById('selectedDate').textContent =
        `${day} de ${monthNames[month]} de ${year}`;

    // Carrega la nota existent si n'hi ha
    const existingNote = localStorage.getItem(dayId);
    document.getElementById('noteInput').value = existingNote || '';

    // Mostra el modal
    document.getElementById('notesModal').style.display = 'flex';

    // Guarda l'ID del dia seleccionat com a atribut del modal
    document.getElementById('notesModal').setAttribute('data-day-id', dayId);
}

// Tanca el modal de notes
function closeNotes() {
    document.getElementById('notesModal').style.display = 'none';
}

// Guarda la nota al localStorage
function saveNote() {
    const noteInput = document.getElementById('noteInput');
    const noteText = noteInput.value.trim();
    const dayId = document.getElementById('notesModal').getAttribute('data-day-id');

    if (noteText) {
        localStorage.setItem(dayId, noteText);
        closeNotes();
        renderCalendar(); // Actualitza el calendari per mostrar la nova nota
    } else {
        alert('Si us plau, escriu una nota abans de guardar.');
    }
}

// Elimina la nota del localStorage
function deleteNote() {
    const dayId = document.getElementById('notesModal').getAttribute('data-day-id');

    if (localStorage.getItem(dayId)) {
        if (confirm('Estàs segur que vols eliminar aquesta nota?')) {
            localStorage.removeItem(dayId);
            closeNotes();
            renderCalendar(); // Actualitza el calendari
        }
    } else {
        alert('No hi ha cap nota per eliminar.');
    }
}