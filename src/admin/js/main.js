const serverURL = 'http://localhost:3000';

async function login() {
	const email = document.getElementById('email').value;
	const password = document.getElementById('password').value;
	const remember = document.getElementById('remember').checked;

	const data = {
		username: email,
		password,
		remember
	};

	await axios.post(`${serverURL}/login`, data, {
		withCredentials: remember
	}).then((res) => {
		window.location.href = '/src/admin/dashboard';
	}).catch((err) => {
		let alert = document.querySelector(".alert");
		alert.className = `alert alert-danger show`;
		alert.classList.remove("d-none");

		setTimeout(() => {
			alert.classList.remove("show");
			alert.classList.add("d-none");
		}, 5000);
	});
}

function populateEvents(events){
	const eventList = document.querySelector("#eventList")
	eventList.innerHTML = '';

	events.forEach((e) => {
		eventList.innerHTML += `
		    <div class="card">
			<div class="card-header">
			    Eventos
			</div>
			<div class="card-body">
			    <h5 class="card-title">${e.name}</h5>
			    <p class="card-text">
				${e.description}
			    </p>
			    <a href="#" class="btn btn-primary text-white">Editar</a>
			    <button onclick='deleteEvent(${e.id})' class="btn btn-danger">Excluir</button>
			</div>
		    </div>
		`
	})
}

async function fetchEvents() {
	await axios.get(`${serverURL}/events`).then((res) => {
		populateEvents(res.data);
	});
}

async function createNewEvent() {
	let eventName = document.querySelector("#eventName").value;
	let eventDescription = document.querySelector("#eventDescription").value;
	let eventImage = document.querySelector("#eventImage").files[0];

	const event = {
		name: eventName,
		description: eventDescription,
		image: eventImage
	}

	console.log(event)

	await axios.post(`${serverURL}/events`, event, {
		withCredentials: true,
		headers: {
			"Content-Type": "multipart/form-data"
		}
	});
	await fetchEvents();
}

async function deleteEvent(id) {
	await axios.delete(`${serverURL}/events/${id}`, {
		withCredentials: true,
	});
	await fetchEvents();
}
