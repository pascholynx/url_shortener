// Select form and output div
const form = document.querySelector('.paste form');
const input = document.querySelector('.input');

// Add event listener for form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the URL from the input field
    const urlToShorten = input.value;

    // Set up the POST request body
    const requestBody = {
        url: urlToShorten
    };

    // Make the request to the server
    fetch('/api/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        // Display the shortened URL
        alert(`Your shortened URL is: http://localhost:3000/${data.shortenedUrl}`);
    })
    .catch(err => {
        console.error('Error:', err);
        alert('There was an error shortening your URL. Please try again.');
    });

    // Clear the input field after form submission
    input.value = '';
    // Select login form
const loginForm = document.querySelector('.form form');

// Add event listener for form submission
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the username and password from the input fields
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Set up the POST request body
    const requestBody = {
        username: username,
        password: password
    };

    // Make the request to the server
    fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            // Display error message
            alert(data.error);
        } else {
            // Redirect to home page upon successful login
            window.location.href = '/myHTML/index.html';
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('There was an error logging in. Please try again.');
    });
});
// Select signup form
const signupForm = document.querySelector('.form form');

// Add event listener for form submission
signupForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the input field values
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email-id').value;
    const password = document.getElementById('password').value;

    // Set up the POST request body
    const requestBody = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password
    };

    // Make the request to the server
    fetch('/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            // Display error message
            alert(data.error);
        } else {
            // Redirect to login page upon successful signup
            window.location.href = '/myHTML/login.html';
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('There was an error creating your account. Please try again.');
    });
});
});
