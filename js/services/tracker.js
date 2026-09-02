/**
 * ACE AI Active View & Interaction Tracker
 * Tracks active engagement time on event pages with tab visibility detection.
 * Privacy-compliant: Only tracks active time inside ACE AI tabs.
 */

import { storage } from "./storage.js";

class EventTracker {
  constructor() {
    this.currentEventId = null;
    this.startTime = null;
    this.accumulatedSeconds = 0;
    this.intervalId = null;
    this.isPaused = false;
    this.lastTickTime = null;

    this.initSession();
    this.setupVisibilityListener();
  }

  initSession() {
    if (!sessionStorage.getItem("aceai_session_id")) {
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem("aceai_session_id", sessionId);
    }
  }

  setupVisibilityListener() {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.pause();
      } else if (document.visibilityState === "visible") {
        this.resume();
      }
    });

    window.addEventListener("beforeunload", () => {
      this.stopAndSave();
    });
  }

  /**
   * Starts tracking active view duration for an event
   * @param {string} eventId 
   */
  startViewing(eventId) {
    // If already tracking another event, save it first
    if (this.currentEventId && this.currentEventId !== eventId) {
      this.stopAndSave();
    }

    this.currentEventId = eventId;
    this.accumulatedSeconds = 0;
    this.startTime = Date.now();
    this.lastTickTime = Date.now();
    this.isPaused = false;

    if (this.intervalId) clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      if (!this.isPaused && this.currentEventId) {
        const now = Date.now();
        const deltaSec = Math.floor((now - this.lastTickTime) / 1000);
        if (deltaSec >= 1) {
          this.accumulatedSeconds += deltaSec;
          this.lastTickTime = now;
          this.updateDevIndicator();
        }
      }
    }, 1000);

    this.updateDevIndicator();
  }

  pause() {
    if (!this.isPaused && this.currentEventId) {
      this.isPaused = true;
      const now = Date.now();
      const deltaSec = Math.floor((now - this.lastTickTime) / 1000);
      if (deltaSec > 0) {
        this.accumulatedSeconds += deltaSec;
      }
      this.updateDevIndicator(true);
    }
  }

  resume() {
    if (this.isPaused && this.currentEventId) {
      this.isPaused = false;
      this.lastTickTime = Date.now();
      this.updateDevIndicator();
    }
  }

  /**
   * Stops tracking and saves the interaction record
   * @returns {number} duration in seconds
   */
  stopAndSave() {
    if (!this.currentEventId) return 0;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Capture any remaining partial seconds
    if (!this.isPaused && this.lastTickTime) {
      const deltaSec = Math.floor((Date.now() - this.lastTickTime) / 1000);
      if (deltaSec > 0) {
        this.accumulatedSeconds += deltaSec;
      }
    }

    const duration = this.accumulatedSeconds;
    const eventId = this.currentEventId;

    // Only log if duration is at least 2 seconds to avoid accidental bounce noise
    if (duration >= 2) {
      storage.logInteraction({
        event_id: eventId,
        interaction_type: "view",
        duration_seconds: duration
      });
    }

    this.currentEventId = null;
    this.accumulatedSeconds = 0;
    this.startTime = null;
    this.lastTickTime = null;

    const devBadge = document.getElementById("dev-tracker-badge");
    if (devBadge) {
      devBadge.style.display = "none";
    }

    return duration;
  }

  /**
   * Updates floating/inline development indicator
   */
  updateDevIndicator(isPaused = false) {
    const devBadge = document.getElementById("dev-tracker-badge");
    if (!devBadge) return;

    const settings = storage.getSettings();
    if (!settings.showDevDebugTimer || !this.currentEventId) {
      devBadge.style.display = "none";
      return;
    }

    devBadge.style.display = "flex";
    const mins = String(Math.floor(this.accumulatedSeconds / 60)).padStart(2, "0");
    const secs = String(this.accumulatedSeconds % 60).padStart(2, "0");

    const timeDisplay = document.getElementById("dev-tracker-time");
    const statusDisplay = document.getElementById("dev-tracker-status");

    if (timeDisplay) timeDisplay.textContent = `${mins}:${secs}`;
    if (statusDisplay) {
      statusDisplay.textContent = isPaused ? "Paused (Tab inactive)" : "Active Tracking";
      statusDisplay.className = isPaused 
        ? "text-xs text-amber-400 font-medium" 
        : "text-xs text-emerald-400 font-medium";
    }
  }

  /**
   * Tracks custom user interaction events
   * @param {string} type 'search' | 'save' | 'register' | 'category_click' | 'share'
   * @param {object} metadata 
   */
  track(type, metadata = {}) {
    storage.logInteraction({
      interaction_type: type,
      event_id: metadata.eventId || null,
      query: metadata.query || null,
      category_clicked: metadata.category || null,
      duration_seconds: metadata.duration || 0
    });
  }
}

export const tracker = new EventTracker();
