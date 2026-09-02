/**
 * ACE AI Reusable UI Component Generators
 * Generates modern, clean, accessible HTML components with SVG icons.
 */

import { storage } from "../services/storage.js";

// Helper for Lucide-style SVG icons
export const ICONS = {
  sparkles: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>`,
  calendar: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  mapPin: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  clock: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  bookmark: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>`,
  bookmarkFilled: `<svg class="w-4 h-4 fill-purple-600 text-purple-600" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>`,
  check: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
  alertTriangle: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
  arrowRight: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`,
  share: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>`,
  search: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`,
  user: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
  compass: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  star: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`,
  briefcase: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
  settings: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  plusCircle: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  barChart: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
  target: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  zap: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
  ticket: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/></svg>`
};

/**
 * Renders Match Score Badge
 * @param {number} score 
 * @param {boolean} showLabel 
 */
export function renderMatchBadge(score, showLabel = true) {
  let colorClass = "bg-purple-600 text-white shadow-purple-200";
  if (score >= 85) colorClass = "bg-emerald-600 text-white shadow-emerald-200";
  else if (score >= 65) colorClass = "bg-indigo-600 text-white shadow-indigo-200";
  else if (score >= 45) colorClass = "bg-amber-500 text-white shadow-amber-200";
  else colorClass = "bg-slate-600 text-white shadow-slate-200";

  return `
    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${colorClass} tracking-wide">
      <span>${ICONS.sparkles}</span>
      <span>${score}% ${showLabel ? "Match" : ""}</span>
    </div>
  `;
}

/**
 * Renders a standard Skill Tag Badge
 * @param {string} skill 
 * @param {boolean} isMatched 
 */
export function renderSkillBadge(skill, isMatched = false) {
  if (isMatched) {
    return `
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        ${skill}
      </span>
    `;
  }
  return `
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      ${skill}
    </span>
  `;
}

/**
 * Renders an Event Card
 * @param {object} event 
 * @param {object} options 
 */
export function renderEventCard(event, options = {}) {
  const user = storage.getCurrentUser();
  const isSaved = storage.isEventSaved(user.id, event.id);
  const isRegistered = storage.isRegistered(user.id, event.id);
  const score = event.matchScore || 75;

  const dateFormatted = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const matchingSkills = (event.breakdown && event.breakdown.matchingSkills) || [];
  const reasonsPreview = event.reasons ? event.reasons.slice(0, 2) : [];

  return `
    <div class="group bg-white rounded-2xl border border-slate-200/90 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative" data-event-id="${event.id}">
      
      <!-- Card Image & Header -->
      <div class="relative h-44 w-full overflow-hidden bg-slate-900">
        <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        
        <!-- Category & Mode Badges -->
        <div class="absolute top-3 left-3 flex items-center gap-2">
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-purple-900 backdrop-blur-md shadow-sm">
            ${event.category}
          </span>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-900/80 text-white backdrop-blur-md border border-white/20">
            ${event.mode}
          </span>
        </div>

        <!-- AI Match Badge -->
        <div class="absolute top-3 right-3">
          ${renderMatchBadge(score)}
        </div>

        <!-- Bookmark Quick Button -->
        <button onclick="window.app.toggleSave('${event.id}', event)" class="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-purple-600 shadow-md backdrop-blur-md transition-transform active:scale-95" title="${isSaved ? 'Remove from Saved' : 'Save Event'}">
          ${isSaved ? ICONS.bookmarkFilled : ICONS.bookmark}
        </button>

        <!-- Location & Date on image -->
        <div class="absolute bottom-3 left-3 text-white text-xs flex items-center gap-3">
          <span class="flex items-center gap-1 drop-shadow-md">
            ${ICONS.calendar} ${dateFormatted}
          </span>
          <span class="flex items-center gap-1 drop-shadow-md">
            ${ICONS.mapPin} ${event.location}
          </span>
        </div>
      </div>

      <!-- Card Body -->
      <div class="p-5 flex-1 flex flex-col">
        <div class="text-xs font-medium text-purple-600 mb-1 line-clamp-1">
          ${event.organization}
        </div>
        <h3 class="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2 leading-snug mb-2">
          ${event.title}
        </h3>
        <p class="text-xs text-slate-500 line-clamp-2 mb-4">
          ${event.description}
        </p>

        <!-- Dynamic AI Reasoning Preview -->
        ${reasonsPreview.length > 0 ? `
          <div class="mb-4 bg-purple-50/70 border border-purple-100 rounded-xl p-2.5 text-xs text-purple-900">
            <div class="font-semibold text-[11px] text-purple-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>${ICONS.sparkles}</span> Why Recommended
            </div>
            <div class="space-y-0.5">
              ${reasonsPreview.map(r => `<div class="truncate">${r}</div>`).join("")}
            </div>
          </div>
        ` : ""}

        <!-- Required Skills -->
        <div class="mt-auto pt-3 border-t border-slate-100">
          <div class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Required Skills</div>
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${(event.required_skills || []).slice(0, 4).map(skill => {
              const isMatched = matchingSkills.includes(skill);
              return renderSkillBadge(skill, isMatched);
            }).join("")}
            ${(event.required_skills || []).length > 4 ? `
              <span class="text-xs text-slate-400 self-center">+${event.required_skills.length - 4} more</span>
            ` : ""}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-2 pt-2">
          <button onclick="window.app.navigate('event-details', { eventId: '${event.id}' })" class="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-center flex items-center justify-center gap-1.5">
            View Details
          </button>
          <button onclick="window.app.openWhyRecommended('${event.id}')" class="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors text-center flex items-center justify-center gap-1">
            <span>${ICONS.sparkles}</span> Why Match?
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders Stat Card for Dashboards
 */
export function renderStatCard(title, value, subtitle, iconHtml, color = "purple") {
  const colorMap = {
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100"
  };

  return `
    <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">${title}</div>
        <div class="text-2xl font-black text-slate-900 mt-1">${value}</div>
        <div class="text-xs text-slate-400 mt-1">${subtitle}</div>
      </div>
      <div class="p-3.5 rounded-2xl border ${colorMap[color] || colorMap.purple}">
        ${iconHtml}
      </div>
    </div>
  `;
}

/**
 * Toast Notification function
 */
export function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";

  let icon = ICONS.sparkles;
  if (type === "success") icon = ICONS.check;
  if (type === "warning") icon = ICONS.alertTriangle;

  toast.innerHTML = `
    <span class="text-purple-400">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
