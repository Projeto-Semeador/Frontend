new window.VLibras.Widget('https://vlibras.gov.br/app');
const serverURL = 'http://localhost:3000';

async function likeEvent() {
  var likeButton = document.getElementById('eventLikeButton');
  var eventID = likeButton.getAttribute('data-event-id');

  await axios
    .patch(`${serverURL}/events/like/${eventID}`)
    .then((res) => {
      var likes = res.data.likeCount + 1;
      document.getElementById('eventLikeCount').innerText = likes + ' curtidas';
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      likeButton.getElementsByTagName('i')[0].classList = [
        'bi bi-heart-fill text-white',
      ];
    });
}

function buildEventCard(event) {
  document.getElementById('loading').classList.add('d-none');
  document.getElementById('eventBody').classList.remove('d-none');

  var formatedDate = new Date(event.date).toLocaleDateString('pt-br', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  var formatedTime = new Date(event.date).toLocaleTimeString('pt-br', {
    hour: '2-digit',
    minute: '2-digit',
  });

  document
    .getElementById('eventLikeButton')
    .setAttribute('data-event-id', event._id);
  document.getElementById('eventLikeCount').innerText =
    event.likeCount + ' curtidas';
  document.getElementById('eventTitle').innerText = event.name;
  document.getElementById('eventDate').innerText =
    formatedDate + ' às ' + formatedTime;
  document.getElementById('eventDescription').innerText = event.description;
  document.getElementById('eventImage').src = event.imageURL;
  document.getElementsByTagName('title')[0].innerText =
    event.name + ' | O Semeador';
}

async function getEvents() {
  return await axios
    .get(`${serverURL}/events`)
    .then((res) => {
      const events = res.data;

      return events;
    })
    .catch((err) => {
      console.log(err);
    });
}

// Build the calendar
document.addEventListener('DOMContentLoaded', async function () {
  var events = await getEvents();

  var calendarEl = document.getElementById('event-calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: events.map((event) => {
      return {
        title: event.name,
        start: event.date,
        url: `/src/event.html?event=${event._id}`,
        allDay: true,
      };
    }),
    locale: 'pt-br',
    timezone: 'America/Sao_Paulo',
  });

  calendar.render();
});

// Build the mobile calendar
document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('mobile-event-calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'listMonth',
    events: [
      {
        title: 'Celebração de Páscoa',
        start: '2024-11-15',
        end: '2024-11-15',
        url: './celebracao-pascoa.html',
      },
      {
        title: 'Festa da Família',
        start: '2024-11-16',
        end: '2024-11-16',
        url: './festa-familia.html',
      },
      {
        title: 'Festa Caipira',
        start: '2024-11-17',
        end: '2024-11-17',
        url: './festa-caipira.html',
      },
      {
        title: 'Semana do Aprendiz',
        start: '2024-11-18',
        end: '2024-11-18',
        url: './semana-do-aprendiz.html',
      },
      {
        title: 'Festa da Primavera',
        start: '2024-11-19',
        end: '2024-11-19',
        url: './festa-da-primavera.html',
      },
      {
        title: 'Dia Nacional de Ação de Graças - Aniversário da Escola',
        start: '2024-11-20',
        end: '2024-11-20',
        url: './acao-de-gracas.html',
      },
      {
        title: 'Celebração de Natal',
        start: '2024-11-21',
        end: '2024-11-21',
        url: './celebracao-de-natal.html',
      },
    ],
    locale: 'pt-br',
    timezone: 'America/Sao_Paulo',
  });

  calendar.render();
});

async function getEvent() {
  // Get event id from URL
  const reEvent = new RegExp('(event=[a-zA-Z0-9]*)');
  const urlEvent = window.location.href;

  var eventID = reEvent.exec(urlEvent)[0].split('=')[1];

  if (eventID) {
    await axios
      .get(`${serverURL}/events/${eventID}`)
      .then((res) => {
        const event = res.data;
        console.log(event);

        buildEventCard(event);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

if (window.location.pathname === '/src/index.html') {
  window.onscroll = function () {
    const scrollToTopBtn = document.querySelector('.back-to-top');
    if (document.documentElement.scrollTop > 20) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  };
}

// footer
// form verification
document
  .getElementById('contactForm')
  .addEventListener('submit', function (event) {
    if (!this.checkValidity()) {
      event.preventDefault();
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  });

// button in the corner of the page
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
