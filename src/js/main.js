new window.VLibras.Widget('https://vlibras.gov.br/app');

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
    document.body.style.filter = document.body.style.filter === 'invert(100%)' ? 'none' : 'invert(100%)';
}