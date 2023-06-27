
// Function to handle form submission
function handleSubmit(event) {
 event.preventDefault(); // Prevent the form from submitting

 // Get the input value
 const input = document.querySelector('.input');
 const url = input.value;

 

 // Clear the input field
 input.value = '';
}

// Get the form element
const form = document.querySelector('form');

// Add an event listener to the form's submit event
form.addEventListener('submit', handleSubmit);
