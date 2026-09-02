/**
 * ACE AI Main Application Coordinator & Controller
 * Manages routing, state synchronization, dynamic recalculation events, and interaction tracking.
 */

import { storage } from "./services/storage.js";
import { tracker } from "./services/tracker.js";
import { recommendEvents } from "./engine/recommender.js";
import { analyzeEventWithAI } from "./services/ai-analyzer.js";
import { DEMO_USERS } from "./data/demo-users.js";
import { Views } from "./ui/views.js";
import { showToast, renderEventCard } from "./ui/components.js";

class AceAIApp {
  constructor() {
    this.currentView = "landing";
    this.viewParams = {};
    this.filterState = {
      category: "All",
      mode: "All",
      location: "All",
      difficulty: "All",
      sort: "match",
      searchQuery: ""
    };

    this.init();
  }

  init() {
    // Listen for custom state update events
    window.addEventListener("aceai:user-changed", () => {
      this.render();
      this.updateDemoBar();
    });

    window.addEventListener("aceai:events-updated", () => {
      this.render();
    });

    // Handle hash navigation
    window.addEventListener("hashchange", () => {
      this.handleHashChange();
    });

    // Initial render
    this.handleHashChange();
    this.updateDemoBar();
  }

  handleHashChange() {
    const hash = window.location.hash.replace("#", "") || "dashboard";
    const parts = hash.split("?");
    const viewName = parts[0] || "dashboard";

    const params = {};
    if (parts[1]) {
      const searchParams = new URLSearchParams(parts[1]);
      for (const [k, v] of searchParams.entries()) {
        params[k] = v;
      }
    }

    this.navigate(viewName, params, false);
  }

