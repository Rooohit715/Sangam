
    let proposals = JSON.parse(localStorage.getItem('proposals')) || [];
    let currentProposalId = null;
    let currentCategory = 'all';

    // Templates for different categories
    const templates = {
        'Tech': [
    {id: 'techStack', label: 'Technology Stack', type: 'text' },
    {id: 'targetUsers', label: 'Target Users', type: 'text' },
    {id: 'marketAnalysis', label: 'Market Analysis', type: 'textarea' },
    {id: 'implementationTimeline', label: 'Implementation Timeline', type: 'text' }
    ],
    'Healthcare': [
    {id: 'patientImpact', label: 'Patient Impact', type: 'textarea' },
    {id: 'clinicalEvidence', label: 'Clinical Evidence', type: 'textarea' },
    {id: 'regulatoryCompliance', label: 'Regulatory Compliance', type: 'text' },
    {id: 'costAnalysis', label: 'Cost Analysis', type: 'textarea' }
    ],
    'Social Impact': [
    {id: 'targetCommunity', label: 'Target Community', type: 'text' },
    {id: 'impactMetrics', label: 'Impact Metrics', type: 'textarea' },
    {id: 'sustainability', label: 'Sustainability Plan', type: 'textarea' },
    {id: 'communityInvolvement', label: 'Community Involvement', type: 'textarea' }
    ],
    'Education': [
    {id: 'learningObjectives', label: 'Learning Objectives', type: 'textarea' },
    {id: 'targetAudience', label: 'Target Audience', type: 'text' },
    {id: 'assessmentMethod', label: 'Assessment Method', type: 'textarea' },
    {id: 'resourceRequirements', label: 'Resource Requirements', type: 'textarea' }
    ],
    'Environmental': [
    {id: 'environmentalImpact', label: 'Environmental Impact', type: 'textarea' },
    {id: 'sustainabilityMetrics', label: 'Sustainability Metrics', type: 'textarea' },
    {id: 'regulatoryCompliance', label: 'Regulatory Compliance', type: 'text' },
    {id: 'implementationPlan', label: 'Implementation Plan', type: 'textarea' }
    ]
        };

    // Category descriptions and guidelines
    const categoryInfo = {
        'Tech': {
        icon: '💻',
    description: 'Technology proposals focus on software, hardware, or digital solutions that address specific problems or needs.',
    guidelines: 'Include details about your tech stack, implementation timeline, and potential market impact.',
    exampleTitle: 'AI-Powered Recommendation Engine',
    class: 'tech'
            },
    'Healthcare': {
        icon: '🏥',
    description: 'Healthcare proposals focus on improving patient outcomes, medical procedures, or healthcare systems.',
    guidelines: 'Include clinical evidence, regulatory considerations, and patient impact assessment.',
    exampleTitle: 'Remote Patient Monitoring System',
    class: 'healthcare'
            },
    'Social Impact': {
        icon: '👥',
    description: 'Social Impact proposals focus on initiatives that address social challenges and improve community well-being.',
    guidelines: 'Include target communities, impact metrics, and sustainability plans.',
    exampleTitle: 'Community Resource Sharing Platform',
    class: 'social'
            },
    'Education': {
        icon: '🎓',
    description: 'Education proposals focus on improving learning outcomes, educational access, or teaching methodologies.',
    guidelines: 'Include learning objectives, assessment methods, and target audience details.',
    exampleTitle: 'Personalized Learning Platform',
    class: 'education'
            },
    'Environmental': {
        icon: '🌿',
    description: 'Environmental proposals focus on sustainability, conservation, or addressing environmental challenges.',
    guidelines: 'Include environmental impact assessment, sustainability metrics, and implementation plans.',
    exampleTitle: 'Smart Waste Management System',
    class: 'environmental'
            }
        };

    // Handle category button click
    function handleCategoryClick(category) {
        // Update active category
        document.querySelectorAll('.category-button').forEach(button => {
            button.classList.remove('active');
        });
    document.getElementById(`cat-${category === 'all' ? 'all' : category}`).classList.add('active');

    currentCategory = category;

    if (category === 'all') {
        // Show all proposals
        renderProposalList('all');
    document.getElementById('categoryDetail').classList.add('hidden');
    updateCategoryStats();
    document.getElementById('categoryStats').classList.remove('hidden');

    // Switch to form view
    document.getElementById('formView').classList.remove('hidden');
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('categoryView').classList.add('hidden');
            } else {
                // Show specific category detail
                const categoryClass = getCategoryClass(category);
                const categoryCount = proposals.filter(p => p.category === category).length;

    document.getElementById('categoryDetail').innerHTML = `
    <div class="category-detail ${categoryClass}">
        <h3>${categoryInfo[category].icon} ${category}</h3>
        <p>${categoryInfo[category].description}</p>
        <p><strong>Guidelines:</strong> ${categoryInfo[category].guidelines}</p>
        <p><strong>Proposals:</strong> ${categoryCount} ${categoryCount === 1 ? 'proposal' : 'proposals'}</p>

        <div class="template-preview">
            <h4>Required information:</h4>
            <ul>
                ${templates[category].map(field => `<li>${field.label}</li>`).join('')}
            </ul>
        </div>

        <div class="category-action-buttons">
            <div class="category-action-button" onclick="showCategoryProposals('${category}')">View Proposals</div>
            <div class="category-action-button" onclick="createProposalInCategory('${category}')">Create Proposal</div>
        </div>
    </div>
    `;

    document.getElementById('categoryDetail').classList.remove('hidden');
    document.getElementById('categoryStats').classList.add('hidden');

    // Show category detail in main view as well
    document.getElementById('categoryContent').innerHTML = `
    <div class="category-detail ${categoryClass}">
        <h2>${categoryInfo[category].icon} ${category} Proposals</h2>
        <p>${categoryInfo[category].description}</p>

        <div class="template-preview">
            <h3>Example: ${categoryInfo[category].exampleTitle}</h3>
            <p>This is an example proposal that demonstrates the expected format and level of detail for a ${category} proposal.</p>

            <h4>Required Fields:</h4>
            <ul>
                ${templates[category].map(field => `<li><strong>${field.label}:</strong> Sample content for ${field.label.toLowerCase()}</li>`).join('')}
            </ul>
        </div>

        <h3>Current ${category} Proposals (${categoryCount})</h3>
    </div>
    `;

    // Render proposals for this category
    renderProposalList(category);

    // Switch to category view
    document.getElementById('formView').classList.add('hidden');
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('categoryView').classList.remove('hidden');
            }
        }

    // Show proposals for a specific category
    function showCategoryProposals(category) {
        renderProposalList(category);
    handleCategoryClick(category);
        }

    // Create a new proposal in a specific category
    function createProposalInCategory(category) {
        resetForm();
    document.getElementById('category').value = category;
    loadTemplate();

    // Switch to form view
    document.getElementById('formView').classList.remove('hidden');
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('categoryView').classList.add('hidden');
        }

    // Get category class for styling
    function getCategoryClass(category) {
            if (category === 'Social Impact') return 'social';
    return category.toLowerCase();
        }

    // Update category statistics
    function updateCategoryStats() {
            // Count proposals by category
            const categoryCounts = { };
            proposals.forEach(proposal => {
                if (!categoryCounts[proposal.category]) {
        categoryCounts[proposal.category] = 0;
                }
    categoryCounts[proposal.category]++;
            });

    const statsContent = document.getElementById('statsContent');
    statsContent.innerHTML = '';

    // Calculate total proposals
    const totalProposals = proposals.length;

    // Add total stat
    const totalStat = document.createElement('div');
    totalStat.className = 'stat-item';
    totalStat.innerHTML = `
    <strong>Total Proposals:</strong>
    <span>${totalProposals}</span>
    `;
    statsContent.appendChild(totalStat);

    // Add category stats
    for (const category in categoryInfo) {
                const count = categoryCounts[category] || 0;
                const percentage = totalProposals > 0 ? Math.round((count / totalProposals) * 100) : 0;

    const statItem = document.createElement('div');
    statItem.className = 'stat-item';
    statItem.innerHTML = `
    <div>
        <span>${categoryInfo[category].icon}</span>
        <strong>${category}:</strong>
    </div>
    <div>
        <span>${count} (${percentage}%)</span>
    </div>
    `;
    statsContent.appendChild(statItem);
            }

            // Add recently modified stat
            if (totalProposals > 0) {
                const sortedProposals = [...proposals].sort((a, b) =>
    new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    const recentStat = document.createElement('div');
    recentStat.className = 'stat-item';
    recentStat.innerHTML = `
    <strong>Recently Updated:</strong>
    <span>${sortedProposals[0].title}</span>
    `;
    statsContent.appendChild(recentStat);
            }
        }

    // Load appropriate template based on category selection
    function loadTemplate() {
            const category = document.getElementById('category').value;
    const templateFieldsDiv = document.getElementById('templateFields');
    templateFieldsDiv.innerHTML = '';

    if (!category) return;

    const fields = templates[category];

            fields.forEach(field => {
                const fieldDiv = document.createElement('div');
    fieldDiv.className = 'form-group';

    const label = document.createElement('label');
    label.setAttribute('for', field.id);
    label.textContent = field.label;

    let input;
    if (field.type === 'textarea') {
        input = document.createElement('textarea');
                } else {
        input = document.createElement('input');
    input.type = field.type;
                }

    input.id = field.id;
    input.name = field.id;

    fieldDiv.appendChild(label);
    fieldDiv.appendChild(input);
    templateFieldsDiv.appendChild(fieldDiv);
            });
        }

    // Save a new proposal or update an existing one
    function saveProposal() {
            const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    if (!title || !category || !description) {
        alert('Please fill in all required fields.');
    return;
            }

    // Get template-specific fields
    const templateData = { };
    if (category && templates[category]) {
        templates[category].forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                templateData[field.id] = element.value;
            }
        });
            }

    const currentDate = new Date();
    const dateString = currentDate.toISOString();

    if (currentProposalId === null) {
                // Create new proposal
                const newProposal = {
        id: Date.now().toString(),
    title,
    category,
    description,
    templateData,
    createdAt: dateString,
    updatedAt: dateString,
    versions: [
    {
        id: '1',
    title,
    category,
    description,
    templateData,
    createdAt: dateString
                        }
    ]
                };

    proposals.push(newProposal);
            } else {
                // Update existing proposal
                const proposalIndex = proposals.findIndex(p => p.id === currentProposalId);

    if (proposalIndex !== -1) {
                    const currentProposal = proposals[proposalIndex];
    const versionNumber = currentProposal.versions.length + 1;

    // Create new version
    const newVersion = {
        id: versionNumber.toString(),
    title,
    category,
    description,
    templateData,
    createdAt: dateString
                    };

    // Update proposal
    proposals[proposalIndex] = {
        ...currentProposal,
        title,
        category,
        description,
        templateData,
        updatedAt: dateString,
    versions: [...currentProposal.versions, newVersion]
                    };
                }

    currentProposalId = null;
            }

    localStorage.setItem('proposals', JSON.stringify(proposals));
    resetForm();
    renderProposalList(currentCategory);
    updateCategoryStats();

    // Update category detail if we're on a category page
    if (currentCategory !== 'all') {
        handleCategoryClick(currentCategory);
            }

    // Switch to list view
    document.getElementById('formView').classList.remove('hidden');
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('categoryView').classList.add('hidden');
}
        

