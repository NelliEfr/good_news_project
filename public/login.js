const form = document.querySelector('.loginForm');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { name, password, email } = event.target;
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.value,
      password: password.value,
    }),
  });
  const registrationResponse = await response.json();
  if (registrationResponse === 'errors') {
    name.value = '';
    password.value = '';
    name.placeholder = 'Неверный логин';
    password.placeholder = 'Неверный пароль';
  } else {
    window.location.assign('/');
  }
});
