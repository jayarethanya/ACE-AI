/**
 * ACE AI View Templates & Screen Renderers
 * Contains comprehensive renderers for all 20 specified screens.
 */

import { storage } from "../services/storage.js";
import { recommendEvents } from "../engine/recommender.js";
import { analyzeSkillGap } from "../engine/skill-gap.js";
import { DEMO_USERS, COMMON_SKILLS, COMMON_INTERESTS, CAREER_GOALS, DEPARTMENTS, LOCATIONS } from "../data/demo-users.js";
import {
  ICONS,
  renderMatchBadge,
  renderSkillBadge,
  renderEventCard,
  renderStatCard,
  showToast
} from "./components.js";

export const Views = {
  // ==========================================
  // 1. LANDING PAGE
  // ==========================================
  renderLandingPage() {
    const events = storage.getEvents();
    const user = storage.getCurrentUser();
    const scored = recommendEvents(user, events, storage.getInteractions(user.id));
    const featuredEvents = scored.slice(0, 3);

    return `
      <div class="animate-fade-in">
        <!-- Hero Section -->
        <section class="gradient-hero py-20 px-4 sm:px-6 lg:px-8 border-b border-purple-100 text-center relative overflow-hidden">
          <div class="max-w-4xl mx-auto relative z-10">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span>${ICONS.sparkles}</span> AI Solution Area 2.1 • Personalized Event Recommendation
            </div>
            
            <h1 class="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none mb-6">
              Find Opportunities<br />
              That Match You <span class="gradient-text">Perfectly</span>
            </h1>
            
            <p class="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              ACE AI uses AI-powered personalization to help students discover hackathons, workshops, conferences and competitions that align with their skills, interests and career goals.
            </p>

            <div class="flex flex-wrap items-center justify-center gap-4 mb-14">
              <button onclick="window.app.navigate('student-dashboard')" class="px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base shadow-lg shadow-purple-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                <span>Get Started</span>
                <span>${ICONS.arrowRight}</span>
              </button>
              <button onclick="window.app.navigate('discover')" class="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95">
                Explore Events
              </button>
              <button onclick="window.app.loginDemo('student1')" class="px-6 py-4 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-base border border-purple-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                <span>${ICONS.sparkles}</span> Try Demo (Jaya - AI & DS)
              </button>
            </div>

            <!-- Statistics (Clear demo note) -->
            <div class="pt-8 border-t border-purple-200/60 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div>
                <div class="text-3xl sm:text-4xl font-black text-purple-700">10K+</div>
                <div class="text-xs sm:text-sm font-medium text-slate-500 mt-1">Students Guided</div>
                <div class="text-[10px] text-slate-400 font-mono">(Demo Metric)</div>
              </div>
              <div>
                <div class="text-3xl sm:text-4xl font-black text-indigo-700">500+</div>
                <div class="text-xs sm:text-sm font-medium text-slate-500 mt-1">Verified Events</div>
                <div class="text-[10px] text-slate-400 font-mono">(Demo Metric)</div>
              </div>
              <div>
                <div class="text-3xl sm:text-4xl font-black text-purple-700">100+</div>
                <div class="text-xs sm:text-sm font-medium text-slate-500 mt-1">Colleges Connected</div>
                <div class="text-[10px] text-slate-400 font-mono">(Demo Metric)</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Feature Cards -->
        <section class="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900">Why Students Choose ACE AI</h2>
            <p class="text-sm text-slate-500 mt-2">Real mathematical recommendation algorithms tailored to your academic and career trajectory.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div class="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                ${ICONS.sparkles}
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">AI-Powered Matching</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Discover opportunities based on your skills, interests, department, and career goals using TF-IDF and Cosine similarity.
              </p>
            </div>

            <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div class="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                ${ICONS.target}
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Skill Gap Analysis</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Understand which skills you need to improve to win hackathons, and discover workshops designed to bridge your exact gap.
              </p>
            </div>

            <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                ${ICONS.star}
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">Personalized For You</h3>
              <p class="text-sm text-slate-600 leading-relaxed">
                Receive recommendations tailored to your goals with transparent, explainable scorecards showing why each event was recommended.
              </p>
            </div>
          </div>
        </section>

        <!-- Featured Personalized Opportunities Preview -->
        <section class="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h2 class="text-2xl font-black text-slate-900">Featured Opportunities</h2>
              <p class="text-xs text-slate-500">Previewing recommendations for <span class="font-bold text-purple-600">${user.name}</span> (${user.career_goal})</p>
            </div>
            <button onclick="window.app.navigate('discover')" class="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
              <span>View All Events</span>
              <span>${ICONS.arrowRight}</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${featuredEvents.map(e => renderEventCard(e)).join("")}
          </div>
        </section>
      </div>
    `;
  },

  // ==========================================
  // 2. SIGN UP PAGE
  // ==========================================
  renderSignUp() {
    return `
      <div class="animate-fade-in max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10">
          <div class="text-center mb-8">
            <div class="inline-flex p-3 rounded-2xl bg-purple-50 text-purple-600 mb-3">
              ${ICONS.sparkles}
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900">Join ACE AI</h1>
            <p class="text-xs text-slate-500 mt-1">Build your profile and get AI-matched opportunities</p>
          </div>

          <form id="signup-form" onsubmit="window.app.handleSignUp(event)" class="space-y-5">
            <!-- Role Selection -->
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-2">Select Your Role</label>
              <div class="grid grid-cols-2 gap-4">
                <label class="flex items-center gap-3 p-3.5 rounded-2xl border-2 border-purple-600 bg-purple-50/50 cursor-pointer">
                  <input type="radio" name="role" value="student" checked class="accent-purple-600" onchange="window.app.toggleRoleFields('student')">
                  <div>
                    <div class="font-bold text-sm text-purple-900">Student</div>
                    <div class="text-[11px] text-slate-500">Discover & participate in events</div>
                  </div>
                </label>
                <label class="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 cursor-pointer">
                  <input type="radio" name="role" value="organizer" class="accent-purple-600" onchange="window.app.toggleRoleFields('organizer')">
                  <div>
                    <div class="font-bold text-sm text-slate-800">Organizer</div>
                    <div class="text-[11px] text-slate-500">Publish & analyze events with AI</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Basic Credentials -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" name="name" required placeholder="e.g. Jaya Sundaram" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 text-sm">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input type="email" name="email" required placeholder="student@example.edu" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 text-sm">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input type="password" name="password" required placeholder="••••••••" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 text-sm">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                <input type="password" name="confirm_password" required placeholder="••••••••" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 text-sm">
              </div>
            </div>

            <!-- Student Specific Fields -->
            <div id="student-extra-fields" class="space-y-4 pt-2 border-t border-slate-100">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select name="department" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-600">
                    ${DEPARTMENTS.map(d => `<option value="${d}">${d}</option>`).join("")}
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Year</label>
                  <select name="year" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-600">
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year" selected>3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <select name="location" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-600">
                    ${LOCATIONS.map(l => `<option value="${l}">${l}</option>`).join("")}
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Career Goal</label>
                <select name="career_goal" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-600">
                  ${CAREER_GOALS.map(c => `<option value="${c}">${c}</option>`).join("")}
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Your Skills (Select multiple)</label>
                <div class="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 max-h-36 overflow-y-auto">
                  ${COMMON_SKILLS.map(skill => `
                    <label class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 cursor-pointer hover:border-purple-400">
                      <input type="checkbox" name="skills" value="${skill}" ${["Python", "Machine Learning", "Pandas"].includes(skill) ? "checked" : ""} class="accent-purple-600 rounded">
                      <span>${skill}</span>
                    </label>
                  `).join("")}
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Interests</label>
                <div class="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  ${COMMON_INTERESTS.map(interest => `
                    <label class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-white border border-slate-200 cursor-pointer hover:border-purple-400">
                      <input type="checkbox" name="interests" value="${interest}" ${["Artificial Intelligence", "Data Science"].includes(interest) ? "checked" : ""} class="accent-purple-600 rounded">
                      <span>${interest}</span>
                    </label>
                  `).join("")}
                </div>
              </div>
            </div>

            <button type="submit" class="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all active:scale-95">
              Create My ACE AI Account
            </button>
          </form>

          <div class="mt-6 text-center text-xs text-slate-500">
            Already have an account? 
            <button onclick="window.app.navigate('signin')" class="font-bold text-purple-600 hover:underline">
              Sign In
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 3. SIGN IN PAGE
  // ==========================================
  renderSignIn() {
    return `
      <div class="animate-fade-in max-w-md mx-auto py-16 px-4 sm:px-6">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10">
          <div class="text-center mb-8">
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900">Welcome Back 👋</h1>
            <p class="text-xs text-slate-500 mt-1">Access your personalized event intelligence dashboard</p>
          </div>

          <!-- Demo Quick Logins -->
          <div class="mb-6 p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center">
            <div class="text-xs font-bold text-purple-900 mb-2">Instant Demo Access</div>
            <button onclick="window.app.loginDemo('student1')" class="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 mb-2">
              <span>${ICONS.sparkles}</span> Try Demo Account (Jaya - AI & DS)
            </button>
            <div class="flex gap-2">
              <button onclick="window.app.loginDemo('student2')" class="flex-1 py-1.5 px-2 rounded-lg bg-white text-slate-700 border border-slate-200 text-[11px] font-semibold hover:border-purple-300">
                Alex (Web Dev)
              </button>
              <button onclick="window.app.loginDemo('student3')" class="flex-1 py-1.5 px-2 rounded-lg bg-white text-slate-700 border border-slate-200 text-[11px] font-semibold hover:border-purple-300">
                Sam (Cyber Sec)
              </button>
              <button onclick="window.app.loginDemo('organizer')" class="flex-1 py-1.5 px-2 rounded-lg bg-white text-slate-700 border border-slate-200 text-[11px] font-semibold hover:border-purple-300">
                Organizer
              </button>
            </div>
          </div>

          <div class="relative flex py-2 items-center mb-6">
            <div class="flex-grow border-t border-slate-200"></div>
            <span class="flex-shrink mx-4 text-xs text-slate-400 uppercase font-semibold">Or with credentials</span>
            <div class="flex-grow border-t border-slate-200"></div>
          </div>

          <form id="signin-form" onsubmit="window.app.handleSignIn(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input type="email" name="email" value="jaya.ai@example.edu" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 text-sm">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input type="password" name="password" value="password123" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 text-sm">
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all active:scale-95">
              Sign In
            </button>
          </form>

          <!-- Social Demo Providers -->
          <div class="mt-6 space-y-2">
            <button onclick="window.app.socialDemoLogin('Google')" class="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              Continue with Google
            </button>
            <button onclick="window.app.socialDemoLogin('GitHub')" class="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors">
              <svg class="w-4 h-4 fill-slate-900" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              Continue with GitHub
            </button>
            <button onclick="window.app.socialDemoLogin('Microsoft')" class="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#f25022" d="M1 1h10v10H1z"/><path fill="#00a4ef" d="M1 13h10v10H1z"/><path fill="#7fba00" d="M13 1h10v10H13z"/><path fill="#ffb900" d="M13 13h10v10H13z"/></svg>
              Continue with Microsoft
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 4. STUDENT PROFILE (BUILD / EDIT)
  // ==========================================
  renderStudentProfile() {
    const student = storage.getCurrentUser();
    const currentSkills = new Set(student.skills || []);
    const currentInterests = new Set(student.interests || []);

    return `
      <div class="animate-fade-in max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10">
          <div class="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            <div>
              <h1 class="text-2xl font-black text-slate-900">Build Your Profile</h1>
              <p class="text-xs text-slate-500 mt-1">Updating your profile triggers automatic recommendation recalculation.</p>
            </div>
            <div class="p-3 rounded-2xl bg-purple-50 text-purple-600">
              ${ICONS.user}
            </div>
          </div>

          <form id="profile-form" onsubmit="window.app.handleSaveProfile(event)" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" name="name" value="${student.name || ''}" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-purple-600">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input type="email" name="email" value="${student.email || ''}" required class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-purple-600">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <select name="department" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-600">
                  ${DEPARTMENTS.map(d => `<option value="${d}" ${student.department === d ? "selected" : ""}>${d}</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Year</label>
                <input type="text" name="year" value="${student.year || '3rd Year B.Tech'}" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-600">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <select name="location" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-600">
                  ${LOCATIONS.map(l => `<option value="${l}" ${student.location === l ? "selected" : ""}>${l}</option>`).join("")}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">College / University</label>
                <input type="text" name="college" value="${student.college || ''}" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-purple-600">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Career Goal</label>
                <select name="career_goal" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-purple-600">
                  ${CAREER_GOALS.map(c => `<option value="${c}" ${student.career_goal === c ? "selected" : ""}>${c}</option>`).join("")}
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
              <div class="grid grid-cols-3 gap-3">
                ${["Beginner", "Intermediate", "Advanced"].map(lvl => `
                  <label class="flex items-center justify-center p-3 rounded-xl border ${student.experience_level === lvl ? "border-purple-600 bg-purple-50 text-purple-900 font-bold" : "border-slate-200 text-slate-700"} text-xs cursor-pointer">
                    <input type="radio" name="experience_level" value="${lvl}" ${student.experience_level === lvl ? "checked" : ""} class="hidden">
                    ${lvl}
                  </label>
                `).join("")}
              </div>
            </div>

            <!-- Skills Tag Selection -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Skills (Toggle multiple)</label>
              <div class="flex flex-wrap gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 max-h-48 overflow-y-auto">
                ${COMMON_SKILLS.map(skill => {
                  const isChecked = currentSkills.has(skill);
                  return `
                    <label class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${isChecked ? "bg-purple-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:border-purple-300"}">
                      <input type="checkbox" name="skills" value="${skill}" ${isChecked ? "checked" : ""} class="hidden" onchange="this.parentElement.classList.toggle('bg-purple-600'); this.parentElement.classList.toggle('text-white'); this.parentElement.classList.toggle('bg-white'); this.parentElement.classList.toggle('text-slate-700');">
                      <span>${skill}</span>
                    </label>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- Interests Tag Selection -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Interests</label>
              <div class="flex flex-wrap gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                ${COMMON_INTERESTS.map(interest => {
                  const isChecked = currentInterests.has(interest);
                  return `
                    <label class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${isChecked ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:border-indigo-300"}">
                      <input type="checkbox" name="interests" value="${interest}" ${isChecked ? "checked" : ""} class="hidden" onchange="this.parentElement.classList.toggle('bg-indigo-600'); this.parentElement.classList.toggle('text-white'); this.parentElement.classList.toggle('bg-white'); this.parentElement.classList.toggle('text-slate-700');">
                      <span>${interest}</span>
                    </label>
                  `;
                }).join("")}
              </div>
            </div>

            <div class="pt-4 flex gap-4">
              <button type="submit" class="flex-1 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2">
                <span>Save Profile & Recalculate AI Matches</span>
                <span>${ICONS.sparkles}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 5. STUDENT DASHBOARD
  // ==========================================
  renderStudentDashboard() {
    const user = storage.getCurrentUser();
    const events = storage.getEvents();
    const userInteractions = storage.getInteractions(user.id);
    const savedIds = storage.getSavedEventIds(user.id);
    const registrations = storage.getRegistrations(user.id);

    // Calculate dynamic dashboard stats
    const eventsViewed = userInteractions.filter(i => i.interaction_type === "view").length;
    const eventsSaved = savedIds.length;
    const regCount = registrations.length;
    const topInterest = (user.interests && user.interests[0]) || "Artificial Intelligence";
    const topSkill = (user.skills && user.skills[0]) || "Python";

    // Get live recommendations
    const rankedEvents = recommendEvents(user, events, userInteractions);
    const topRecommendations = rankedEvents.slice(0, 4);

    return `
      <div class="animate-fade-in space-y-8">
        <!-- Welcome Hero Banner -->
        <div class="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
          <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-purple-200 text-xs font-semibold backdrop-blur-md mb-3">
                <span>${ICONS.sparkles}</span> AI Recommendation Engine Active
              </div>
              <h1 class="text-2xl sm:text-4xl font-black tracking-tight">
                Welcome back, ${user.name}! 👋
              </h1>
              <p class="text-purple-200 text-xs sm:text-sm mt-1 max-w-xl">
                Here are opportunities personalized for your path as a <span class="font-bold text-white">${user.career_goal}</span> in ${user.location}.
              </p>
            </div>

            <!-- Profile Summary Card -->
            <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-4 min-w-[240px]">
              <img src="${user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}" alt="${user.name}" class="w-12 h-12 rounded-xl object-cover border border-white/30">
              <div>
                <div class="text-xs font-bold text-white">${user.name}</div>
                <div class="text-[11px] text-purple-200">${user.department}</div>
                <button onclick="window.app.navigate('profile')" class="text-[10px] font-bold text-purple-300 hover:text-white underline mt-1">
                  Edit Skills & Goal →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Metric Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
          ${renderStatCard("Events Viewed", eventsViewed, "Engagement activity", ICONS.clock, "purple")}
          ${renderStatCard("Saved Events", eventsSaved, "Bookmarked list", ICONS.bookmark, "indigo")}
          ${renderStatCard("Registrations", regCount, "Confirmed passes", ICONS.ticket, "emerald")}
          ${renderStatCard("Top Interest", topInterest, "Primary focus", ICONS.star, "amber")}
          ${renderStatCard("Primary Skill", topSkill, "Core strength", ICONS.zap, "purple")}
        </div>

        <!-- Quick Search & Filter Bar -->
        <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div class="relative w-full sm:w-96">
            <span class="absolute left-3.5 top-3 text-slate-400">${ICONS.search}</span>
            <input type="text" id="dashboard-search-input" onkeydown="if(event.key==='Enter') window.app.handleDashboardSearch()" placeholder="Search events, skills or categories..." class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600">
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <button onclick="window.app.filterByCategory('All')" class="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold whitespace-nowrap">
              All
            </button>
            <button onclick="window.app.filterByCategory('Hackathons')" class="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 text-xs font-semibold whitespace-nowrap border border-slate-200">
              Hackathons
            </button>
            <button onclick="window.app.filterByCategory('Workshops')" class="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 text-xs font-semibold whitespace-nowrap border border-slate-200">
              Workshops
            </button>
            <button onclick="window.app.filterByCategory('Competitions')" class="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 text-xs font-semibold whitespace-nowrap border border-slate-200">
              Competitions
            </button>
            <button onclick="window.app.navigate('discover')" class="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold whitespace-nowrap hover:bg-purple-700">
              All Filters →
            </button>
          </div>
        </div>

        <!-- Top Personalized "For You" Section -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
                <span>Personalized For You</span>
                <span class="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">Top AI Picks</span>
              </h2>
              <p class="text-xs text-slate-500">Calculated mathematically from your profile skills, career target, location, and activity</p>
            </div>
            <button onclick="window.app.navigate('for-you')" class="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
              <span>View Ranked List (${rankedEvents.length})</span>
              <span>${ICONS.arrowRight}</span>
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            ${topRecommendations.map(e => renderEventCard(e)).join("")}
          </div>
        </div>

        <!-- Skill Gap Banner -->
        ${topRecommendations.length > 0 ? `
          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="space-y-1 text-center md:text-left">
              <div class="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center justify-center md:justify-start gap-1.5">
                <span>${ICONS.target}</span> Skill Gap Diagnostic
              </div>
              <h3 class="text-lg font-bold text-slate-900">Want to maximize your chances at <span class="text-purple-700">${topRecommendations[0].title}</span>?</h3>
              <p class="text-xs text-slate-600 max-w-2xl">
                Analyze your missing skills and bridge them with curated bootcamps and hands-on workshops before registration closes.
              </p>
            </div>
            <button onclick="window.app.openSkillGap('${topRecommendations[0].id}')" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all whitespace-nowrap">
              Run Skill Gap Analysis
            </button>
          </div>
        ` : ""}
      </div>
    `;
  },

  // ==========================================
  // 6. DISCOVER EVENTS (CATALOG + FILTERS)
  // ==========================================
  renderDiscoverEvents(filterOptions = {}) {
    const user = storage.getCurrentUser();
    const events = storage.getEvents();
    const interactions = storage.getInteractions(user.id);
    const scored = recommendEvents(user, events, interactions);

    const categories = ["All", "Hackathons", "Workshops", "Conferences", "Competitions", "Webinars", "Bootcamps"];
    const modes = ["All", "Online", "In-Person", "Hybrid"];
    const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

    return `
      <div class="animate-fade-in space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-black text-slate-900">Discover Opportunities</h1>
            <p class="text-xs text-slate-500">Explore hackathons, workshops, and conferences across tech domains.</p>
          </div>
          <div class="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            Showing <span id="event-count-badge" class="font-bold text-purple-600">${scored.length}</span> Opportunities
          </div>
        </div>

        <!-- Search & Filter Controls -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <!-- Search Bar with Interaction Tracking -->
          <div class="relative">
            <span class="absolute left-3.5 top-3 text-slate-400">${ICONS.search}</span>
            <input type="text" id="catalog-search-input" oninput="window.app.applyFilters()" placeholder="Search by title, description, skills (e.g. Python, AI Hackathons, Chennai)..." class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-purple-600">
          </div>

          <!-- Category Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-1" id="category-filter-pills">
            ${categories.map(c => `
              <button onclick="window.app.setFilterCategory('${c}')" data-category="${c}" class="filter-cat-btn px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${c === 'All' ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                ${c}
              </button>
            `).join("")}
          </div>

          <!-- Secondary Filters Row -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Mode</label>
              <select id="filter-mode" onchange="window.app.applyFilters()" class="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50">
                ${modes.map(m => `<option value="${m}">${m}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Location</label>
              <select id="filter-location" onchange="window.app.applyFilters()" class="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50">
                <option value="All">All Locations</option>
                ${LOCATIONS.map(l => `<option value="${l}">${l}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Difficulty</label>
              <select id="filter-difficulty" onchange="window.app.applyFilters()" class="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50">
                ${difficulties.map(d => `<option value="${d}">${d}</option>`).join("")}
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase text-slate-400 mb-1">Sort By</label>
              <select id="filter-sort" onchange="window.app.applyFilters()" class="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50">
                <option value="match">AI Match Score (High → Low)</option>
                <option value="date">Date (Earliest First)</option>
                <option value="popular">Popularity (Most Registered)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Event Cards Grid -->
        <div id="catalog-events-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${scored.map(e => renderEventCard(e)).join("")}
        </div>
      </div>
    `;
  },

  // ==========================================
  // 7. PERSONALIZED "FOR YOU" RECOMMENDATIONS
  // ==========================================
  renderForYou() {
    const user = storage.getCurrentUser();
    const events = storage.getEvents();
    const interactions = storage.getInteractions(user.id);
    const rankedEvents = recommendEvents(user, events, interactions);

    return `
      <div class="animate-fade-in space-y-6">
        <!-- Banner -->
        <div class="bg-gradient-to-r from-purple-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
          <div class="relative z-10">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold backdrop-blur-md mb-2">
              <span>${ICONS.sparkles}</span> Real-time AI Personalized Ranking
            </div>
            <h1 class="text-2xl sm:text-3xl font-black">Personalized For You</h1>
            <p class="text-purple-200 text-xs sm:text-sm mt-1 max-w-2xl">
              Recommendations dynamically ranked by your skills (${(user.skills || []).join(", ")}), career goal (${user.career_goal}), and recent interaction signals.
            </p>
          </div>
        </div>

        <!-- Ranked Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${rankedEvents.map((e, idx) => {
            return `
              <div class="relative">
                <div class="absolute -top-3 -left-3 z-10 w-7 h-7 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-md border-2 border-white">
                  #${idx + 1}
                </div>
                ${renderEventCard(e)}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  },

  // ==========================================
  // 8. EVENT DETAILS VIEW
  // ==========================================
  renderEventDetails(eventId) {
    const event = storage.getEventById(eventId);
    const user = storage.getCurrentUser();
    if (!event) {
      return `
        <div class="p-12 text-center">
          <h2 class="text-xl font-bold text-slate-800">Event Not Found</h2>
          <button onclick="window.app.navigate('discover')" class="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold">Return to Catalog</button>
        </div>
      `;
    }

    const interactions = storage.getInteractions(user.id);
    const scoredList = recommendEvents(user, [event], interactions);
    const scoredEvent = scoredList[0] || event;
    const isSaved = storage.isEventSaved(user.id, event.id);
    const isRegistered = storage.isRegistered(user.id, event.id);

    const dateFormatted = new Date(event.date).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    const deadlineFormatted = new Date(event.registration_deadline).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    return `
      <div class="animate-fade-in max-w-5xl mx-auto space-y-6 pb-12">
        <!-- Back Navigation -->
        <button onclick="window.history.back()" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors">
          <span>←</span> Back to Opportunities
        </button>

        <!-- Banner Header -->
        <div class="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xl">
          <div class="h-64 sm:h-80 w-full relative">
            <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover opacity-80">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            
            <div class="absolute top-4 left-4 flex gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-bold bg-white text-purple-900 shadow-md">
                ${event.category}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-white border border-white/20">
                ${event.mode} Mode
              </span>
            </div>

            <!-- Active View Time Indicator Widget -->
            <div id="dev-tracker-badge" class="absolute top-4 right-4 bg-slate-900/90 border border-purple-400/40 rounded-2xl px-3.5 py-1.5 backdrop-blur-md flex items-center gap-2 shadow-lg">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <div class="text-[11px] text-white">
                <span id="dev-tracker-status" class="text-emerald-400 font-bold">Active Tracking</span>:
                <span id="dev-tracker-time" class="font-mono font-bold text-purple-300">00:00</span>
              </div>
            </div>

            <!-- Title & Metadata Over Image -->
            <div class="absolute bottom-6 left-6 right-6 text-white">
              <div class="text-xs font-semibold text-purple-300 mb-1">${event.organization}</div>
              <h1 class="text-2xl sm:text-4xl font-black leading-tight tracking-tight mb-3">${event.title}</h1>
              <div class="flex flex-wrap items-center gap-4 text-xs text-slate-200">
                <span class="flex items-center gap-1.5">${ICONS.calendar} ${dateFormatted}</span>
                <span class="flex items-center gap-1.5">${ICONS.mapPin} ${event.location}</span>
                <span class="flex items-center gap-1.5">${ICONS.clock} ${event.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content & AI Match Panel -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- Left 2 Cols: Details & Description -->
          <div class="lg:col-span-2 space-y-6">
            
            <!-- Description Card -->
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 class="text-lg font-bold text-slate-900">About This Opportunity</h2>
              <p class="text-sm text-slate-600 leading-relaxed">${event.description}</p>

              <div class="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span class="font-bold text-slate-400 uppercase text-[10px] block">Eligibility</span>
                  <span class="font-semibold text-slate-800">${event.eligibility}</span>
                </div>
                <div>
                  <span class="font-bold text-slate-400 uppercase text-[10px] block">Difficulty Level</span>
                  <span class="font-semibold text-slate-800">${event.difficulty}</span>
                </div>
                <div>
                  <span class="font-bold text-slate-400 uppercase text-[10px] block">Registration Deadline</span>
                  <span class="font-semibold text-rose-600">${deadlineFormatted}</span>
                </div>
                <div>
                  <span class="font-bold text-slate-400 uppercase text-[10px] block">Capacity / Registrations</span>
                  <span class="font-semibold text-slate-800">${event.registered_count || 0} / ${event.capacity || 500} enrolled</span>
                </div>
              </div>
            </div>

            <!-- Required Skills & Gap Card -->
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold text-slate-900">Required Skills & Preparation</h2>
                <button onclick="window.app.openSkillGap('${event.id}')" class="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  <span>Skill Gap Diagnostic</span>
                  <span>${ICONS.arrowRight}</span>
                </button>
              </div>

              <div class="flex flex-wrap gap-2">
                ${(event.required_skills || []).map(skill => {
                  const isMatched = (scoredEvent.breakdown && scoredEvent.breakdown.matchingSkills || []).includes(skill);
                  return `
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${isMatched ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}">
                      <span>${isMatched ? '✓' : '⚠'}</span>
                      <span>${skill}</span>
                      <span class="text-[10px] opacity-75">${isMatched ? '(You have this)' : '(Gap to bridge)'}</span>
                    </span>
                  `;
                }).join("")}
              </div>
            </div>

            <!-- Career Relevance -->
            <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
              <h2 class="text-lg font-bold text-slate-900">Career Relevance</h2>
              <div class="flex flex-wrap gap-2">
                ${(event.career_relevance || []).map(c => `
                  <span class="px-3 py-1 rounded-xl text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                    ${c}
                  </span>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- Right Col: AI Recommendation & Registration Box -->
          <div class="space-y-6">
            
            <!-- AI Recommendation Score Card -->
            <div class="bg-gradient-to-b from-purple-50 to-white rounded-3xl p-6 border-2 border-purple-200 shadow-lg space-y-5">
              <div class="text-center">
                <div class="text-[11px] font-bold uppercase tracking-wider text-purple-600 mb-1">Personalized Match</div>
                <div class="text-5xl font-black text-slate-900 tracking-tight">
                  ${scoredEvent.matchScore}%
                </div>
                <div class="text-xs text-slate-500 mt-1">Calculated for ${user.name}</div>
              </div>

              <div class="space-y-2 text-xs">
                <div class="flex justify-between text-slate-600">
                  <span>Skill Match</span>
                  <span class="font-bold text-slate-900">${scoredEvent.breakdown ? scoredEvent.breakdown.skillScore : 80}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-1.5">
                  <div class="bg-purple-600 h-1.5 rounded-full" style="width: ${scoredEvent.breakdown ? scoredEvent.breakdown.skillScore : 80}%"></div>
                </div>

                <div class="flex justify-between text-slate-600 pt-1">
                  <span>Interest Alignment</span>
                  <span class="font-bold text-slate-900">${scoredEvent.breakdown ? scoredEvent.breakdown.interestScore : 85}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-1.5">
                  <div class="bg-indigo-600 h-1.5 rounded-full" style="width: ${scoredEvent.breakdown ? scoredEvent.breakdown.interestScore : 85}%"></div>
                </div>

                <div class="flex justify-between text-slate-600 pt-1">
                  <span>Career Fit</span>
                  <span class="font-bold text-slate-900">${scoredEvent.breakdown ? scoredEvent.breakdown.careerScore : 90}%</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-1.5">
                  <div class="bg-emerald-600 h-1.5 rounded-full" style="width: ${scoredEvent.breakdown ? scoredEvent.breakdown.careerScore : 90}%"></div>
                </div>
              </div>

              <button onclick="window.app.openWhyRecommended('${event.id}')" class="w-full py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5">
                <span>${ICONS.sparkles}</span> Full Explanation Breakdown
              </button>
            </div>

            <!-- Action Buttons Card -->
            <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              ${isRegistered ? `
                <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <span>${ICONS.check}</span> You are registered for this event!
                </div>
              ` : `
                <button onclick="window.app.handleRegister('${event.id}')" class="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                  <span>Register Now</span>
                  <span>${ICONS.arrowRight}</span>
                </button>
              `}

              <button onclick="window.app.toggleSave('${event.id}')" class="w-full py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2">
                ${isSaved ? ICONS.bookmarkFilled : ICONS.bookmark}
                <span>${isSaved ? 'Saved in Your Bookmarks' : 'Save Event for Later'}</span>
              </button>

              <button onclick="window.app.openShareModal('${event.id}')" class="w-full py-2.5 rounded-2xl text-slate-500 hover:text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5">
                <span>${ICONS.share}</span> Share Opportunity
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 9. "WHY RECOMMENDED" MODAL / VIEW
  // ==========================================
  renderWhyRecommendedModal(eventId) {
    const event = storage.getEventById(eventId);
    const user = storage.getCurrentUser();
    if (!event) return "";

    const interactions = storage.getInteractions(user.id);
    const scoredList = recommendEvents(user, [event], interactions);
    const scored = scoredList[0] || event;
    const bd = scored.breakdown || {};

    return `
      <div id="why-recommended-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-purple-200">
                ${scored.matchScore}%
              </div>
              <div>
                <div class="text-[11px] font-bold uppercase tracking-wider text-purple-600">Explainable AI Breakdown</div>
                <h2 class="text-lg font-black text-slate-900">${event.title}</h2>
              </div>
            </div>
            <button onclick="document.getElementById('why-recommended-modal').remove()" class="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
              ✕
            </button>
          </div>

          <!-- 6-Factor Scorecard Gauges -->
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">6 Core Matching Factors</div>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div class="p-3 rounded-2xl bg-purple-50 border border-purple-100">
                <div class="text-slate-500 text-[10px] font-bold uppercase">1. Skill Match (27%)</div>
                <div class="text-xl font-black text-purple-900 mt-0.5">${bd.skillScore || 0}%</div>
                <div class="text-[10px] text-purple-700 mt-1">${(bd.matchingSkills || []).length} / ${(event.required_skills || []).length} skills</div>
              </div>

              <div class="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                <div class="text-slate-500 text-[10px] font-bold uppercase">2. Interest Match (18%)</div>
                <div class="text-xl font-black text-indigo-900 mt-0.5">${bd.interestScore || 0}%</div>
                <div class="text-[10px] text-indigo-700 mt-1">${(bd.matchedInterests || []).slice(0, 1).join("") || "Direct topic"}</div>
              </div>

              <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                <div class="text-slate-500 text-[10px] font-bold uppercase">3. Career Fit (18%)</div>
                <div class="text-xl font-black text-emerald-900 mt-0.5">${bd.careerScore || 0}%</div>
                <div class="text-[10px] text-emerald-700 mt-1 truncate">${user.career_goal}</div>
              </div>

              <div class="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                <div class="text-slate-500 text-[10px] font-bold uppercase">4. Location (9%)</div>
                <div class="text-xl font-black text-blue-900 mt-0.5">${bd.locationScore || 0}%</div>
                <div class="text-[10px] text-blue-700 mt-1">${event.location} (${event.mode})</div>
              </div>

              <div class="p-3 rounded-2xl bg-violet-50 border border-violet-100">
                <div class="text-slate-500 text-[10px] font-bold uppercase">5. Content TF-IDF (18%)</div>
                <div class="text-xl font-black text-violet-900 mt-0.5">${bd.similarityScore || 0}%</div>
                <div class="text-[10px] text-violet-700 mt-1">Cosine similarity</div>
              </div>

              <div class="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                <div class="text-slate-500 text-[10px] font-bold uppercase">6. Behavior (10%)</div>
                <div class="text-xl font-black text-amber-900 mt-0.5">${bd.behaviorScore || 0}%</div>
                <div class="text-[10px] text-amber-700 mt-1">${bd.durationSeconds || 0}s view / saves</div>
              </div>
            </div>
          </div>

          <!-- Matching Factors List -->
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Your Strongest Matching Factors</div>
            <div class="space-y-1.5">
              ${(scored.reasons || []).map(reason => `
                <div class="flex items-center gap-2 text-xs font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span class="text-emerald-600 font-bold">✓</span>
                  <span>${reason}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <!-- Dynamic Honest AI Explanation -->
          <div class="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed">
            <div class="font-bold mb-1 flex items-center gap-1 text-purple-700">
              <span>${ICONS.sparkles}</span> ACE AI AI Explanation
            </div>
            ${scored.explanationText}
          </div>

          <!-- Close / Action Button -->
          <div class="flex justify-end gap-3 pt-2">
            <button onclick="document.getElementById('why-recommended-modal').remove()" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">
              Close
            </button>
            <button onclick="document.getElementById('why-recommended-modal').remove(); window.app.openSkillGap('${event.id}')" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs">
              View Skill Gap →
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 10. "SKILL GAP ANALYSIS" MODAL / VIEW
  // ==========================================
  renderSkillGapModal(eventId) {
    const event = storage.getEventById(eventId);
    const user = storage.getCurrentUser();
    const allEvents = storage.getEvents();
    if (!event) return "";

    const diagnostic = analyzeSkillGap(user, event, allEvents);

    return `
      <div id="skill-gap-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
          
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <div class="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Skill Gap Diagnostic</div>
              <h2 class="text-xl font-black text-slate-900">${event.title}</h2>
            </div>
            <button onclick="document.getElementById('skill-gap-modal').remove()" class="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700">
              ✕
            </button>
          </div>

          <!-- Readiness Level -->
          <div class="p-4 rounded-2xl border ${diagnostic.readinessBg} flex items-center justify-between">
            <div>
              <div class="text-xs font-bold ${diagnostic.readinessColor}">${diagnostic.readinessLevel}</div>
              <div class="text-xs text-slate-600 mt-0.5">You match <span class="font-bold text-slate-900">${diagnostic.matchedCount} of ${diagnostic.totalRequired}</span> required skills for this opportunity.</div>
            </div>
            <div class="text-2xl font-black text-slate-900">${diagnostic.matchPercentage}%</div>
          </div>

          <!-- Comparison Columns -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Your Matching Skills -->
            <div class="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <div class="text-xs font-bold text-emerald-800 flex items-center gap-1">
                <span>✓</span> Matched Skills (${diagnostic.matchedSkills.length})
              </div>
              <div class="space-y-1">
                ${diagnostic.matchedSkills.length > 0 ? diagnostic.matchedSkills.map(s => `
                  <div class="text-xs text-slate-700 bg-white p-2 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <span>${s}</span>
                    <span class="text-[10px] font-bold text-emerald-600">Ready</span>
                  </div>
                `).join("") : `<div class="text-xs text-slate-400 italic">No matching skills yet</div>`}
              </div>
            </div>

            <!-- Missing Skills to Bridge -->
            <div class="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
              <div class="text-xs font-bold text-rose-800 flex items-center gap-1">
                <span>⚠</span> Missing Skills (${diagnostic.missingSkills.length})
              </div>
              <div class="space-y-1">
                ${diagnostic.missingSkills.length > 0 ? diagnostic.missingSkills.map(s => `
                  <div class="text-xs text-slate-700 bg-white p-2 rounded-xl border border-rose-200 flex items-center justify-between">
                    <span>${s}</span>
                    <span class="text-[10px] font-bold text-rose-600">Gap</span>
                  </div>
                `).join("") : `<div class="text-xs text-slate-400 italic">No gaps! You meet all requirements.</div>`}
              </div>
            </div>
          </div>

          <!-- Suggested Bridging Workshops -->
          ${diagnostic.bridgingEvents.length > 0 ? `
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Recommended Workshops to Bridge Your Gap</div>
              <div class="space-y-2">
                ${diagnostic.bridgingEvents.map(bEvent => `
                  <div class="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between hover:border-indigo-300 transition-colors">
                    <div>
                      <div class="text-xs font-bold text-slate-900">${bEvent.title}</div>
                      <div class="text-[11px] text-indigo-600">Teaches: ${(bEvent.skillsAddressed || []).join(", ")}</div>
                    </div>
                    <button onclick="document.getElementById('skill-gap-modal').remove(); window.app.navigate('event-details', { eventId: '${bEvent.id}' })" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px]">
                      View Workshop →
                    </button>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ""}

          <!-- Close -->
          <div class="flex justify-end pt-2">
            <button onclick="document.getElementById('skill-gap-modal').remove()" class="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">
              Got It
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 11. SAVED EVENTS
  // ==========================================
  renderSavedEvents() {
    const user = storage.getCurrentUser();
    const events = storage.getEvents();
    const savedIds = storage.getSavedEventIds(user.id);
    const savedEvents = events.filter(e => savedIds.includes(e.id));
    const scoredList = recommendEvents(user, savedEvents, storage.getInteractions(user.id));

    return `
      <div class="animate-fade-in space-y-6">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Saved Opportunities</h1>
          <p class="text-xs text-slate-500">Your bookmarked hackathons, workshops, and competitions.</p>
        </div>

        ${scoredList.length === 0 ? `
          <div class="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div class="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
              ${ICONS.bookmark}
            </div>
            <h3 class="text-base font-bold text-slate-800">No Saved Events Yet</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Click the bookmark icon on any event card to save it for quick access.</p>
            <button onclick="window.app.navigate('discover')" class="mt-4 px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-sm">
              Discover Events
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${scoredList.map(e => renderEventCard(e)).join("")}
          </div>
        `}
      </div>
    `;
  },

  // ==========================================
  // 12. MY REGISTRATIONS
  // ==========================================
  renderMyRegistrations() {
    const user = storage.getCurrentUser();
    const events = storage.getEvents();
    const registrations = storage.getRegistrations(user.id);

    const regWithEvents = registrations.map(reg => {
      const event = events.find(e => e.id === reg.event_id) || {};
      return { ...reg, event };
    });

    return `
      <div class="animate-fade-in space-y-6">
        <div>
          <h1 class="text-2xl font-black text-slate-900">My Registrations</h1>
          <p class="text-xs text-slate-500">Confirmed delegate passes and schedules.</p>
        </div>

        ${regWithEvents.length === 0 ? `
          <div class="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              ${ICONS.ticket}
            </div>
            <h3 class="text-base font-bold text-slate-800">No Active Registrations</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Find personalized events and register with one click to get your delegate pass.</p>
            <button onclick="window.app.navigate('for-you')" class="mt-4 px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-sm">
              Browse "For You" Picks
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${regWithEvents.map(r => `
              <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div class="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex items-center justify-between">
                  <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-purple-300">Confirmation Pass</span>
                    <div class="text-xl font-black">${r.id}</div>
                  </div>
                  <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                    ${r.status}
                  </span>
                </div>
                <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div class="text-xs font-bold text-purple-600 mb-1">${r.event.category}</div>
                    <h3 class="text-lg font-bold text-slate-900">${r.event.title}</h3>
                    <div class="text-xs text-slate-500 mt-2 space-y-1">
                      <div><strong>Date:</strong> ${new Date(r.event.date).toLocaleString()}</div>
                      <div><strong>Location:</strong> ${r.event.location} (${r.event.mode})</div>
                      <div><strong>Registered:</strong> ${new Date(r.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <button onclick="window.app.navigate('event-details', { eventId: '${r.event.id}' })" class="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center transition-colors">
                    View Event Details & Schedule →
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    `;
  },

  // ==========================================
  // 17. ORGANIZER DASHBOARD
  // ==========================================
  renderOrganizerDashboard() {
    const user = storage.getCurrentUser();
    const events = storage.getEvents();
    const totalRegs = events.reduce((sum, e) => sum + (e.registered_count || 0), 0);

    return `
      <div class="animate-fade-in space-y-8">
        <!-- Header -->
        <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-3xl p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">Organizer Hub</div>
            <h1 class="text-3xl font-black">ACE AI Organizer Suite</h1>
            <p class="text-slate-300 text-xs mt-1">Publish opportunities and leverage AI analysis to target matching student cohorts.</p>
          </div>
          <button onclick="window.app.navigate('create-event')" class="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-900 transition-all flex items-center gap-2 whitespace-nowrap">
            <span>${ICONS.plusCircle}</span> Create New Event
          </button>
        </div>

        <!-- Organizer Metrics -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          ${renderStatCard("Total Published Events", events.length, "Active in catalog", ICONS.calendar, "purple")}
          ${renderStatCard("Total Student Registrations", totalRegs, "Across all events", ICONS.ticket, "emerald")}
          ${renderStatCard("AI Matched Reach", "10,480", "Students reached", ICONS.sparkles, "indigo")}
        </div>

        <!-- Published Events List -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Manage Published Events</h2>
              <p class="text-xs text-slate-500">Live opportunities in the ACE AI ecosystem</p>
            </div>
            <button onclick="window.app.navigate('create-event')" class="text-xs font-bold text-purple-600 hover:text-purple-700">
              + Post Opportunity
            </button>
          </div>

          <div class="divide-y divide-slate-100">
            ${events.map(e => `
              <div class="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">${e.category}</span>
                    <span class="text-xs text-slate-400">${e.mode} • ${e.location}</span>
                  </div>
                  <h3 class="text-base font-bold text-slate-900 mt-1">${e.title}</h3>
                  <div class="text-xs text-slate-500 mt-0.5">Required Skills: ${(e.required_skills || []).join(", ")}</div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <div class="text-sm font-black text-slate-900">${e.registered_count || 0}</div>
                    <div class="text-[10px] text-slate-400">Registrations</div>
                  </div>
                  <button onclick="window.app.navigate('event-details', { eventId: '${e.id}' })" class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold">
                    View
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 18. CREATE EVENT & AI EVENT ANALYSIS
  // ==========================================
  renderCreateEvent() {
    return `
      <div class="animate-fade-in max-w-3xl mx-auto py-8 px-4 sm:px-6">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
          <div class="flex items-center justify-between pb-6 border-b border-slate-100">
            <div>
              <h1 class="text-2xl font-black text-slate-900">Create New Opportunity</h1>
              <p class="text-xs text-slate-500 mt-1">Use AI analysis to automatically extract skill tags, difficulty, and audience cohorts.</p>
            </div>
            <div class="p-3 rounded-2xl bg-purple-50 text-purple-600">
              ${ICONS.sparkles}
            </div>
          </div>

          <form id="create-event-form" onsubmit="window.app.handlePublishEvent(event)" class="space-y-5">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Event Title</label>
              <input type="text" id="draft-title" name="title" required placeholder="e.g. Generative AI Healthcare Hackathon 2026" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-purple-600">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Organization / College</label>
              <input type="text" name="organization" required value="National Innovation Council & University Hack Hub" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-purple-600">
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
              <textarea id="draft-description" name="description" rows="4" required placeholder="Describe the problem statements, technologies, and mentorship provided..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-purple-600"></textarea>
            </div>

            <!-- AI ANALYSIS TRIGGER BUTTON -->
            <div class="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div class="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <span>${ICONS.sparkles}</span> AI Event Analyzer
                </div>
                <div class="text-[11px] text-purple-700">Auto-generate Smart Category, Skill Tags, Target Audience & Difficulty.</div>
              </div>
              <button type="button" onclick="window.app.triggerAIEventAnalysis()" class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-200 transition-all active:scale-95 whitespace-nowrap">
                Analyze Event with AI
              </button>
            </div>

            <!-- AI ANALYSIS GENERATED RESULT CONTAINER -->
            <div id="ai-analysis-results" class="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 hidden">
              <div class="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                <span>✓</span> AI Extraction Complete (Confidence: 96%)
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label class="block font-bold text-slate-600 mb-1">Smart Category</label>
                  <select id="ai-category" name="category" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white">
                    <option value="Hackathons">Hackathons</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Bootcamps">Bootcamps</option>
                    <option value="Competitions">Competitions</option>
                    <option value="Conferences">Conferences</option>
                  </select>
                </div>
                <div>
                  <label class="block font-bold text-slate-600 mb-1">Difficulty</label>
                  <select id="ai-difficulty" name="difficulty" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate" selected>Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-600 mb-1">Detected Skill Tags (Comma-separated)</label>
                <input type="text" id="ai-skills" name="required_skills" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs">
              </div>

              <div>
                <label class="block font-bold text-slate-600 mb-1">Target Audience & Career Relevance</label>
                <input type="text" id="ai-career" name="career_relevance" class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs">
              </div>
            </div>

            <!-- Logistics -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Date</label>
                <input type="date" name="date" required value="2026-11-15" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Mode</label>
                <select name="mode" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs">
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Hybrid" selected>Hybrid</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <select name="location" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs">
                  ${LOCATIONS.map(l => `<option value="${l}">${l}</option>`).join("")}
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Duration & Eligibility</label>
              <div class="grid grid-cols-2 gap-4">
                <input type="text" name="duration" value="36 Hours" placeholder="e.g. 48 Hours" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs">
                <input type="text" name="eligibility" value="Engineering & Science Students (All Years)" class="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs">
              </div>
            </div>

            <button type="submit" class="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2">
              <span>Publish Event to ACE AI</span>
              <span>${ICONS.arrowRight}</span>
            </button>
          </form>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 19. SETTINGS & PRIVACY
  // ==========================================
  renderSettings() {
    const user = storage.getCurrentUser();
    const settings = storage.getSettings();

    return `
      <div class="animate-fade-in max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div>
          <h1 class="text-2xl font-black text-slate-900">Platform Settings & Privacy</h1>
          <p class="text-xs text-slate-500">Manage personalization engine, active duration tracking, and privacy controls.</p>
        </div>

        <!-- Privacy Assurance Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center gap-3">
            <div class="p-3 rounded-2xl bg-purple-50 text-purple-600">
              ${ICONS.sparkles}
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900">Privacy-Compliant Personalization</h2>
              <p class="text-xs text-slate-500">ACE AI is designed strictly for student empowerment.</p>
            </div>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
            <p>
              <strong>Privacy Guarantee:</strong> "ACE AI uses your profile and activity within ACE AI to personalize event recommendations."
            </p>
            <p>
              We do <strong>NOT</strong> track external browsing activity, sell student records, or collect unnecessary personal information. All active viewing duration counters pause automatically when you leave or hide the tab.
            </p>
          </div>
        </div>

        <!-- Preferences Form -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 class="text-base font-bold text-slate-900">Personalization Preferences</h2>

          <div class="space-y-4 text-xs">
            <label class="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-purple-300 cursor-pointer">
              <div>
                <div class="font-bold text-slate-900">AI Recommendation Engine</div>
                <div class="text-slate-500">Recalculate event rankings based on profile skills, interests and interactions</div>
              </div>
              <input type="checkbox" id="setting-personalization" ${settings.personalizationEnabled ? 'checked' : ''} onchange="window.app.updateSetting('personalizationEnabled', this.checked)" class="w-5 h-5 accent-purple-600">
            </label>

            <label class="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 hover:border-purple-300 cursor-pointer">
              <div>
                <div class="font-bold text-slate-900">Show Dev / Evaluation View Duration Timer</div>
                <div class="text-slate-500">Displays real-time "Session viewing time: 00:42" badge on event detail pages</div>
              </div>
              <input type="checkbox" id="setting-dev-timer" ${settings.showDevDebugTimer ? 'checked' : ''} onchange="window.app.updateSetting('showDevDebugTimer', this.checked)" class="w-5 h-5 accent-purple-600">
            </label>
          </div>

          <!-- Data Actions -->
          <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <button onclick="window.app.handleClearHistory()" class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors">
              Clear My Interaction History
            </button>
            <button onclick="window.app.handleResetDemo()" class="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors">
              Reset to Demo Baseline
            </button>
          </div>
        </div>
      </div>
    `;
  }
};
