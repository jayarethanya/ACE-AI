/**
 * ACE AI Multi-Factor Recommendation Engine
 * Aligned with HackGURU 2.1: Personalized Event Recommendation
 * 
 * Computes:
 * - Skill Match (30% / 27%)
 * - Interest Match (20% / 18%)
 * - Career Goal Match (20% / 18%)
 * - Location Match (10% / 9%)
 * - Content Similarity via TF-IDF & Cosine (20% / 18%)
 * - Behavioral Interaction Signals (10%)
 */

import {
  tokenize,
  computeTF,
  computeIDF,
  computeCosineSimilarity,
  createStudentText,
  createEventText
} from "./tfidf.js";

/**
 * Normalizes skill strings for robust matching (e.g., "ML" -> "machine learning")
 * @param {string} skill 
 * @returns {string}
 */
export function normalizeSkill(skill) {
  if (!skill) return "";
  const s = skill.toLowerCase().trim();
  if (s === "ml") return "machine learning";
  if (s === "ai") return "artificial intelligence";
  if (s === "dl") return "deep learning";
  if (s === "js") return "javascript";
  if (s === "ts") return "typescript";
  if (s === "k8s") return "kubernetes";
  return s;
}

/**
 * Calculates Skill Match between student skills and event required skills.
 * @param {string[]} studentSkills 
 * @param {string[]} eventRequiredSkills 
 * @returns {{ score: number, matching: string[], missing: string[] }}
 */
export function calculateSkillMatch(studentSkills = [], eventRequiredSkills = []) {
  if (!eventRequiredSkills || eventRequiredSkills.length === 0) {
    return { score: 100, matching: [...studentSkills], missing: [] };
  }

  const normalizedStudent = (studentSkills || []).map(normalizeSkill);
  const matching = [];
  const missing = [];

  for (const required of eventRequiredSkills) {
    const normReq = normalizeSkill(required);
    const isMatched = normalizedStudent.some(userSkill => 
      userSkill === normReq || 
      userSkill.includes(normReq) || 
      normReq.includes(userSkill)
    );

    if (isMatched) {
      matching.push(required);
    } else {
      missing.push(required);
    }
  }

  const rawScore = (matching.length / eventRequiredSkills.length) * 100;
  const score = Math.round(rawScore);

  return { score, matching, missing };
}

/**
 * Calculates Interest Match between student interests and event attributes.
 * @param {string[]} studentInterests 
 * @param {object} event 
 * @returns {{ score: number, matchedInterests: string[] }}
 */
export function calculateInterestMatch(studentInterests = [], event = {}) {
  if (!studentInterests || studentInterests.length === 0) {
    return { score: 50, matchedInterests: [] };
  }

  const eventContent = [
    event.category || "",
    event.title || "",
    event.description || "",
    ...(event.required_skills || []),
    ...(event.career_relevance || [])
  ].join(" ").toLowerCase();

  const matchedInterests = [];

  for (const interest of studentInterests) {
    const normInterest = interest.toLowerCase().trim();
    if (eventContent.includes(normInterest)) {
      matchedInterests.push(interest);
    } else {
      // Check partial/token match (e.g. "AI" in "AI Healthcare Hackathon")
      const tokens = normInterest.split(/\s+/);
      if (tokens.some(t => t.length > 1 && eventContent.includes(t))) {
        matchedInterests.push(interest);
      }
    }
  }

  // Calculate score based on ratio of matched interests and density in event
  const matchRatio = matchedInterests.length / studentInterests.length;
  let score = Math.min(100, Math.round(matchRatio * 90 + (matchedInterests.length > 0 ? 10 : 0)));
  
  if (matchedInterests.length === 0) score = 25; // Base fallback

  return { score, matchedInterests };
}

/**
 * Calculates Career Match between student career goal and event career relevance.
 * @param {string} careerGoal 
 * @param {string[]} careerRelevance 
 * @returns {{ score: number, matchedGoal: string | null }}
 */
