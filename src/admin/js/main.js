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