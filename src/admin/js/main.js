const serverURL = 'http://localhost:3000';

const defaultOptions = {
  withCredentials: true,
};

// Factory function for the event card
function eventTemplateFactory(event) {
	const parsedDate = new Date(event.date).toLocaleString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

  return `
    <div class="card">
      <div class="card-header">
					Evento - <span class="text-subtle"><strong>${parsedDate}</strong></span>
      </div>
      <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
          <div>
          <h5 class="card-title">${event.name}</h5>
          <p class="card-text">
            ${event.description}
          </p>
          </div>
          <div class="d-flex gap-2" style="height: min-content;">
            <button data-bs-toggle="modal" class="btn btn-primary text-white" data-ename=${event.name} data-edescription=${event.description} data-bs-target="#editEventModal"><i class="bi bi-pencil"></i></button>
            <button data-bs-toggle="modal" class="btn btn-danger" data-id="${event._id}" data-bs-target="#deleteEventModal" ><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Factory function for the user card
function userTemplateFactory(user, id) {
  return `
    <div class="card">
      <div class="card-header">
          Usuário #${id}
      </div>
      <div class="card-body">
      <div class="d-flex gap-2 align-items-center justify-content-between">
          <h5>${user.username}</h5>
          <div>
            <button href="#" class="btn btn-primary text-white"><i class="bi bi-pencil"></i></button>
            <button data-bs-toggle="modal" class="btn btn-danger" data-username="${user.username}" data-bs-target="#deleteUserModal"><i class="bi bi-trash"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Factory function for the analytics card
function analyticsTemplateFactory(analytics) {
  return `
    <div class="col-md-6 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${analytics.name}</h5>
            <p class="card-text">${analytics.description}</p>
              <div
              class="d-flex justify-content-between align-items-center"
              >
              ${analytics.type == 'chart' ? `<canvas id="${analytics.metric}Chart"></canvas>` : `<h1 id="${analytics.metric}">${analytics.value}</h1><i class="bi bi-bar-chart"></i>`}
            </div>
        </div>
      </div>
    </div>
  `;
}

// Displays an alert on the screen
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

  const alert = document.createElement('div');
  alert.id = 'feedbackAlert';
  alert.className = `alert alert-${type} show fade d-flex align-items-center gap-4`;
  alert.innerHTML = icon;
  alert.innerHTML += message;

  var main = document.querySelector('main');
  main.appendChild(alert);

  setTimeout(() => {
    $('#feedbackAlert').alert('close');
  }, 5000);
}

// Populates the events list with the events fetched from the server
function populateEvents(events) {
	events = events.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    eventList.innerHTML += eventTemplateFactory(e);
  });
}

// Populates the users list with the users fetched from the server
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
    userList.innerHTML += userTemplateFactory(u, users.indexOf(u) + 1);
  });
}