export function calculateCareerMatch(careerGoal = "", careerRelevance = []) {
  if (!careerGoal || !careerRelevance || careerRelevance.length === 0) {
    return { score: 60, matchedGoal: null };
  }

  const normGoal = careerGoal.toLowerCase().trim();
  const relevanceNorm = careerRelevance.map(r => r.toLowerCase().trim());

  // 1. Direct exact or substring match
  for (const rel of relevanceNorm) {
    if (rel === normGoal || normGoal.includes(rel) || rel.includes(normGoal)) {
      return { score: 100, matchedGoal: careerGoal };
    }
  }

  // 2. Token overlap match (e.g. "Machine Learning Engineer" vs "AI Engineer")
  const goalTokens = normGoal.split(/\s+/).filter(t => t.length > 2 && t !== "engineer" && t !== "developer");
  for (const rel of relevanceNorm) {
    const relTokens = rel.split(/\s+/).filter(t => t.length > 2 && t !== "engineer" && t !== "developer");
    const hasOverlap = goalTokens.some(gt => relTokens.some(rt => gt.includes(rt) || rt.includes(gt)));
    if (hasOverlap) {
      return { score: 85, matchedGoal: careerGoal };
    }
  }

  // 3. Domain alignment check
  const isAI = normGoal.includes("ai") || normGoal.includes("machine learning") || normGoal.includes("data");
  const isWeb = normGoal.includes("web") || normGoal.includes("frontend") || normGoal.includes("full stack");
  const isCyber = normGoal.includes("security") || normGoal.includes("cyber") || normGoal.includes("penetration");
  const isCloud = normGoal.includes("cloud") || normGoal.includes("devops");

  for (const rel of relevanceNorm) {
    if (isAI && (rel.includes("ai") || rel.includes("ml") || rel.includes("data"))) return { score: 80, matchedGoal: careerGoal };
    if (isWeb && (rel.includes("web") || rel.includes("frontend") || rel.includes("stack"))) return { score: 80, matchedGoal: careerGoal };
    if (isCyber && (rel.includes("security") || rel.includes("cyber") || rel.includes("soc"))) return { score: 80, matchedGoal: careerGoal };
    if (isCloud && (rel.includes("cloud") || rel.includes("devops") || rel.includes("reliability"))) return { score: 80, matchedGoal: careerGoal };
  }

  return { score: 35, matchedGoal: null };
}

/**
 * Calculates Location Match score.
 * Online events are location-flexible (100%). Exact cities get 100%. Hybrid gets 75%-100%. Other in-person gets 40%.
 * @param {string} studentLocation 
 * @param {object} event 
 * @returns {number}
 */
export function calculateLocationMatch(studentLocation = "", event = {}) {
  const mode = (event.mode || "").toLowerCase();
  const eventLoc = (event.location || "").toLowerCase().trim();
  const studLoc = (studentLocation || "").toLowerCase().trim();

  // Online is always 100% accessible
  if (mode === "online" || eventLoc === "online") return 100;

  // Exact location match
  if (studLoc && eventLoc && (studLoc === eventLoc || eventLoc.includes(studLoc) || studLoc.includes(eventLoc))) {
    return 100;
  }

  // Hybrid in another city
  if (mode === "hybrid") return 75;

  // In-person in different location
  return 40;
}

/**
 * Calculates Behavioral Interest score based on user interaction logs.
 * @param {string} eventId 
 * @param {object} event 
 * @param {Array} interactions 
 * @returns {{ score: number, durationSeconds: number, isSaved: boolean, isRegistered: boolean, viewCount: number }}
 */
