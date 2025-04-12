// Check if user is already logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;

    if (isLoggedIn && (currentPage.includes('../Login/login.html') || currentPage.includes('../Register/register.html') || currentPage === '/')) {
        // If logged in and on login/register page, redirect to dashboard
        window.location.href = '../dash.html';
    } else if (!isLoggedIn && currentPage.includes('dashboard.html')) {
        // If not logged in and on dashboard, redirect to login
        window.location.href = '../Login/login.html';
    }
}

// Run auth check when page loads
document.addEventListener('DOMContentLoaded', function () {
    checkAuth();

    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Add error message div
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = 'errorMessage';
        registerForm.insertBefore(errorDiv, registerForm.firstChild);

        // Add success message div
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.id = 'successMessage';
        registerForm.insertBefore(successDiv, registerForm.firstChild);

        registerForm.addEventListener('submit', handleRegister);
    }

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Add error message div
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = 'errorMessage';
        loginForm.insertBefore(errorDiv, loginForm.firstChild);

        loginForm.addEventListener('submit', handleLogin);
    }
});

// Handle registration
function handleRegister(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('role').value;
    const education = document.getElementById('education').value.trim();
    const experience = document.getElementById('experience').value.trim();
    const interests = document.getElementById('interests').value.trim();

    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    // Reset messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';

    // Validate form
    if (!fullName || !email || !password || !confirmPassword || !role) {
        errorMessage.textContent = 'Please fill in all required fields';
        errorMessage.style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        errorMessage.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters';
        errorMessage.style.display = 'block';
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        errorMessage.textContent = 'Email is already registered';
        errorMessage.style.display = 'block';
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        password, // In a real app, use proper hashing
        role,
        education,
        experience,
        interests,
        createdAt: new Date().toISOString()
    };

    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Show success message
    successMessage.textContent = 'Registration successful! Redirecting to login...';
    successMessage.style.display = 'block';

    // Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = '../Login/login.html';
    }, 2000);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Reset error message
    errorMessage.style.display = 'none';

    // Validate form
    if (!email || !password) {
        errorMessage.textContent = 'Please enter both email and password';
        errorMessage.style.display = 'block';
        return;
    }

    // Check credentials
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        errorMessage.textContent = 'Invalid email or password';
        errorMessage.style.display = 'block';
        return;
    }

    // Set login state
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
    }));

    // Redirect to dashboard
    window.location.href = '../dash.html';
}