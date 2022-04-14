const button = document.getElementById('tegs');
const entryValue = document.querySelector('input')

document
  .buttons
  .addEventListener('submit', async (event) => {
    event.preventDefault();
      const buttonParams = {
      id: event.submitter.id,
    };
    if (buttonParams.id === 'good' && entryValue.value.length >= 1) {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: entryValue.value,
        }),
      });
    
      const registrationResponse = await response.json();
  
      button.innerHTML += `<button type="button" class="btn btn-success btn-sm">${registrationResponse}</button>`
    }
    if (buttonParams.id === 'bad' && entryValue.value.length >= 1) {
      button.innerHTML += `<button type="button" class="btn btn-danger btn-sm">${entryValue.value}</button>`
    }
  });
