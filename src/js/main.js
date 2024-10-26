// On change anchor, change active class
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-link');
  const dropdownToggle = document.getElementById('navbarDropdown');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      links.forEach((link) => {
        link.classList.remove('active');
      });
      e.target.classList.add('active');
    });
  });

  //open and close the dropdown
  dropdownToggle.addEventListener('clik', (e) => {
    e.preventDefault();
    dropdownMenu.classList.toggle('show');
  });
  
  // close the dropdown if you clik outside of it
  document.addEventListener('click', (e) => {
    if(!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)){
      dropdownMenu.classList.remove('show')
    }
  });
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
document.getElementById("contactForm").addEventListener("submit", function(event) {
  if (!this.checkValidity()) {
    event.preventDefault(); // Impede o envio se houver campos inválidos
    alert("Por favor, preencha todos os campos obrigatórios.");
  }
});