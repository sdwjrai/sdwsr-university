🚀 Complete JavaScript (script.js)
// ========================================
// SDWSR UNIVERSITY - MAIN APPLICATION
// ========================================

// Supabase Configuration
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';  // Replace with your URL
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';  // Replace with your key

let supabase = null;

// Initialize Supabase
function initSupabase() {
    if (typeof window.supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_PROJECT.supabase.co') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Supabase initialized');
    } else {
        console.log('⚠️ Supabase not configured - using local storage only');
    }
}

// ========================================
// USER MANAGEMENT
// ========================================

let currentUser = null;

function checkAuth() {
    const savedUser = localStorage.getItem('sdwsr_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authBtn = document.getElementById('authBtn');
    if (currentUser) {
        authBtn.textContent = `👤 ${currentUser.name || currentUser.email}`;
    } else {
        authBtn.textContent = 'Login';
    }
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'flex';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
}

function handleLogin(email, password) {
    // Demo login - in production, use Supabase Auth
    currentUser = { email: email, name: email.split('@')[0] };
    localStorage.setItem('sdwsr_user', JSON.stringify(currentUser));
    updateAuthUI();
    closeLoginModal();
    showNotification('Welcome back, ' + currentUser.name + '! 🎉');
}

function showSignup() {
    alert('Sign up functionality - In production, this would create a new user in Supabase Auth');
}

// ========================================
// COURSE MANAGEMENT
// ========================================

const courses = {
    'ai-tech': {
        title: 'AI & Technology',
        description: 'Master Artificial Intelligence and Machine Learning',
        modules: 24,
        duration: '8 weeks',
        progress: 65
    },
    'finance': {
        title: 'Finance & Analytics',
        description: 'Financial modeling and investment strategies',
        modules: 20,
        duration: '6 weeks',
        progress: 45
    },
    'programming': {
        title: 'Programming',
        description: 'Python, Java, C++ and more',
        modules: 30,
        duration: '10 weeks',
        progress: 30
    },
    'databases': {
        title: 'Databases',
        description: 'SQL, NoSQL, PostgreSQL, MongoDB',
        modules: 18,
        duration: '6 weeks',
        progress: 25
    },
    'webdev': {
        title: 'Web Development',
        description: 'HTML, CSS, JavaScript, React',
        modules: 22,
        duration: '8 weeks',
        progress: 40
    },
    'datascience': {
        title: 'Data Science',
        description: 'Statistics, Visualization, Big Data',
        modules: 20,
        duration: '8 weeks',
        progress: 15
    }
};

function openCourse(courseId) {
    const course = courses[courseId];
    if (!course) return;
    
    // Save current course to localStorage
    localStorage.setItem('current_course', courseId);
    
    // Show course modal or redirect
    showCourseModal(course);
}

function showCourseModal(course) {
    const modalHtml = `
        <div class="course-modal">
            <div class="course-modal-content">
                <span class="close-modal">&times;</span>
                <h2>${course.title}</h2>
                <p>${course.description}</p>
                <div class="course-details">
                    <div>📚 ${course.modules} Modules</div>
                    <div>⏱️ ${course.duration}</div>
                    <div>🏆 Certificate Included</div>
                </div>
                <div class="progress-section">
                    <label>Your Progress: ${course.progress}%</label>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${course.progress}%"></div>
                    </div>
                </div>
                <button class="btn-primary" onclick="startCourse('${course.title}')">Start Learning →</button>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.querySelector('.course-modal');
    if (existingModal) existingModal.remove();
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Add close functionality
    const closeBtn = document.querySelector('.close-modal');
    closeBtn.onclick = () => document.querySelector('.course-modal').remove();
}

function startCourse(courseTitle) {
    alert(`Starting course: ${courseTitle}\n\nIn the full version, this would load interactive lessons, quizzes, and track progress in Supabase!`);
    document.querySelector('.course-modal')?.remove();
}

// ========================================
// AI ASSISTANT
// ========================================

const aiResponses = {
    'what is ai': 'Artificial Intelligence (AI) is the simulation of human intelligence in machines that are programmed to think and learn.',
    'machine learning': 'Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.',
    'neural network': 'Neural networks are computing systems inspired by biological neural networks that constitute animal brains.',
    'deep learning': 'Deep Learning uses multiple layers to progressively extract higher-level features from raw input.',
    'nlp': 'Natural Language Processing helps computers understand, interpret and manipulate human language.',
    'computer vision': 'Computer Vision enables computers to derive meaningful information from digital images and videos.',
    'default': "I'm your AI learning assistant! Ask me about: AI, Machine Learning, Neural Networks, Deep Learning, NLP, or Computer Vision!"
};

function askAI() {
    const question = document.getElementById('aiQuestion').value.toLowerCase();
    const output = document.getElementById('aiOutput');
    
    let response = aiResponses.default;
    for (const [key, value] of Object.entries(aiResponses)) {
        if (question.includes(key)) {
            response = value;
            break;
        }
    }
    
    output.innerHTML += `
        <div class="chat-message user">
            <strong>You:</strong> ${question}
        </div>
        <div class="chat-message ai">
            <strong>🤖 AI:</strong> ${response}
        </div>
    `;
    
    document.getElementById('aiQuestion').value = '';
    output.scrollTop = output.scrollHeight;
    
    // Add XP for asking AI
    addXP(5);
}

// ========================================
// GAMIFICATION SYSTEM
// ========================================

let userXP = parseInt(localStorage.getItem('sdwsr_xp') || '0');
let userLevel = parseInt(localStorage.getItem('sdwsr_level') || '1');

function addXP(amount) {
    userXP += amount;
    const xpNeeded = userLevel * 100;
    
    if (userXP >= xpNeeded) {
        userLevel++;
        userXP -= xpNeeded;
        showNotification(`🎉 LEVEL UP! You reached Level ${userLevel}! 🎉`);
    }
    
    localStorage.setItem('sdwsr_xp', userXP);
    localStorage.setItem('sdwsr_level', userLevel);
    updateDashboard();
}

function updateDashboard() {
    const xpDisplay = document.getElementById('xpDisplay');
    const levelDisplay = document.getElementById('levelDisplay');
    if (xpDisplay) xpDisplay.textContent = userXP;
    if (levelDisplay) levelDisplay.textContent = userLevel;
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ========================================
// DARK MODE TOGGLE
// ========================================

function initDarkMode() {
    const savedTheme = localStorage.getItem('sdwsr_theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').textContent = '☀️';
    }
    
    document.getElementById('themeToggle').addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('sdwsr_theme', 'light');
            document.getElementById('themeToggle').textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('sdwsr_theme', 'dark');
            document.getElementById('themeToggle').textContent = '☀️';
        }
    });
}

// ========================================
// MOBILE MENU
// ========================================

function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
    }
}

// ========================================
// SCROLL SPY (Active Nav Link)
// ========================================

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ========================================
// STOCK TICKER SIMULATION
// ========================================

function initStockTicker() {
    const stocks = [
        { symbol: 'AAPL', price: 175.32, change: 2.3 },
        { symbol: 'GOOGL', price: 138.45, change: 1.2 },
        { symbol: 'MSFT', price: 378.92, change: 0.8 },
        { symbol: 'TSLA', price: 245.67, change: -1.5 },
        { symbol: 'AMZN', price: 145.23, change: 0.5 },
        { symbol: 'META', price: 325.67, change: 1.8 }
    ];
    
    setInterval(() => {
        stocks.forEach(stock => {
            const change = (Math.random() - 0.5) * 4;
            stock.price += change;
            stock.change = change;
        });
        
        const ticker = document.getElementById('stockTicker');
        if (ticker) {
            ticker.innerHTML = stocks.map(stock => `
                <div class="stock">
                    ${stock.symbol}: $${stock.price.toFixed(2)} 
                    <span class="${stock.change >= 0 ? 'positive' : 'negative'}">
                        ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(1)}%
                    </span>
                </div>
            `).join('');
        }
    }, 5000);
}

// ========================================
// SCROLL TO SECTION
// ========================================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function showDemo() {
    showNotification('Demo video coming soon! 🎥', 'info');
}

// ========================================
// ANALYTICS TRACKING (with Supabase)
// ========================================

async function trackEvent(eventName, eventData) {
    if (supabase) {
        try {
            const { error } = await supabase
                .from('analytics')
                .insert([{
                    event: eventName,
                    data: eventData,
                    user_id: currentUser?.email || 'anonymous',
                    timestamp: new Date()
                }]);
            
            if (error) console.error('Analytics error:', error);
        } catch (e) {
            console.log('Analytics disabled');
        }
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
    checkAuth();
    initDarkMode();
    initMobileMenu();
    initScrollSpy();
    initStockTicker();
    updateDashboard();
    
    // Track page view
    trackEvent('page_view', { page: window.location.pathname });
    
    console.log('🎓 SDWSR University Platform Initialized!');
    
    // Add welcome notification
    setTimeout(() => {
        showNotification('Welcome to SDWSR University! Start your learning journey today! 🎓', 'success');
    }, 1000);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .chat-message {
        margin-bottom: 10px;
        padding: 8px;
        border-radius: 8px;
    }
    
    .chat-message.user {
        background: var(--primary);
        color: white;
    }
    
    .chat-message.ai {
        background: var(--dark);
    }
    
    .course-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        z-index: 2000;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .course-modal-content {
        background: var(--dark);
        padding: 2rem;
        border-radius: 20px;
        max-width: 500px;
        width: 90%;
        position: relative;
    }
    
    .close-modal {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.5rem;
        cursor: pointer;
    }
    
    .course-details {
        display: flex;
        gap: 1rem;
        margin: 1rem 0;
        padding: 1rem 0;
        border-top: 1px solid rgba(255,255,255,0.1);
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .progress-section {
        margin: 1rem 0;
    }
    
    .notification-info {
        background: var(--primary);
    }
`;
document.head.appendChild(style);
