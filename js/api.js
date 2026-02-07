import { Storage } from './storage.js';

/**
 * Mock API Layer
 * Simulates async server calls with latency
 */

const LATENCY_MIN = 300;
const LATENCY_MAX = 700;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomLatency = () => delay(Math.floor(Math.random() * (LATENCY_MAX - LATENCY_MIN + 1) + LATENCY_MIN));

const SEED_DATA = {
    users: [
        { id: 'u1', name: 'Demo User', email: 'demo@example.com', password: 'password123', points: 1250, avatar: 'assets/icons/avatar-1.svg', goals: ['g1', 'g2'], badges: ['b1'] },
        // Leaderboard Mocks
        { id: 'u2', name: 'Alice Raj', points: 2100, avatar: 'assets/icons/avatar-2.svg' },
        { id: 'u3', name: 'Bob Singh', points: 1950, avatar: 'assets/icons/avatar-3.svg' },
        { id: 'u4', name: 'Charlie Dave', points: 1800, avatar: 'assets/icons/avatar-4.svg' },
        { id: 'u5', name: 'Diana P', points: 1600, avatar: 'assets/icons/avatar-5.svg' },
        { id: 'u6', name: 'Evan K', points: 1400, avatar: 'assets/icons/avatar-6.svg' },
        { id: 'u7', name: 'Fay L', points: 1350, avatar: 'assets/icons/avatar-7.svg' },
        { id: 'u8', name: 'George M', points: 1200, avatar: 'assets/icons/avatar-8.svg' },
        { id: 'u9', name: 'Hannah S', points: 900, avatar: 'assets/icons/avatar-1.svg' },
        { id: 'u10', name: 'Ian T', points: 850, avatar: 'assets/icons/avatar-2.svg' },
        { id: 'u11', name: 'Jane D', points: 800, avatar: 'assets/icons/avatar-3.svg' }
    ],
    goals: [
        { id: 'g1', userId: 'u1', title: 'Europe Trip', targetAmount: 200000, currentSaved: 45000, deadline: '2026-12-31', contribution: 5000, color: '#48BB78' },
        { id: 'g2', userId: 'u1', title: 'Emergency Fund', targetAmount: 100000, currentSaved: 80000, deadline: '2026-06-30', contribution: 2000, color: '#F6C34A' }
    ],
    quests: [
        { id: 'q1', text: 'Create a monthly budget', reward: 100, completedBy: [], time: '10 mins' },
        { id: 'q2', text: 'Save ₹500 this month', reward: 200, completedBy: [], time: '30 days' },
        { id: 'q3', text: 'Read "Compound Interest 101"', reward: 50, completedBy: ['u1'], time: '5 mins' },
        { id: 'q4', text: 'Login 7 days in a row', reward: 500, completedBy: [], time: '7 days' }
    ],
    badges: [
        { id: 'b1', name: 'Novice Saver', icon: '🌱', description: 'Saved your first ₹1,000' },
        { id: 'b2', name: 'Budget Master', icon: '📊', description: 'Created a budget plan' },
        { id: 'b3', name: 'Consistency King', icon: '👑', description: 'Logged in 7 days consecutively' }
    ],
    education: [
        { id: 'e1', title: 'Why Budgeting Matters', difficulty: 'Beginner', time: '3 min', content: '...', type: 'article' },
        { id: 'e2', title: 'Understanding Compound Interest', difficulty: 'Intermediate', time: '5 min', content: '...', type: 'article' }
    ],
    activityLog: [
        { id: 'a1', userId: 'u1', text: 'Completed quest "Read Compound Interest 101"', date: new Date().toISOString() }
    ],
    friends: ['u2', 'u3', 'u4'] // Demo user's friends
};

// Initialize Seed Data if needed
const init = () => {
    const existing = Storage.get('users');
    if (!existing) {
        Storage.set('users', SEED_DATA.users);
        Storage.set('goals', SEED_DATA.goals);
        Storage.set('quests', SEED_DATA.quests);
        Storage.set('badges', SEED_DATA.badges);
        Storage.set('education', SEED_DATA.education);
        Storage.set('activityLog', SEED_DATA.activityLog);
        Storage.set('friends', SEED_DATA.friends);
        console.log('Seed data initialized');
    }
};

init();

export const API = {
    async login(email, password) {
        await randomLatency();
        const users = Storage.get('users');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            const token = btoa(JSON.stringify({ id: user.id, email: user.email, timestamp: Date.now() }));
            return { token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } };
        }
        throw new Error('Invalid credentials');
    },

    async register(payload) {
        await randomLatency();
        const users = Storage.get('users');
        if (users.find(u => u.email === payload.email)) {
            throw new Error('Email already exists');
        }
        const newUser = {
            id: 'u' + (users.length + 1) + Date.now(),
            ...payload,
            points: 0,
            badges: [],
            avatar: 'assets/icons/avatar-1.svg' // default
        };
        users.push(newUser);
        Storage.set('users', users);
        return API.login(payload.email, payload.password);
    },

    async getUser(id) {
        await randomLatency();
        const users = Storage.get('users');
        const user = users.find(u => u.id === id);
        if (!user) throw new Error('User not found');
        return user;
    },

    async getGoals(userId) {
        await randomLatency();
        const goals = Storage.get('goals');
        return goals.filter(g => g.userId === userId);
    },

    async saveGoal(goal) {
        await randomLatency();
        const goals = Storage.get('goals');
        if (goal.id) {
            const idx = goals.findIndex(g => g.id === goal.id);
            if (idx !== -1) goals[idx] = goal;
        } else {
            goal.id = 'g' + Date.now();
            goals.push(goal);
        }
        Storage.set('goals', goals);
        return goal;
    },

    async getQuests(userId) {
        await randomLatency();
        // Return all quests, mark as completed if user is in list
        const quests = Storage.get('quests');
        return quests.map(q => ({
            ...q,
            isCompleted: q.completedBy.includes(userId)
        }));
    },

    async completeQuest(questId, userId) {
        await randomLatency();
        const quests = Storage.get('quests');
        const quest = quests.find(q => q.id === questId);
        if (quest && !quest.completedBy.includes(userId)) {
            quest.completedBy.push(userId);
            Storage.set('quests', quests);

            // Award points
            const users = Storage.get('users');
            const userIdx = users.findIndex(u => u.id === userId);
            if (userIdx !== -1) {
                users[userIdx].points += quest.reward;
                Storage.set('users', users);
            }
            return { success: true, pointsAwarded: quest.reward };
        }
        return { success: false };
    },

    async getLeaderboard(type = 'global', currentUserId) {
        await randomLatency();
        const users = Storage.get('users');
        let filtered = users;
        if (type === 'friends') {
            const friends = Storage.get('friends') || [];
            filtered = users.filter(u => friends.includes(u.id) || u.id === currentUserId);
        }
        return filtered.sort((a, b) => b.points - a.points).slice(0, 10).map(({ id, name, points, avatar }) => ({ id, name, points, avatar }));
    },

    async getActivityLog(userId) {
        await randomLatency();
        const logs = Storage.get('activityLog') || [];
        // Filter logs for the specific user (ifuserId is present in log object)
        // The seed data has 'userId' property.
        return logs.filter(log => log.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    async getEducationItems() {
        await randomLatency();
        return Storage.get('education');
    }
};
