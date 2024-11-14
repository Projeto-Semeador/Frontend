new window.VLibras.Widget('https://vlibras.gov.br/app');

document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('event-calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
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

// Get anchor id from URL
const re = new RegExp('(#[a-zA-Z0-9]*)');
const url = window.location.href;

var anchor = re.exec(url)[0].split('#')[1];
console.log(anchor);

if (anchor) {
  anchor = 'nav_' + anchor;
  document.getElementById(anchor).classList.add('active');
} else {
  document.getElementById('nav_inicio').classList.add('active');
}

$('.carousel').carousel({
  interval: 2000,
});

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

//Invert colors to simple Daltonism
function invertColors() {
  document.body.style.filter =
    document.body.style.filter === 'invert(100%)' ? 'none' : 'invert(100%)';
}
