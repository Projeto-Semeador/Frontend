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
document.getElementById("contactForm").addEventListener("submit", function(event) {
  if (!this.checkValidity()) {
    event.preventDefault();
    alert("Por favor, preencha todos os campos obrigatórios.");
  }
});