  /**
   * Router Navigation Method
   */
  navigate(viewName, params = {}, updateHash = true) {
    // If leaving an event detail view, stop time tracking and log duration
    if (this.currentView === "event-details" && viewName !== "event-details") {
      tracker.stopAndSave();
    }

    this.currentView = viewName;
    this.viewParams = params;

    if (updateHash) {
      const queryStr = Object.keys(params).length 
        ? "?" + new URLSearchParams(params).toString() 
        : "";
      window.location.hash = `${viewName}${queryStr}`;
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    this.render();

    // Start time tracking if navigated into event-details
    if (viewName === "event-details" && params.eventId) {
      tracker.startViewing(params.eventId);
    }
  }

  /**
   * Main Render Coordinator
   */
  render() {
    const appContainer = document.getElementById("app-main-content");
    const sidebar = document.getElementById("app-sidebar");
    const headerUserAvatar = document.getElementById("header-user-avatar");
    const headerUserName = document.getElementById("header-user-name");
    const headerUserRole = document.getElementById("header-user-role");
    const user = storage.getCurrentUser();

    if (!appContainer) return;

    // Update Header user badge
    if (headerUserAvatar) headerUserAvatar.src = user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80";
    if (headerUserName) headerUserName.textContent = user.name || "Student";
    if (headerUserRole) headerUserRole.textContent = user.role === "organizer" ? "Organizer" : (user.career_goal || "Student");

    // Update Active Nav Link in Sidebar
    document.querySelectorAll(".sidebar-nav-item").forEach(item => {
      const targetView = item.getAttribute("data-view");
      if (targetView === this.currentView) {
        item.classList.add("bg-purple-600", "text-white", "shadow-sm");
        item.classList.remove("text-slate-600", "hover:bg-purple-50");
      } else {
        item.classList.remove("bg-purple-600", "text-white", "shadow-sm");
        item.classList.add("text-slate-600", "hover:bg-purple-50");
      }
    });

    // Control sidebar visibility on landing / auth pages vs dashboard pages
    const isFullPage = ["landing", "signin", "signup"].includes(this.currentView);
    if (sidebar) {
      if (isFullPage) {
        sidebar.style.display = "none";
      } else {
        sidebar.style.display = "";
      }
    }

    // Render corresponding view template
    switch (this.currentView) {
      case "landing":
        appContainer.innerHTML = Views.renderLandingPage();
        break;
      case "signup":
        appContainer.innerHTML = Views.renderSignUp();
        break;
      case "signin":
        appContainer.innerHTML = Views.renderSignIn();
        break;
      case "profile":
        appContainer.innerHTML = Views.renderStudentProfile();
        break;
      case "student-dashboard":
      case "dashboard":
        appContainer.innerHTML = Views.renderStudentDashboard();
        break;
      case "discover":
        appContainer.innerHTML = Views.renderDiscoverEvents(this.filterState);
        break;
      case "for-you":
        appContainer.innerHTML = Views.renderForYou();
        break;
      case "event-details":
        appContainer.innerHTML = Views.renderEventDetails(this.viewParams.eventId);
        break;
      case "saved-events":
        appContainer.innerHTML = Views.renderSavedEvents();
        break;
      case "my-registrations":
        appContainer.innerHTML = Views.renderMyRegistrations();
        break;
      case "organizer-dashboard":
        appContainer.innerHTML = Views.renderOrganizerDashboard();
        break;
      case "create-event":
        appContainer.innerHTML = Views.renderCreateEvent();
        break;
      case "settings":
        appContainer.innerHTML = Views.renderSettings();
        break;
      default:
        appContainer.innerHTML = Views.renderLandingPage();
    }
  }

  // ==========================================
  // DEMO PROFILE SWITCHER
  // ==========================================
  loginDemo(studentKey) {
    const demoUser = DEMO_USERS[studentKey];
    if (!demoUser) return;

    showToast("Preparing your personalized ACE AI experience...", "info");

    setTimeout(() => {
      storage.setCurrentUser(demoUser);
      this.updateDemoBar();

      if (demoUser.role === "organizer") {
        this.navigate("organizer-dashboard");
        showToast(`Logged in as Organizer: ${demoUser.name}`, "success");
      } else {
        this.navigate("student-dashboard");
        showToast(`Profile loaded for ${demoUser.name} (${demoUser.career_goal}) - Recommendations recalculating!`, "success");
      }
    }, 400);
  }

  updateDemoBar() {
    const user = storage.getCurrentUser();
    document.querySelectorAll(".demo-switch-btn").forEach(btn => {
      const userKey = btn.getAttribute("data-demo-user");
      const targetUser = DEMO_USERS[userKey];
      if (targetUser && targetUser.id === user.id) {
        btn.classList.add("bg-purple-600", "text-white", "shadow-sm");
        btn.classList.remove("bg-white", "text-slate-700");
      } else {
        btn.classList.remove("bg-purple-600", "text-white", "shadow-sm");
        btn.classList.add("bg-white", "text-slate-700");
      }
    });
  }

  // ==========================================
  // EVENT ACTIONS
  // ==========================================
  toggleSave(eventId, clickEvent) {
    if (clickEvent) clickEvent.stopPropagation();
    const user = storage.getCurrentUser();
    const result = storage.toggleSaveEvent(user.id, eventId);

    if (result.saved) {
      showToast("Event saved to your bookmarks!", "success");
    } else {
      showToast("Removed from saved events.", "info");
    }

    this.render();
  }

  handleRegister(eventId) {
    const user = storage.getCurrentUser();
    const result = storage.registerForEvent(user.id, eventId);

    if (result.success) {
      showToast("Registration Confirmed! Delegate Pass issued.", "success");
      this.navigate("my-registrations");
    } else {
      showToast(result.message || "Could not register.", "warning");
    }
  }

  openWhyRecommended(eventId) {
    // Remove existing modal if any
    const existing = document.getElementById("why-recommended-modal");
    if (existing) existing.remove();

    const modalHtml = Views.renderWhyRecommendedModal(eventId);
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  openSkillGap(eventId) {
    const existing = document.getElementById("skill-gap-modal");
    if (existing) existing.remove();

    const modalHtml = Views.renderSkillGapModal(eventId);
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  openShareModal(eventId) {
    const event = storage.getEventById(eventId);
    if (!event) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Event link copied to clipboard!", "success");
    } else {
      showToast(`Sharing: ${event.title}`, "info");
    }

    tracker.track("share", { eventId });
  }

  // ==========================================
  // DISCOVER SEARCH & FILTERS
  // ==========================================
  setFilterCategory(category) {
    this.filterState.category = category;

    // Track category interaction
    tracker.track("category_click", { category });

    // Update active button classes
    document.querySelectorAll(".filter-cat-btn").forEach(btn => {
      if (btn.getAttribute("data-category") === category) {
        btn.classList.add("bg-purple-600", "text-white", "shadow-sm");
        btn.classList.remove("bg-slate-100", "text-slate-700");
      } else {
        btn.classList.remove("bg-purple-600", "text-white", "shadow-sm");
        btn.classList.add("bg-slate-100", "text-slate-700");
      }
    });

    this.applyFilters();
  }

  filterByCategory(category) {
    this.navigate("discover");
    setTimeout(() => {
      this.setFilterCategory(category);
    }, 50);
  }

  handleDashboardSearch() {
    const input = document.getElementById("dashboard-search-input");
    if (!input) return;
    const query = input.value.trim();
    this.navigate("discover");
    setTimeout(() => {
      const catalogInput = document.getElementById("catalog-search-input");
      if (catalogInput) {
        catalogInput.value = query;
        this.applyFilters();
      }
    }, 50);
  }

  applyFilters() {
    const searchInput = document.getElementById("catalog-search-input");
    const modeSelect = document.getElementById("filter-mode");
    const locationSelect = document.getElementById("filter-location");
    const difficultySelect = document.getElementById("filter-difficulty");
    const sortSelect = document.getElementById("filter-sort");
    const grid = document.getElementById("catalog-events-grid");
    const badge = document.getElementById("event-count-badge");

    if (!grid) return;

    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const mode = modeSelect ? modeSelect.value : "All";
    const loc = locationSelect ? locationSelect.value : "All";
    const diff = difficultySelect ? difficultySelect.value : "All";
    const sort = sortSelect ? sortSelect.value : "match";
    const category = this.filterState.category || "All";

    // Track search query if not empty
    if (query.length > 2) {
      tracker.track("search", { query });
    }

    const user = storage.getCurrentUser();
    const allEvents = storage.getEvents();
    let scored = recommendEvents(user, allEvents, storage.getInteractions(user.id));

    // Filter by category
    if (category !== "All") {
      scored = scored.filter(e => e.category === category);
    }

    // Filter by mode
    if (mode !== "All") {
      scored = scored.filter(e => e.mode === mode);
    }

    // Filter by location
    if (loc !== "All") {
      scored = scored.filter(e => e.location.toLowerCase().includes(loc.toLowerCase()) || e.mode === "Online");
    }

    // Filter by difficulty
    if (diff !== "All") {
      scored = scored.filter(e => e.difficulty.toLowerCase().includes(diff.toLowerCase()));
    }

    // Filter by search query
    if (query) {
      scored = scored.filter(e => {
        const text = [
          e.title,
          e.description,
          e.category,
          e.organization,
          e.location,
          ...(e.required_skills || []),
          ...(e.career_relevance || [])
        ].join(" ").toLowerCase();
        return text.includes(query);
      });
    }

    // Sort
    if (sort === "date") {
      scored.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === "popular") {
      scored.sort((a, b) => (b.registered_count || 0) - (a.registered_count || 0));
    } else {
      scored.sort((a, b) => b.matchScore - a.matchScore);
    }

    if (badge) badge.textContent = scored.length;

    if (scored.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full p-12 text-center bg-white rounded-3xl border border-slate-200">
          <div class="text-3xl mb-2">🔍</div>
          <h3 class="text-base font-bold text-slate-800">No Matching Opportunities Found</h3>
          <p class="text-xs text-slate-500 mt-1">Try clearing filters or broadening your search keywords.</p>
        </div>
      `;
    } else {
      grid.innerHTML = scored.map(e => renderEventCard(e)).join("");
    }
  }

  // ==========================================
  // PROFILE & AUTH FORM HANDLERS
  // ==========================================
  handleSignUp(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const skills = Array.from(form.querySelectorAll("input[name='skills']:checked")).map(el => el.value);
    const interests = Array.from(form.querySelectorAll("input[name='interests']:checked")).map(el => el.value);

    const newUser = {
      id: `user-custom-${Date.now()}`,
      name: formData.get("name"),
      email: formData.get("email"),
      role: formData.get("role") || "student",
      department: formData.get("department") || "Computer Science and Engineering",
      year: formData.get("year") || "3rd Year",
      location: formData.get("location") || "Chennai",
      college: "University Campus",
      career_goal: formData.get("career_goal") || "Software Engineer",
      experience_level: "Intermediate",
      skills: skills.length ? skills : ["Python", "Machine Learning"],
      interests: interests.length ? interests : ["Artificial Intelligence"],
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
    };

    storage.setCurrentUser(newUser);

    if (newUser.role === "organizer") {
      this.navigate("organizer-dashboard");
    } else {
      this.navigate("student-dashboard");
    }

    showToast("Welcome to ACE AI! Recommendations generated for your profile.", "success");
  }

  handleSignIn(e) {
    e.preventDefault();
    const email = e.target.email.value;
    showToast("Preparing your personalized ACE AI experience...", "info");

    setTimeout(() => {
      // Auto-login to Demo student 1 if demo credentials
      if (email.includes("sec") || email.includes("sam")) {
        storage.setCurrentUser(DEMO_USERS.student3);
      } else if (email.includes("alex") || email.includes("web")) {
        storage.setCurrentUser(DEMO_USERS.student2);
      } else if (email.includes("org") || email.includes("raman")) {
        storage.setCurrentUser(DEMO_USERS.organizer);
        this.navigate("organizer-dashboard");
        return;
      } else {
        storage.setCurrentUser(DEMO_USERS.student1);
      }

      this.navigate("student-dashboard");
      showToast("Signed in successfully!", "success");
    }, 400);
  }

  socialDemoLogin(provider) {
    showToast(`Connecting with ${provider}...`, "info");
    setTimeout(() => {
      this.loginDemo("student1");
    }, 400);
  }

  toggleRoleFields(role) {
    const studentFields = document.getElementById("student-extra-fields");
    if (studentFields) {
      studentFields.style.display = role === "student" ? "block" : "none";
    }
  }

  handleSaveProfile(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const skills = Array.from(form.querySelectorAll("input[name='skills']:checked")).map(el => el.value);
    const interests = Array.from(form.querySelectorAll("input[name='interests']:checked")).map(el => el.value);

    showToast("Updating your recommendations...", "info");

    const updated = storage.updateCurrentUserProfile({
      name: formData.get("name"),
      email: formData.get("email"),
      department: formData.get("department"),
      year: formData.get("year"),
      college: formData.get("college"),
      location: formData.get("location"),
      career_goal: formData.get("career_goal"),
      experience_level: formData.get("experience_level") || "Intermediate",
      skills: skills.length ? skills : ["Python"],
      interests: interests.length ? interests : ["Artificial Intelligence"]
    });

    setTimeout(() => {
      showToast("Your recommendations have been updated.", "success");
      this.navigate("for-you");
    }, 500);
  }

  // ==========================================
  // ORGANIZER AI ANALYSIS & PUBLISH
  // ==========================================
  triggerAIEventAnalysis() {
    const title = document.getElementById("draft-title").value;
    const description = document.getElementById("draft-description").value;

    if (!title || !description) {
      showToast("Please provide at least a title and description to analyze.", "warning");
      return;
    }

    showToast("Analyzing event context with AI semantic heuristics...", "info");

    const analysis = analyzeEventWithAI({ title, description });

    const resultsContainer = document.getElementById("ai-analysis-results");
    const categorySelect = document.getElementById("ai-category");
    const diffSelect = document.getElementById("ai-difficulty");
    const skillsInput = document.getElementById("ai-skills");
    const careerInput = document.getElementById("ai-career");

    if (resultsContainer) resultsContainer.classList.remove("hidden");
    if (categorySelect) categorySelect.value = analysis.smartCategory;
    if (diffSelect) diffSelect.value = analysis.difficulty;
    if (skillsInput) skillsInput.value = analysis.skillTags.join(", ");
    if (careerInput) careerInput.value = analysis.careerRelevance.join(", ");

    showToast("AI extraction completed! Review tags and publish.", "success");
  }

  handlePublishEvent(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const skillsStr = formData.get("required_skills") || "Python, Machine Learning";
    const careerStr = formData.get("career_relevance") || "AI Engineer, ML Engineer";

    const newEvent = {
      title: formData.get("title"),
      organization: formData.get("organization") || "TechFest Hub",
      description: formData.get("description"),
      category: formData.get("category") || "Hackathons",
      difficulty: formData.get("difficulty") || "Intermediate",
      required_skills: skillsStr.split(",").map(s => s.trim()).filter(Boolean),
      career_relevance: careerStr.split(",").map(s => s.trim()).filter(Boolean),
      date: `${formData.get("date")}T10:00:00`,
      registration_deadline: `${formData.get("date")}T23:59:59`,
      duration: formData.get("duration") || "24 Hours",
      eligibility: formData.get("eligibility") || "All Students",
      location: formData.get("location") || "Chennai",
      mode: formData.get("mode") || "Hybrid",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
      registration_url: "https://ACE AI.dev/demo/register/custom"
    };

    storage.saveNewEvent(newEvent);
    showToast("Event published successfully! Live in student recommendation feeds.", "success");
    this.navigate("organizer-dashboard");
  }

  // ==========================================
  // SETTINGS HANDLERS
  // ==========================================
  updateSetting(key, val) {
    storage.updateSettings({ [key]: val });
    showToast("Preferences saved.", "info");
  }

  handleClearHistory() {
    const user = storage.getCurrentUser();
    storage.clearUserInteractions(user.id);
    showToast("Interaction tracking history cleared for your account.", "info");
    this.render();
  }

  handleResetDemo() {
    if (confirm("Reset all events, users, and tracking history to demo baseline?")) {
      storage.resetToDemoBaseline();
    }
  }
}

// Instantiate global app controller
window.app = new AceAIApp();