// Render the list of proposals
function renderProposalList(filterCategory = 'all') {
    const proposalList = document.getElementById('proposalList');
    proposalList.innerHTML = '';

    let filteredProposals = proposals;

    // Apply category filter if not 'all'
    if (filterCategory !== 'all') {
        filteredProposals = proposals.filter(p => p.category === filterCategory);
    }

    // Apply search filter if there's a search term
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredProposals = filteredProposals.filter(p =>
            p.title.toLowerCase().includes(searchTerm) ||
            p.description.toLowerCase().includes(searchTerm)
        );
    }

    // Sort by most recent first
    filteredProposals.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if (filteredProposals.length === 0) {
        proposalList.innerHTML = '<p>No proposals found. Create a new one!</p>';
        return;
    }

    // Create list items for each proposal
    filteredProposals.forEach(proposal => {
        const li = document.createElement('li');
        li.className = `proposal-item ${getCategoryClass(proposal.category)}`;
        li.onclick = () => showProposalDetail(proposal.id);

        const date = new Date(proposal.updatedAt);
        const formattedDate = date.toLocaleDateString();

        li.innerHTML = `
                    <div class="proposal-title">${proposal.title}</div>
                    <div class="proposal-category">
                        ${proposal.category} 
                        <span class="badge ${getCategoryClass(proposal.category)}">v${proposal.versions.length}</span>
                    </div>
                    <div class="proposal-date">Updated: ${formattedDate}</div>
                `;

        proposalList.appendChild(li);
    });

    // If in category view, also render proposals there
    if (document.getElementById('categoryView').classList.contains('hidden') === false && filterCategory !== 'all') {
        const categoryProposals = document.createElement('div');
        categoryProposals.className = 'proposal-list';

        filteredProposals.forEach(proposal => {
            const proposalDiv = document.createElement('div');
            proposalDiv.className = `proposal-item ${getCategoryClass(proposal.category)}`;
            proposalDiv.onclick = () => showProposalDetail(proposal.id);

            const date = new Date(proposal.updatedAt);
            const formattedDate = date.toLocaleDateString();

            proposalDiv.innerHTML = `
                        <div class="proposal-title">${proposal.title}</div>
                        <div class="proposal-date">Updated: ${formattedDate}</div>
                        <p>${proposal.description.substring(0, 100)}${proposal.description.length > 100 ? '...' : ''}</p>
                    `;

            categoryProposals.appendChild(proposalDiv);
        });

        document.getElementById('categoryContent').appendChild(categoryProposals);
    }
}

