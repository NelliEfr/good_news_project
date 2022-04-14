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
      console.log(entryValue.value)
      button.innerHTML += `<button type="button" class="btn btn-success btn-sm">${entryValue.value}</button>`
    }
    if (buttonParams.id === 'bad' && entryValue.value.length >= 1) {
      button.innerHTML += `<button type="button" class="btn btn-danger btn-sm">${entryValue.value}</button>`
    }
  });
