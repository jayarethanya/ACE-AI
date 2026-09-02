/**
 * ACE AI Storage & State Management Service
 * Manages LocalStorage persistence for Users, Events, Interactions, Saves, and Registrations.
 */

import { INITIAL_EVENTS } from "../data/events.js";
import { DEMO_USERS } from "../data/demo-users.js";

const STORAGE_KEYS = {
  CURRENT_USER: "aceai_current_user",
  CUSTOM_USERS: "aceai_custom_users",
  EVENTS: "aceai_events",
  INTERACTIONS: "aceai_interactions",
  SAVED_EVENTS: "aceai_saved_events",
  REGISTRATIONS: "aceai_registrations",
  SETTINGS: "aceai_settings"
};

class StorageService {
  constructor() {
    this.init();
  }

  init() {
    // Initialize events if not present
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
    }

    // Initialize default current user to Demo Student 1 (Jaya)
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      this.setCurrentUser(DEMO_USERS.student1);
    }

    // Initialize interactions table
    if (!localStorage.getItem(STORAGE_KEYS.INTERACTIONS)) {
      // Seed minimal baseline interactions for rich demo feel
      const seedInteractions = [
        {
          id: "int-seed-1",
          user_id: DEMO_USERS.student1.id,
          event_id: "event-101",
          interaction_type: "view",
          duration_seconds: 45,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          session_id: "sess-init"
        }
      ];
      localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(seedInteractions));
    }

    // Initialize saved events table
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify([]));
    }

    // Initialize registrations table
    if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify([]));
    }

    // Initialize settings
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
        personalizationEnabled: true,
        showDevDebugTimer: true,
        notifications: true,
        theme: "light"
      }));
    }
  }

  // --- Current User Management ---
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return userStr ? JSON.parse(userStr) : DEMO_USERS.student1;
    } catch (e) {
      return DEMO_USERS.student1;
    }
  }

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("aceai:user-changed", { detail: user }));
  }

  updateCurrentUserProfile(updatedData) {
    const currentUser = this.getCurrentUser();
    const merged = { ...currentUser, ...updatedData };
    this.setCurrentUser(merged);
    return merged;
  }

  // --- Events Database ---
  getEvents() {
    try {
      const eventsStr = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return eventsStr ? JSON.parse(eventsStr) : INITIAL_EVENTS;
    } catch (e) {
      return INITIAL_EVENTS;
    }
  }

  getEventById(id) {
    const events = this.getEvents();
    return events.find(e => e.id === id) || null;
  }

  saveNewEvent(newEvent) {
    const events = this.getEvents();
    const eventRecord = {
      ...newEvent,
      id: newEvent.id || `event-${Date.now()}`,
      registered_count: 0,
      banner_gradient: newEvent.banner_gradient || "from-purple-950 via-indigo-900 to-slate-900"
    };
    events.unshift(eventRecord);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    window.dispatchEvent(new CustomEvent("aceai:events-updated", { detail: events }));
    return eventRecord;
  }

  // --- User Interactions ---
  getInteractions(userId = null) {
    try {
      const allStr = localStorage.getItem(STORAGE_KEYS.INTERACTIONS);
      const all = allStr ? JSON.parse(allStr) : [];
      if (!userId) return all;
      return all.filter(i => i.user_id === userId);
    } catch (e) {
      return [];
    }
  }

  /**
   * Records a user interaction.
   * Fields: id, user_id, event_id, interaction_type, duration_seconds, timestamp, session_id
   * Possible types: view, search, save, register, share, category_click
   */
  logInteraction(interaction) {
    const user = this.getCurrentUser();
    if (!user || user.role === "organizer") return;

    const record = {
      id: `int-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: interaction.user_id || user.id,
      event_id: interaction.event_id || null,
      interaction_type: interaction.interaction_type || "view",
      duration_seconds: interaction.duration_seconds || 0,
      query: interaction.query || null,
      category_clicked: interaction.category_clicked || null,
      timestamp: new Date().toISOString(),
      session_id: sessionStorage.getItem("aceai_session_id") || "session-default"
    };

    const all = this.getInteractions();
    all.push(record);
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(all));

    window.dispatchEvent(new CustomEvent("aceai:interaction-logged", { detail: record }));
    return record;
  }

  clearUserInteractions(userId) {
    const all = this.getInteractions();
    const filtered = all.filter(i => i.user_id !== userId);
    localStorage.setItem(STORAGE_KEYS.INTERACTIONS, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent("aceai:interactions-cleared"));
  }

  // --- Saved Events ---
  getSavedEventIds(userId) {
    try {
      const allStr = localStorage.getItem(STORAGE_KEYS.SAVED_EVENTS);
      const all = allStr ? JSON.parse(allStr) : [];
      return all.filter(s => s.user_id === userId).map(s => s.event_id);
    } catch (e) {
      return [];
    }
  }

  isEventSaved(userId, eventId) {
    const saved = this.getSavedEventIds(userId);
    return saved.includes(eventId);
  }

  toggleSaveEvent(userId, eventId) {
    const allStr = localStorage.getItem(STORAGE_KEYS.SAVED_EVENTS);
    let all = allStr ? JSON.parse(allStr) : [];
    const isAlreadySaved = all.some(s => s.user_id === userId && s.event_id === eventId);

    if (isAlreadySaved) {
      all = all.filter(s => !(s.user_id === userId && s.event_id === eventId));
      localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify(all));
      return { saved: false };
    } else {
      const newSave = {
        id: `save-${Date.now()}`,
        user_id: userId,
        event_id: eventId,
        timestamp: new Date().toISOString()
      };
      all.push(newSave);
      localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify(all));

      // Log save interaction for behavior learning
      this.logInteraction({
        user_id: userId,
        event_id: eventId,
        interaction_type: "save"
      });

      return { saved: true };
    }
  }

  // --- Registrations ---
  getRegistrations(userId) {
    try {
      const allStr = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      const all = allStr ? JSON.parse(allStr) : [];
      return all.filter(r => r.user_id === userId);
    } catch (e) {
      return [];
    }
  }

  isRegistered(userId, eventId) {
    const registrations = this.getRegistrations(userId);
    return registrations.some(r => r.event_id === eventId);
  }

  registerForEvent(userId, eventId, notes = "") {
    const allStr = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    const all = allStr ? JSON.parse(allStr) : [];

    if (all.some(r => r.user_id === userId && r.event_id === eventId)) {
      return { success: false, message: "Already registered" };
    }

    const regRecord = {
      id: `REG-${Math.floor(100000 + Math.random() * 900000)}`,
      user_id: userId,
      event_id: eventId,
      timestamp: new Date().toISOString(),
      status: "Confirmed",
      ticket_type: "Student Delegate Pass",
      notes: notes
    };

    all.push(regRecord);
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(all));

    // Update event registration count
    const events = this.getEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.registered_count = (event.registered_count || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    }

    // Log registration interaction for strong behavioral signal
    this.logInteraction({
      user_id: userId,
      event_id: eventId,
      interaction_type: "register"
    });

    window.dispatchEvent(new CustomEvent("aceai:registered", { detail: regRecord }));
    return { success: true, registration: regRecord };
  }

  // --- Settings ---
  getSettings() {
    try {
      const setStr = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return setStr ? JSON.parse(setStr) : { personalizationEnabled: true, showDevDebugTimer: true };
    } catch (e) {
      return { personalizationEnabled: true, showDevDebugTimer: true };
    }
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const merged = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    return merged;
  }

  // --- Reset to Demo Baseline ---
  resetToDemoBaseline() {
    localStorage.clear();
    this.init();
    window.location.reload();
  }
}

export const storage = new StorageService();