export function calculateBehavioralScore(eventId, event, interactions = []) {
  if (!interactions || interactions.length === 0) {
    return { score: 50, durationSeconds: 0, isSaved: false, isRegistered: false, viewCount: 0 };
  }

  const eventInteractions = interactions.filter(i => i.event_id === eventId);
  const totalDuration = eventInteractions
    .filter(i => i.interaction_type === "view")
    .reduce((sum, i) => sum + (i.duration_seconds || 0), 0);

  const viewCount = eventInteractions.filter(i => i.interaction_type === "view").length;
  const isSaved = interactions.some(i => i.event_id === eventId && i.interaction_type === "save");
  const isRegistered = interactions.some(i => i.event_id === eventId && i.interaction_type === "register");

  // Duration points according to spec:
  // 0-10s -> 5%, 10-30s -> 15%, 30-60s -> 30%, 60-120s -> 50%, 120s+ -> 70%
  let durationScore = 0;
  if (totalDuration > 120) durationScore = 70;
  else if (totalDuration >= 60) durationScore = 50;
  else if (totalDuration >= 30) durationScore = 30;
  else if (totalDuration >= 10) durationScore = 15;
  else if (totalDuration > 0) durationScore = 5;

  // Saves (+15%) and Registrations (+25%)
  let actionScore = (isSaved ? 15 : 0) + (isRegistered ? 25 : 0);

  // Category and keyword interaction affinity
  const categoryInteractions = interactions.filter(i => {
    const cat = (event.category || "").toLowerCase();
    return i.category_clicked === cat || (i.event_category && i.event_category.toLowerCase() === cat);
  }).length;

  const categoryBonus = Math.min(15, categoryInteractions * 3);

  // Search keyword affinity
  const searchInteractions = interactions.filter(i => i.interaction_type === "search");
  let searchBonus = 0;
  const eventTitle = (event.title || "").toLowerCase();
  for (const s of searchInteractions) {
    const query = (s.query || "").toLowerCase();
    if (query && eventTitle.includes(query)) {
      searchBonus += 5;
    }
  }
  searchBonus = Math.min(15, searchBonus);

  // If no direct interaction with this event, give neutral baseline + category/search affinity
  if (eventInteractions.length === 0 && !isSaved && !isRegistered) {
    const baseline = 50 + categoryBonus + searchBonus;
    return {
      score: Math.min(95, Math.max(20, Math.round(baseline))),
      durationSeconds: 0,
      isSaved: false,
      isRegistered: false,
      viewCount: 0
    };
  }

  const totalRaw = durationScore + actionScore + categoryBonus + searchBonus + (viewCount > 1 ? 10 : 0);
  const score = Math.min(100, Math.max(10, Math.round(totalRaw)));

  return { score, durationSeconds: totalDuration, isSaved, isRegistered, viewCount };
}

/**
 * Generates natural language Explainable AI rationale for why this event was recommended.
 * @param {object} breakdown 
 * @param {object} student 
 * @param {object} event 
 * @returns {{ reasons: string[], summaryText: string }}
 */
export function generateRecommendationExplanation(breakdown, student, event) {
  const reasons = [];

  // Skill matches
  if (breakdown.matchingSkills && breakdown.matchingSkills.length > 0) {
    for (const skill of breakdown.matchingSkills) {
      reasons.push(`✓ ${skill} matches your skills`);
    }
  }

  // Missing skills hint
  if (breakdown.missingSkills && breakdown.missingSkills.length > 0) {
    reasons.push(`💡 Opportunity to develop ${breakdown.missingSkills.join(", ")}`);
  }

  // Interests
  if (breakdown.matchedInterests && breakdown.matchedInterests.length > 0) {
    reasons.push(`✓ ${breakdown.matchedInterests.join(", ")} matches your interests`);
  }

  // Career
  if (breakdown.careerScore >= 80 && student.career_goal) {
    reasons.push(`✓ ${student.career_goal} matches your career goal`);
  }

  // Location
  if (breakdown.locationScore === 100) {
    if ((event.mode || "").toLowerCase() === "online") {
      reasons.push(`✓ Flexible online event format`);
    } else {
      reasons.push(`✓ ${event.location} matches your preferred location`);
    }
  }

  // Behavior
  if (breakdown.behaviorScore >= 60 || breakdown.durationSeconds > 30) {
    reasons.push(`✓ You have shown strong engagement with similar ${event.category || "events"}`);
  }

  // Honest explainable text
  let summaryText = "";
  if (breakdown.matchingSkills && breakdown.matchingSkills.length > 0 && breakdown.careerScore >= 80) {
    summaryText = `ACE AI recommends this event because your profile contains ${breakdown.matchingSkills.join(" and ")} skills, your interests include ${(breakdown.matchedInterests || ["technology"]).join(", ")}, and your career goal is ${student.career_goal || "in this domain"}. You have also shown affinity for ${event.category || "these opportunities"}.`;
  } else if (breakdown.matchingSkills && breakdown.matchingSkills.length === 0) {
    summaryText = `Your profile currently has limited skill overlap with this event, but this ${event.category || "program"} is an excellent opportunity to bridge your skill gap in ${(breakdown.missingSkills || ["new technologies"]).join(", ")}.`;
  } else {
    summaryText = `This event aligns well with your interest in ${(breakdown.matchedInterests || [event.category]).join(", ")} and supports your aspiration towards becoming a ${student.career_goal || "tech leader"}.`;
  }

  return { reasons, summaryText };
}