// Show proposal details
function showProposalDetail(id) {
    const proposal = proposals.find(p => p.id === id);
    if (!proposal) return;

    currentProposalId = id;

    const detailView = document.getElementById('proposalDetail');
    const categoryClass = getCategoryClass(proposal.category);

    // Format the date
    const updatedDate = new Date(proposal.updatedAt);
    const formattedDate = updatedDate.toLocaleDateString() + ' ' + updatedDate.toLocaleTimeString();

    // Build the template data HTML
    let templateDataHTML = '';
    if (proposal.templateData && Object.keys(proposal.templateData).length > 0) {
        templateDataHTML = '<div class="template-data">';
        templates[proposal.category].forEach(field => {
            if (proposal.templateData[field.id]) {
                templateDataHTML += `
                            <div class="form-group">
                                <strong>${field.label}:</strong>
                                <p>${proposal.templateData[field.id]}</p>
                            </div>
                        `;
            }
        });
        templateDataHTML += '</div>';
    }

    detailView.innerHTML = `
                <h2>${proposal.title}</h2>
                <p class="proposal-category">
                    <span class="badge ${categoryClass}">${proposal.category}</span>
                    <span class="proposal-date">Last updated: ${formattedDate}</span>
                </p>
                <div class="category-detail ${categoryClass}" style="margin-top: 10px; padding: 10px;">
                    <h3>Description</h3>
                    <p>${proposal.description}</p>
                </div>
                ${templateDataHTML}
            `;

    // Render version history
    renderVersionHistory(proposal);

    // Switch to detail view
    document.getElementById('formView').classList.add('hidden');
    document.getElementById('detailView').classList.remove('hidden');
    document.getElementById('categoryView').classList.add('hidden');
}

