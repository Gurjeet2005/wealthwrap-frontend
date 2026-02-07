import { Auth } from './auth.js';

export const UI = {
    // Selectors
    $(selector) { return document.querySelector(selector); },
    $$(selector) { return document.querySelectorAll(selector); },

    // Element Factory
    createElement(tag, classes = [], text = '', html = '') {
        const el = document.createElement(tag);
        if (classes.length) el.classList.add(...classes);
        if (text) el.textContent = text;
        if (html) el.innerHTML = html;
        return el;
    },

    // Layout Mounting
    mountHeader() {
        const user = Auth.currentUser();
        const isLoggedIn = !!user;
        const header = document.createElement('header');
        header.className = 'site-header';

        // Path correction helper
        const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        const p = (path) => isRoot ? `pages/${path}` : `${path}`;
        const home = isRoot ? 'index.html' : '../index.html';
        const assets = (path) => isRoot ? `${path}` : `../${path}`;

        let navContent = '';
        if (isLoggedIn) {
            navContent = `
                <nav class="nav-desktop">
                    <div class="search-bar">
                        <input type="text" placeholder="Search..." aria-label="Search">
                        <button class="btn-text" aria-label="Search Submit">🔍</button>
                    </div>
                </nav>
                <div class="user-menu">
                    <span class="points-badge">💎 ${user.points || 0}</span>
                    <button class="avatar-btn" aria-label="User menu" aria-haspopup="true">
                         <img src="${assets(user.avatar || 'assets/icons/avatar-1.svg')}" alt="${user.name}">
                    </button>
                    <div class="dropdown-menu hidden">
                        <a href="${p('profile.html')}">Profile</a>
                        <button id="logout-btn">Logout</button>
                    </div>
                </div>
                <button class="mobile-menu-toggle" aria-label="Toggle Navigation">☰</button>
            `;
        } else {
            navContent = `
                <nav class="nav-public">
                    <a href="${p('login.html')}" class="btn btn-text">Login</a>
                    <a href="${p('register.html')}" class="btn btn-primary">Get Started</a>
                </nav>
            `;
        }

        header.innerHTML = `
            <div class="container container-flex">
                <a href="${home}" class="logo">
                     <span class="logo-icon">Wealth</span>Wrap
                </a>
                ${navContent}
            </div>
        `;

        document.body.prepend(header);

        // Header Events
        if (isLoggedIn) {
            const avatarBtn = header.querySelector('.avatar-btn');
            const dropdown = header.querySelector('.dropdown-menu');
            const logoutBtn = header.querySelector('#logout-btn');

            avatarBtn.addEventListener('click', () => {
                dropdown.classList.toggle('hidden');
                const isExpanded = !dropdown.classList.contains('hidden');
                avatarBtn.setAttribute('aria-expanded', isExpanded);
            });

            logoutBtn.addEventListener('click', Auth.logout);

            // Close dropdown on click outside
            document.addEventListener('click', (e) => {
                if (!avatarBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.add('hidden');
                }
            });

            // Mobile toggle
            const mobileToggle = header.querySelector('.mobile-menu-toggle');
            const sidebar = document.querySelector('.sidebar');
            if (mobileToggle && sidebar) {
                mobileToggle.addEventListener('click', () => {
                    sidebar.classList.toggle('active');
                });
            }
        }
    },

    mountSidebar() {
        if (!Auth.isAuthenticated()) return;

        const path = window.location.pathname;
        const isActive = (p) => path.includes(p) ? 'active' : '';

        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        sidebar.innerHTML = `
            <nav class="sidebar-nav">
                <a href="dashboard.html" class="${isActive('dashboard')}">
                    <span class="icon">🏠</span> Dashboard
                </a>
                <a href="goals.html" class="${isActive('goals')}">
                    <span class="icon">🎯</span> Goals
                </a>
                <a href="simulator.html" class="${isActive('simulator')}">
                    <span class="icon">🔮</span> Simulator
                </a>
                <a href="quests.html" class="${isActive('quests')}">
                    <span class="icon">⚔️</span> Quests
                </a>
                <a href="leaderboard.html" class="${isActive('leaderboard')}">
                    <span class="icon">🏆</span> Leaderboard
                </a>
                <a href="education.html" class="${isActive('education')}">
                    <span class="icon">📚</span> Education
                </a>
                <a href="profile.html" class="${isActive('profile')}">
                    <span class="icon">👤</span> Profile
                </a>
            </nav>
        `;

        // This expects a wrapper .app-layout in the body
        const layout = document.querySelector('.app-layout');
        if (layout) {
            layout.prepend(sidebar);
        } else {
            console.warn('UI.mountSidebar: .app-layout not found');
        }
    },

    // Toast Notification
    toast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');

        const container = document.querySelector('.toast-container') || this.createToastContainer();
        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    },

    createToastContainer() {
        const div = document.createElement('div');
        div.className = 'toast-container';
        document.body.appendChild(div);
        return div;
    },

    // Loading State
    setLoading(btn, isLoading, loadingText = 'Loading...') {
        if (isLoading) {
            btn.dataset.originalText = btn.textContent;
            btn.textContent = loadingText;
            btn.disabled = true;
        } else {
            btn.textContent = btn.dataset.originalText;
            btn.disabled = false;
        }
    },

    // Formatters
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    }
};
