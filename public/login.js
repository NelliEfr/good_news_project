document.loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { password, email } = event.target;
  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });

  const registrationResponse = await response.json();
  if (registrationResponse === 'errors') {
    email.value = '';
    password.value = '';
    email.placeholder = 'Неверный логин';
    password.placeholder = 'Неверный пароль';
  } else {
    window.location.assign('/');
  }
});