// Render version history for a proposal
function renderVersionHistory(proposal) {
    const versionList = document.getElementById('versionList');
    versionList.innerHTML = '';

    const sortedVersions = [...proposal.versions].sort((a, b) =>
        parseInt(b.id) - parseInt(a.id)
    );

    sortedVersions.forEach(version => {
        const versionDiv = document.createElement('div');
        versionDiv.className = 'version-item';

        const date = new Date(version.createdAt);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        versionDiv.innerHTML = `
                    <div>
                        <strong>Version ${version.id}</strong>
                        <span>${formattedDate}</span>
                    </div>
                    <button class="secondary" onclick="viewVersion('${proposal.id}', '${version.id}')">View</button>
                `;

        versionList.appendChild(versionDiv);
    });
}

// View a specific version of a proposal
function viewVersion(proposalId, versionId) {
    const proposal = proposals.find(p => p.id === proposalId);
    if (!proposal) return;

    const version = proposal.versions.find(v => v.id === versionId);
    if (!version) return;

    const detailView = document.getElementById('proposalDetail');
    const categoryClass = getCategoryClass(version.category);

    // Format the date
    const versionDate = new Date(version.createdAt);
    const formattedDate = versionDate.toLocaleDateString() + ' ' + versionDate.toLocaleTimeString();

    // Build the template data HTML
    let templateDataHTML = '';
    if (version.templateData && Object.keys(version.templateData).length > 0) {
        templateDataHTML = '<div class="template-data">';
        templates[version.category].forEach(field => {
            if (version.templateData[field.id]) {
                templateDataHTML += `
                            <div class="form-group">
                                <strong>${field.label}:</strong>
                                <p>${version.templateData[field.id]}</p>
                            </div>
                        `;
            }
        });
        templateDataHTML += '</div>';
    }

    detailView.innerHTML = `
                <h2>${version.title} <span class="badge secondary">Version ${version.id}</span></h2>
                <p class="proposal-category">
                    <span class="badge ${categoryClass}">${version.category}</span>
                    <span class="proposal-date">Created: ${formattedDate}</span>
                </p>
                <div class="category-detail ${categoryClass}" style="margin-top: 10px; padding: 10px;">
                    <h3>Description</h3>
                    <p>${version.description}</p>
                </div>
                ${templateDataHTML}
            `;
}

