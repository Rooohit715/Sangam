document.addEventListener('DOMContentLoaded', () => {
    const pledgeButton = document.getElementById('pledgeButton');
    const pledgeList = document.getElementById('pledgeList');
    const alumniNameInput = document.getElementById('alumniName');
    const pledgeAmountInput = document.getElementById('pledgeAmount');
    const fundCategorySelect = document.getElementById('fundCategory');

    // Simulate pledge tracking
    const pledges = [];

    pledgeButton.addEventListener('click', () => {
        const alumniName = alumniNameInput.value;
        const pledgeAmount = pledgeAmountInput.value;
        const fundCategory = fundCategorySelect.value;

        if (!alumniName || !pledgeAmount || !fundCategory) {
            alert('Please fill in all fields');
            return;
        }

        const newPledge = {
            name: alumniName,
            amount: parseFloat(pledgeAmount),
            category: fundCategory,
            date: new Date().toLocaleDateString()
        };

        pledges.unshift(newPledge);
        updatePledgeHistory();

        // Reset form
        alumniNameInput.value = '';
        pledgeAmountInput.value = '';
        fundCategorySelect.selectedIndex = 0;
    });

    function updatePledgeHistory() {
        pledgeList.innerHTML = '';
        pledges.slice(0, 5).forEach(pledge => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${pledge.name}</strong> pledged 
                $${pledge.amount.toLocaleString()} 
                for ${pledge.category} 
                (${pledge.date})
            `;
            pledgeList.appendChild(listItem);
        });
    }

    // Investment Card Interactivity
    const investButtons = document.querySelectorAll('.invest-button');
    investButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cardTitle = e.target.closest('.investment-card')
                .querySelector('h3').textContent;
            alert(`You're interested in the ${cardTitle}. 
                   Our investment team will contact you shortly.`);
        });
    });

    // Grant Application Interactivity
    const applyButtons = document.querySelectorAll('.apply-button');
    applyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const grantTitle = e.target.closest('.grant-card')
                .querySelector('h3').textContent;
            alert(`Thank you for your interest in the ${grantTitle}. 
                   Please prepare your application documents.`);
        });
    });
});

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

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

// Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

function animateCounters() {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;

        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target.toLocaleString();
        }
    });
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Start animation when stats section is in viewport
const statsSection = document.querySelector('.stats');
let hasAnimated = false;

window.addEventListener('scroll', () => {
    if (isInViewport(statsSection) && !hasAnimated) {
        animateCounters();
        hasAnimated = true;
    }
});

// Testimonial Slider
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentSlide = 0;

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (n + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto-advance slides
let slideInterval = setInterval(nextSlide, 6000);

// Pause auto-advance on hover
const testimonialSlider = document.querySelector('.testimonial-slider');
if (testimonialSlider) {
    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    testimonialSlider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 6000);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile responsive navbar
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        navLinks.classList.remove('show');
    }
});

// Add to fund.js
document.querySelectorAll('.invest-button').forEach(button => {
    button.addEventListener('click', function () {
        const cardTitle = this.parentElement.querySelector('h3').textContent;
        const cardDetails = this.parentElement.querySelector('p').textContent;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'alert-overlay';

        // Create alert box
        const alert = document.createElement('div');
        alert.className = 'investment-alert';

        alert.innerHTML = `
            <h3>${cardTitle} Details</h3>
            <p>${cardDetails}</p>
            <p>This fund focuses on supporting innovative projects that align with our institution's mission to advance technology and research.</p>
            <p>Investment Terms:</p>
            <ul>
                <li>Minimum holding period: 2 years</li>
                <li>Expected ROI: 15-20%</li>
                <li>Quarterly updates and annual meetings</li>
            </ul>
            <div class="alert-buttons">
                <button class="btn close-alert">Close</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(alert);

        // Add event listeners to buttons
        alert.querySelector('.close-alert').addEventListener('click', function () {
            document.body.removeChild(overlay);
            document.body.removeChild(alert);
        });

        alert.querySelector('.invest-alert').addEventListener('click', function () {
            alert("Investment process initiated! Our team will contact you shortly.");
            document.body.removeChild(overlay);
            document.body.removeChild(alert);
        });
    });
});