// Fetches the analytics from the server and populates the analytics table
function populateAnalytics(analytics) {
  const analyticsTable = document.querySelector('#analyticsTable');

  analyticsTable.innerHTML = '';

  analytics.forEach((a) => {
    analyticsTable.innerHTML += analyticsTemplateFactory(a);

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

// Checks if the user is logged in, if not, redirects to the login page
async function checkLogin() {
	await axios
		.get(`${serverURL}/auth`, defaultOptions).then(() => {
			if (window.location.pathname === '/src/admin/') {
				window.location.href = '/src/admin/dashboard';
			}
		})
		.catch((err) => {
			if (window.location.pathname !== '/src/admin/') {
				window.location.href = '/src/admin';
			}
		});
}

// Logs the user in
async function login() {
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const remember = document.getElementById('remember');

  const data = {
    username: email.value,
    password: password.value,
    remember: remember.checked,
  };

  await axios
    .post(`${serverURL}/login`, data, {
      withCredentials: true,
    })
    .then((res) => {
      window.location.href = '/src/admin/dashboard';
    })
    .catch((err) => {
      email.classList.add('is-invalid');
      password.classList.add('is-invalid');

      let alert = document.querySelector('.alert');
      alert.className = `alert alert-danger show`;
      alert.classList.remove('d-none');

      setTimeout(() => {
        alert.classList.remove('show');
        alert.classList.add('d-none');
      }, 5000);
    });
}

// Logout
async function logout() {
	await axios.delete(`${serverURL}/logout`, defaultOptions).then(() => {
		window.location.href = '/src/admin';
	}).catch((err) => {
		displayAlert('danger', 'Não foi possível efetuar o logout');
	});

  // Delay and display alert
  setTimeout(() => {
    displayAlert('success', 'Logout efetuado com sucesso');
  }, 2000);
}

// Registers a new user
async function createUser() {
  let username = document.querySelector('#username');
  let password = document.querySelector('#password');
  let passwordConfirmation = document.querySelector('#passwordConfirmation');

  const user = {
    user: {
      username: username.value,
      password: password.value,
    },
  };

  if (password.value.length < 8) {
    $('#password').addClass('is-invalid');
    return;
  } else if (password.value !== passwordConfirmation.value) {
    $('#passwordConfirmation').addClass('is-invalid');
    return;
  }

  await axios
    .post(`${serverURL}/register`, user, defaultOptions)
    .then((res) => {
      $('#addUserModal').modal('toggle');
      displayAlert('success', 'Usuário criado com sucesso');
    })
    .catch((err) => {
      $('#addUserModal').modal('toggle');
      displayAlert('danger', 'Não foi possível criar o usuário');
    });

  fetchUsers();
}

// Fetches the analytics from the server
async function fetchAnalytics() {
  await axios
    .get(`${serverURL}/analytics`, defaultOptions)
    .then((res) => {
      populateAnalytics(res.data);
    })
    .catch((err) => {
      displayAlert('danger', 'Não foi possível carregar as análises');
    });
}

// Fetches the events from the server
async function fetchEvents() {
  await axios
    .get(`${serverURL}/events`)
    .then((res) => {
      populateEvents(res.data);
      $('#actionButton').removeClass('disabled');
    })
    .catch((err) => {
      displayAlert('danger', 'Não foi possível carregar os eventos');
    });
}
  
// Fetches the users from the server
async function fetchUsers() {
    await axios
    .get(`${serverURL}/users`, defaultOptions)
    .then((res) => {
      populateUsers(res.data);
      $('#actionButton').removeClass('disabled');
    })
    .catch((err) => {
      displayAlert('danger', 'Não foi possível carregar os usuários');
    });
}

// Creates a new event
async function createNewEvent() {
  let eventName = document.querySelector('#addEventModal #eventName');
  let eventDescription = document.querySelector('#addEventModal #eventDescription');
  let eventImage = document.querySelector('#addEventModal #eventImage');
	let eventDate = document.querySelector('#addEventModal #eventDate');

  const event = {
    name: eventName.value,
    description: eventDescription.value,
    image: eventImage.files[0],
		date: eventDate.value,
  };

  await axios
    .post(`${serverURL}/events`, event, {
      ...defaultOptions,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
      $('#addEventModal').modal('toggle');
      displayAlert('success', 'Evento criado com sucesso');
    })
    .catch((err) => {
      $('#addEventModal').modal('toggle');
      displayAlert('danger', 'Não foi possível criar o evento');
    });

  await fetchEvents();
}

// Deletes an event
async function deleteEvent(id) {
  await axios
    .delete(`${serverURL}/events/${id}`, defaultOptions)
    .then((res) => {
      $('#deleteEventModal').modal('toggle');
      displayAlert('success', 'Evento deletado com sucesso');
    })
    .catch((err) => {
      $('#deleteEventModal').modal('toggle');
      displayAlert('danger', 'Não foi possível deletar o evento');
    });

  await fetchEvents();
}

// Deletes a user
async function deleteUser(username) {
  await axios
    .delete(`${serverURL}/users/${username}`, defaultOptions)
    .then((res) => {
      $('#deleteUserModal').modal('toggle');
      displayAlert('success', 'Usuário deletado com sucesso');
    })
    .catch((err) => {
      $('#deleteUserModal').modal('toggle');
      displayAlert('danger', 'Não foi possível deletar o usuário');
    });

  fetchUsers();
}

// Changes the user password
async function changePassword() {
	// Get token from URL http://localhost:3000/src/recover?token=123
	let token = new URLSearchParams(window.location.search).get('token');
	let password = document.querySelector('#newPassword');
	let passwordConfirmation = document.querySelector('#newPasswordConfirmation');

	if (token === null) {
		displayAlert('danger', 'Token inválido');
		return;
	}

	if (password.value.length < 8) {
		$('#newPassword').addClass('is-invalid');
		return;
	} else if (password.value !== passwordConfirmation.value) {
		$('#newPasswordConfirmation').addClass('is-invalid');
		return;
	}

	await axios.post(`${serverURL}/changePassword/${token}`, { password: password.value }, defaultOptions).then((res) => {
		displayAlert('success', 'Senha alterada com sucesso');
	}).catch((err) => {
		displayAlert('danger', 'Não foi possível alterar a senha');
	});
}

// Sends recovery email
async function sendRecoveryEmail() {
	let email = document.querySelector('#recoveryEmail');

	await axios
		.post(`${serverURL}/recover`, { user: {username: email.value} }, defaultOptions)
		.then((res) => {
			displayAlert('success', 'Email de recuperação enviado com sucesso');
		})
		.catch((err) => {
			displayAlert('danger', 'Não foi possível enviar o email de recuperação');
		});
}

// Sets the event listeners for the modals
$('#deleteUserModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget);
  let username = button.data('username');

  let modal = $(this);
  modal
    .find('#deleteUserConfirmation')
    .attr('onclick', `deleteUser("${username}")`);
});

$('#deleteEventModal').on('show.bs.modal', function (event) {
  let button = $(event.relatedTarget);
  let id = button.data('id');

  let modal = $(this);
  console.log(id);
  modal.find('#deleteConfirmation').attr('onclick', `deleteEvent("${id}")`);
});

$('#editEventModal').on('show.bs.modal', function (event) {
	let button = $(event.relatedTarget);
	let name = button.data('ename');
	let description = button.data('edescription');

	let modal = $(this);
	modal.find('#eventName').val(name);
	modal.find('#eventDescription').val(description);
});
