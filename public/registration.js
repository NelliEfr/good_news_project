document.registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const { name, password, email } = event.target;
  const response = await fetch('/registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.value,
      password: password.value,
      email: email.value,
    }),
  });
  const registrationResponse = await response.json();
  window.location.assign('/');
  if (registrationResponse === 'errors') {
    name.value = '';
    password.value = '';
    email.value = '';
    name.placeholder = 'ОБЯЗАТЕЛЬНОЕ ПОЛЕ ДЛЯ ЗАПОЛНЕНИЯ';
    password.placeholder = 'ОБЯЗАТЕЛЬНОЕ ПОЛЕ ДЛЯ ЗАПОЛНЕНИЯ';
    email.placeholder = 'ОБЯЗАТЕЛЬНОЕ ПОЛЕ ДЛЯ ЗАПОЛНЕНИЯ';
  } else {
    window.location.assign('/');
  }
});
