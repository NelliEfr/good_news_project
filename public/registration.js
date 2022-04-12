const form = document.querySelector('.registrationForm');
console.log(form);
form.addEventListener('submit', async (event) => {
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
  console.log(registrationResponse);
  if (registrationResponse.hasOwnProperty('errors')) {
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
