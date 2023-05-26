document
  .getElementById('storyForm')
  .addEventListener('submit', function (event) {
    var titleInput = document.getElementById('title');
    var bodyInput = document.getElementById('body');
    // var isValid = true;

    // if (titleInput.value.trim() === '') {
    //   titleInput.classList.add('invalid');
    //   isValid = false;
    // } else {
    //   titleInput.classList.remove('invalid');
    // }

    // if (bodyInput.value.trim() === '') {
    //   bodyInput.classList.add('invalid');
    //   isValid = false;
    // } else {
    //   bodyInput.classList.remove('invalid');
    // }

    // Check if input contains only whitespace
    if (
      titleInput.value.trim().length === 0 ||
      bodyInput.value.trim().length === 0
    ) {
      event.preventDefault();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields',
      });
    }
  });