// Edit an existing proposal
function editProposal() {
    const proposal = proposals.find(p => p.id === currentProposalId);
    if (!proposal) return;

    // Fill the form with proposal data
    document.getElementById('title').value = proposal.title;
    document.getElementById('category').value = proposal.category;
    document.getElementById('description').value = proposal.description;

    // Load template fields
    loadTemplate();

    // Fill template data
    if (proposal.templateData) {
        setTimeout(() => {
            Object.keys(proposal.templateData).forEach(key => {
                const field = document.getElementById(key);
                if (field) {
                    field.value = proposal.templateData[key];
                }
            });
        }, 100);
    }

    // Switch to form view
    document.getElementById('formView').classList.remove('hidden');
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('categoryView').classList.add('hidden');
}

// Delete a proposal
function deleteProposal() {
    if (!currentProposalId) return;

    const confirmed = confirm('Are you sure you want to delete this proposal?');
    if (!confirmed) return;

    proposals = proposals.filter(p => p.id !== currentProposalId);
    localStorage.setItem('proposals', JSON.stringify(proposals));

    currentProposalId = null;

    // Update proposal list
    renderProposalList(currentCategory);
    updateCategoryStats();

    // Return to form view
    document.getElementById('formView').classList.remove('hidden');
    document.getElementById('detailView').classList.add('hidden');
    document.getElementById('categoryView').classList.add('hidden');
}

// Reset form
function resetForm() {
    document.getElementById('proposalForm').reset();
    document.getElementById('templateFields').innerHTML = '';
    currentProposalId = null;
}

// Search proposals
function searchProposals() {
    renderProposalList(currentCategory);
}

// Go back to proposal list
function backToList() {
    if (currentCategory === 'all') {
        document.getElementById('formView').classList.remove('hidden');
        document.getElementById('detailView').classList.add('hidden');
        document.getElementById('categoryView').classList.add('hidden');
    } else {
        handleCategoryClick(currentCategory);
    }
}

// Initialize the application
function initApp() {
    renderProposalList('all');
    updateCategoryStats();
    document.getElementById('categoryStats').classList.remove('hidden');

    // Check if there are any proposals
    if (proposals.length === 0) {
        // Add some sample proposals
        addSampleProposals();
    }
}

// Add sample proposals for demonstration
function addSampleProposals() {
    const sampleProposals = [
        {
            title: "AI-Powered Recommendation Engine",
            category: "Tech",
            description: "A machine learning system that analyzes user behavior to provide personalized recommendations for products or content.",
            templateData: {
                techStack: "Python, TensorFlow, AWS",
                targetUsers: "E-commerce platforms, content providers",
                marketAnalysis: "The recommendation engine market is projected to grow significantly as businesses seek to increase engagement and conversion rates.",
                implementationTimeline: "6 months"
            }
        },
        {
            title: "Remote Patient Monitoring Solution",
            category: "Healthcare",
            description: "A system that allows healthcare providers to monitor patients' vital signs and health metrics remotely, improving care for those with chronic conditions.",
            templateData: {
                patientImpact: "Reduces hospital readmissions by enabling early intervention when vital signs indicate deterioration.",
                clinicalEvidence: "Similar systems have shown a 30% reduction in emergency visits for patients with chronic conditions.",
                regulatoryCompliance: "HIPAA compliant, FDA Class II medical device",
                costAnalysis: "Initial investment offset by reduced hospitalization costs within 1 year"
            }
        },
        {
            title: "Community Resource Sharing Platform",
            category: "Social Impact",
            description: "A digital platform that connects community members to share resources, skills, and support, reducing waste and fostering community bonds.",
            templateData: {
                targetCommunity: "Urban neighborhoods with high density and economic diversity",
                impactMetrics: "Resource utilization, community engagement, waste reduction",
                sustainability: "Membership fees and optional donations for platform maintenance",
                communityInvolvement: "Local champions identified to manage neighborhood hubs and organize community events"
            }
        }
    ];

    const currentDate = new Date();

    sampleProposals.forEach((proposal, index) => {
        const id = Date.now() + index;
        const dateString = currentDate.toISOString();

        const newProposal = {
            id: id.toString(),
            title: proposal.title,
            category: proposal.category,
            description: proposal.description,
            templateData: proposal.templateData,
            createdAt: dateString,
            updatedAt: dateString,
            versions: [
                {
                    id: "1",
                    title: proposal.title,
                    category: proposal.category,
                    description: proposal.description,
                    templateData: proposal.templateData,
                    createdAt: dateString
                }
            ]
        };

        proposals.push(newProposal);
    });

    localStorage.setItem('proposals', JSON.stringify(proposals));
}

// Initialize the app when the document is loaded
document.addEventListener('DOMContentLoaded', function () {
    initApp();
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