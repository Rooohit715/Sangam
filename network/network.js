
document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = '../Login/login.html';
        return;
    }

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = '../Login/login.html';
        return;
    }

    // Set user greeting
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) {
        userGreeting.textContent = `Welcome, ${currentUser.fullName}!`;
    }

    // Display profile info
    displayProfileInfo(currentUser.id);

    // Logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Display user profile information
function displayProfileInfo(userId) {
    const profileInfo = document.getElementById('profileInfo');
    if (!profileInfo) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(user => user.id === userId);

    if (!user) {
        profileInfo.innerHTML = '<p>Error loading profile information</p>';
        return;
    }

    // Create profile HTML
    let html = `
        <div class="profile-detail">
            <strong>Name:</strong> ${user.fullName}
        </div>
        <div class="profile-detail">
            <strong>Email:</strong> ${user.email}
        </div>
        <div class="profile-detail">
            <strong>Role:</strong> ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </div>
    `;

    if (user.education) {
        html += `
            <div class="profile-detail">
                <strong>Education:</strong>
                <p>${user.education}</p>
            </div>
        `;
    }

    if (user.experience) {
        html += `
            <div class="profile-detail">
                <strong>Experience:</strong>
                <p>${user.experience}</p>
            </div>
        `;
    }

    if (user.interests) {
        html += `
            <div class="profile-detail">
                <strong>Interests:</strong>
                <p>${user.interests}</p>
            </div>
        `;
    }

    profileInfo.innerHTML = html;
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = '../Login/login.html';
}

