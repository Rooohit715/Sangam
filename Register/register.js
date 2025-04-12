document.addEventListener('DOMContentLoaded', function () {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        window.location.href = '../dash.html';
        return;
    }

    // Get registration form
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    // Add error message div if it doesn't exist
    if (!document.getElementById('errorMessage')) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = 'errorMessage';
        errorDiv.style.display = 'none';
        registerForm.insertBefore(errorDiv, registerForm.firstChild);
    }

    // Add success message div if it doesn't exist
    if (!document.getElementById('successMessage')) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.id = 'successMessage';
        successDiv.style.display = 'none';
        registerForm.insertBefore(successDiv, registerForm.firstChild);
    }

    // Handle form submission
    registerForm.addEventListener('submit', handleRegister);

    // Add password validation
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function () {
            validatePasswords(passwordInput, confirmPasswordInput);
        });

        passwordInput.addEventListener('input', function () {
            if (confirmPasswordInput.value) {
                validatePasswords(passwordInput, confirmPasswordInput);
            }
        });
    }
});

// Validate that passwords match
function validatePasswords(passwordInput, confirmPasswordInput) {
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.setCustomValidity("Passwords don't match");
    } else {
        confirmPasswordInput.setCustomValidity('');
    }
}

// Handle registration form submission
function handleRegister(e) {
    e.preventDefault();

    // Get form fields
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    const education = document.getElementById('education').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const interests = document.getElementById('interests').value.trim();

    // Get message elements
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Reset messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Validate required fields
    if (!fullName || !email || !password || !confirmPassword || !role) {
        displayError('Please fill in all required fields');
        return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
        displayError('Please enter a valid email address');
        return;
    }

    // Validate password match
    if (password !== confirmPassword) {
        displayError('Passwords do not match');
        return;
    }

    // Validate password strength
    if (password.length < 6) {
        displayError('Password must be at least 6 characters long');
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        displayError('Email is already registered');
        return;
    }

    // Create new user object
    const newUser = {
        id: generateUserId(),
        fullName,
        email,
        password, // In a real app, hash this password
        role,
        education,
        experience,
        interests,
        createdAt: new Date().toISOString()
    };

    // Save user to local storage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message
    successMessage.textContent = 'Registration successful! Redirecting to login...';
    successMessage.style.display = 'block';

    // Redirect to login page after delay
    setTimeout(() => {
        window.location.href = '../Login/login.html';
    }, 2000);
}

// Display error message
function displayError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';

    // Scroll to error message
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Generate unique user ID
function generateUserId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}