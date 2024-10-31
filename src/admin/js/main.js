const serverURL = 'http://localhost:3000';

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const remember = document.getElementById('remember').checked;

  const data = {
    username: email,
    password,
    remember,
  };

  await axios
    .post(`${serverURL}/login`, data, {
      withCredentials: remember,
    })
    .then((res) => {
      window.location.href = '/src/admin/dashboard';
    })
    .catch((err) => {
      let alert = document.querySelector('.alert');
      alert.className = `alert alert-danger show`;
      alert.classList.remove('d-none');

      setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('d-none');
      }, 5000);
    });
}

function displayAlert(type, message) {
  var icon;

  switch (type) {
    case 'success':
      icon = '<i class="bi bi-check-circle"></i>';
      break;
    case 'danger':
      icon = '<i class="bi bi-exclamation-circle"></i>';
      break;
    case 'warning':
      icon = '<i class="bi bi-exclamation-triangle"></i>';
      break;
    case 'info':
      icon = '<i class="bi bi-info-circle"></i>';
      break;
  }

  var alert = document.querySelector('#feedbackAlert');
  alert.className = `alert alert-${type} show fade d-flex align-items-center gap-4`;
  alert.innerHTML = icon;
  alert.innerHTML += message;

  setTimeout(() => {
    $('#feedbackAlert').alert('close');
  }, 5000);
}

function populateEvents(events) {
  const eventList = document.querySelector('#eventList');
  eventList.innerHTML = '';

  if (events.length <= 0) {
    eventList.innerHTML = `
			<div style="height: 100%; width: 100%;">
				<p class="text-center text-muted">Nenhum evento cadastrado</p>
			</div>
		`;
  }

  events.forEach((e) => {
    eventList.innerHTML += `
			<div class="card">
				<div class="card-header">
						Evento #${e.id}
				</div>
				<div class="card-body">
				<div class="d-flex justify-content-between align-items-center">
						<div>
						<h5 class="card-title">${e.name}</h5>
						<p class="card-text">
					${e.description}
						</p>
						</div>
						<div class="d-flex gap-2" style="height: min-content;">
							<button href="#" class="btn btn-primary text-white"><i class="bi bi-pencil"></i></button>
							<button data-bs-toggle="modal" class="btn btn-danger" data-id="${e.id}" data-bs-target="#deleteEventModal" ><i class="bi bi-trash"></i></button>
						</div>
					</div>
				</div>
			</div>
		`;
  });
}

function populateUsers(users) {
  const userList = document.querySelector('#userList');
  userList.innerHTML = '';

  if (users.length <= 0) {
    userList.innerHTML = `
			<div style="height: 100%; width: 100%;">
				<p class="text-center text-muted">Nenhum usuário cadastrado</p>
			</div>
		`;
  }

  users.forEach((u) => {
    userList.innerHTML += `
			<div class="card">
				<div class="card-header">
						Usuário #${users.indexOf(u) + 1}
				</div>
				<div class="card-body">
				<div class="d-flex gap-2 align-items-center justify-content-between">
						<h5>${u.username}</h5>
						<div>
							<button href="#" class="btn btn-primary text-white"><i class="bi bi-pencil"></i></button>
							<button data-bs-toggle="modal" class="btn btn-danger" data-username="${u.username}" data-bs-target="#deleteUserModal"><i class="bi bi-trash"></i></button>
						</div>
					</div>
				</div>
			</div>
		`;
  });
}

async function fetchEvents() {
  await axios.get(`${serverURL}/events`).then((res) => {
    populateEvents(res.data);
  });
}

async function fetchUsers() {
  await axios
    .get(`${serverURL}/users`, {
      withCredentials: true,
    })
    .then((res) => {
      populateUsers(res.data);
    });
}

async function createNewEvent() {
  let eventName = document.querySelector('#eventName').value;
  let eventDescription = document.querySelector('#eventDescription').value;
  let eventImage = document.querySelector('#eventImage').files[0];
  let modal = document.querySelector('#addEventModal');

  const event = {
    name: eventName,
    description: eventDescription,
    image: eventImage,
  };

  console.log(event);

  await axios
    .post(`${serverURL}/events`, event, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      displayAlert('success', 'Evento criado com sucesso');
    })
    .catch((err) => {
      displayAlert('danger', 'Não foi possível criar o evento');
    });

  await fetchEvents();

  $('#addEventModal').modal('toggle');
}

async function deleteEvent(id) {
  await axios
    .delete(`${serverURL}/events/${id}`, {
      withCredentials: true,
    })
    .then((res) => {
      displayAlert('success', 'Evento deletado com sucesso');
    })
    .catch((err) => {
      displayAlert('danger', 'Não foi possível deletar o evento');
    });

  await fetchEvents();

  $('#deleteEventModal').modal('toggle');
}

$('#deleteEventModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget);
  let id = button.data('id');

  let modal = $(this);
  modal.find('#deleteConfirmation').attr('onclick', `deleteEvent(${id})`);
});

async function createUser() {
  let username = document.querySelector('#username').value;
  let password = document.querySelector('#password').value;
  let passwordConfirmation = document.querySelector(
    '#passwordConfirmation'
  ).value;

  const user = {
    user: {
      username,
      password,
    },
  };

  if (password !== passwordConfirmation) {
    $('#passwordConfirmation').addClass('is-invalid');
    return;
  }

  await axios
    .post(`${serverURL}/register`, user, {
      withCredentials: true,
    })
    .then((res) => {
      displayAlert('success', 'Usuário criado com sucesso');
      fetchUsers();
      $('#addUserModal').modal('toggle');
    })
    .catch((err) => {
      displayAlert('danger', 'Não foi possível criar o usuário');
    });
}

function populateAnalytics(analytics) {
  const analyticsTable = document.querySelector('#analyticsTable');

  analyticsTable.innerHTML = '';

  analytics.forEach((a) => {
    analyticsTable.innerHTML += `
			<div class="col-md-6 mb-4">
				<div class="card">
					<div class="card-body">
						<h5 class="card-title">${a.name}</h5>
							<p class="card-text">${a.description}</p>
								<div
								class="d-flex justify-content-between align-items-center"
								>
								${a.type == 'chart' ? `<canvas id="${a.metric}Chart"></canvas>` : `<h1 id="${a.metric}">${a.value}</h1><i class="bi bi-bar-chart"></i>`}
							</div>
					</div>
				</div>
			</div>
		`;

    if (a.type == 'chart') {
      const ctx = document.getElementById(`${a.metric}Chart`);

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: a.value.map((d) => d.name),
          datasets: [
            {
              label: 'Quantidade de likes',
              data: a.value.map((d) => d.value),
              backgroundColor: '#2f329d',
            },
          ],
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  stepSize: 5,
                  max: 20,
                },
              },
            ],
          },
        },
      });
    }
  });
}

async function fetchAnalytics() {
  await axios
    .get(`${serverURL}/analytics`, {
      withCredentials: true,
    })
    .then((res) => {
      populateAnalytics(res.data);
    });
}

async function deleteUser(username) {
  console.log(username);

  await axios
    .delete(`${serverURL}/users/${username}`, {
      withCredentials: true,
    })
    .then((res) => {
      displayAlert('success', 'Usuário deletado com sucesso');
    })
    .catch((err) => {
      displayAlert('danger', 'Não foi possível deletar o usuário');
    });

  fetchUsers();
  $('#deleteUserModal').modal('toggle');
}

$('#deleteUserModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget);
  let username = button.data('username');

  let modal = $(this);
  modal
    .find('#deleteUserConfirmation')
    .attr('onclick', `deleteUser("${username}")`);
});