/**
 * Main Recommendation Engine function.
 * Evaluates all events against the student profile and user interactions.
 * 
 * @param {object} student Student profile
 * @param {object[]} events Event catalog
 * @param {object[]} interactions User interaction history
 * @returns {object[]} Ranked array of events with complete score breakdowns
 */
export function recommendEvents(student, events = [], interactions = []) {
  if (!student || !events || events.length === 0) return [];

  // 1. Build TF-IDF Corpus
  const studentText = createStudentText(student);
  const studentTokens = tokenize(studentText);
  const studentTF = computeTF(studentTokens);

  const corpusTokens = events.map(e => tokenize(createEventText(e)));
  // Include student text in corpus for global IDF calculation
  const allCorpusTokens = [...corpusTokens, studentTokens];
  const idfMap = computeIDF(allCorpusTokens);

  // 2. Score every event
  const scoredEvents = events.map((event, index) => {
    // A. Skill Match (30%)
    const skillRes = calculateSkillMatch(student.skills, event.required_skills);
    
    // B. Interest Match (20%)
    const interestRes = calculateInterestMatch(student.interests, event);

    // C. Career Match (20%)
    const careerRes = calculateCareerMatch(student.career_goal, event.career_relevance);

    // D. Location Match (10%)
    const locationScore = calculateLocationMatch(student.location, event);

    // E. Content Similarity via TF-IDF (20%)
    const eventTF = computeTF(corpusTokens[index]);
    const similarityScore = computeCosineSimilarity(studentTF, eventTF, idfMap);

    // F. Behavioral Interaction Signal
    const behaviorRes = calculateBehavioralScore(event.id, event, interactions);

    // Has user interaction occurred? Use spec formula:
    // Final Score = 0.27 * Skill + 0.18 * Interest + 0.18 * Career + 0.09 * Location + 0.18 * ContentSim + 0.10 * Behavioral
    const finalScoreFloat = 
      (0.27 * skillRes.score) +
      (0.18 * interestRes.score) +
      (0.18 * careerRes.score) +
      (0.09 * locationScore) +
      (0.18 * similarityScore) +
      (0.10 * behaviorRes.score);

    const finalScore = Math.min(100, Math.max(1, Math.round(finalScoreFloat)));

    const breakdown = {
      skillScore: skillRes.score,
      matchingSkills: skillRes.matching,
      missingSkills: skillRes.missing,
      interestScore: interestRes.score,
      matchedInterests: interestRes.matchedInterests,
      careerScore: careerRes.score,
      matchedGoal: careerRes.matchedGoal,
      locationScore: locationScore,
      similarityScore: similarityScore,
      behaviorScore: behaviorRes.score,
      durationSeconds: behaviorRes.durationSeconds,
      isSaved: behaviorRes.isSaved,
      isRegistered: behaviorRes.isRegistered,
      finalScore: finalScore
    };

    const explanation = generateRecommendationExplanation(breakdown, student, event);

    return {
      ...event,
      matchScore: finalScore,
      breakdown: breakdown,
      reasons: explanation.reasons,
      explanationText: explanation.summaryText
    };
  });

  // 3. Sort primarily by final calculated score descending
  scoredEvents.sort((a, b) => b.matchScore - a.matchScore);

  return scoredEvents;
}
