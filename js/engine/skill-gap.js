/**
 * ACE AI Skill Gap Analysis Engine
 * Evaluates student skill readiness for events and identifies targeted learning pathways.
 */

import { calculateSkillMatch } from "./recommender.js";

/**
 * Performs a comprehensive skill gap analysis between a student and an event.
 * @param {object} student 
 * @param {object} event 
 * @param {object[]} allEvents Catalog of all events to find bridge learning workshops
 * @returns {object} Detailed gap diagnostic
 */
export function analyzeSkillGap(student, event, allEvents = []) {
  if (!student || !event) {
    return {
      matchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
      totalRequired: 0,
      readinessLevel: "Needs Preparation",
      bridgingEvents: [],
      learningPaths: []
    };
  }

  const skillResult = calculateSkillMatch(student.skills || [], event.required_skills || []);
  const totalRequired = (event.required_skills || []).length;
  const matchCount = skillResult.matching.length;

  let readinessLevel = "High Readiness";
  let readinessColor = "text-emerald-400";
  let readinessBg = "bg-emerald-500/10 border-emerald-500/30";

  if (totalRequired === 0 || matchCount === totalRequired) {
    readinessLevel = "Full Match - Ready to Compete";
  } else if (matchCount >= Math.ceil(totalRequired * 0.6)) {
    readinessLevel = "Moderate Match - Minor Gap";
    readinessColor = "text-indigo-400";
    readinessBg = "bg-indigo-500/10 border-indigo-500/30";
  } else if (matchCount > 0) {
    readinessLevel = "Emerging Match - Bridge Skills Required";
    readinessColor = "text-amber-400";
    readinessBg = "bg-amber-500/10 border-amber-500/30";
  } else {
    readinessLevel = "Foundational - High Learning Curve";
    readinessColor = "text-rose-400";
    readinessBg = "bg-rose-500/10 border-rose-500/30";
  }

  // Find bridging events that teach the missing skills
  const missingSet = new Set(skillResult.missing.map(s => s.toLowerCase().trim()));
  const bridgingEvents = [];

  for (const otherEvent of allEvents) {
    if (otherEvent.id === event.id) continue;
    
    // Check if this other event teaches or covers any missing skill
    const otherSkills = (otherEvent.required_skills || []).map(s => s.toLowerCase().trim());
    const coversMissing = otherSkills.some(s => missingSet.has(s)) ||
      (otherEvent.title && Array.from(missingSet).some(m => otherEvent.title.toLowerCase().includes(m))) ||
      (otherEvent.description && Array.from(missingSet).some(m => otherEvent.description.toLowerCase().includes(m)));

    if (coversMissing && (otherEvent.category === "Workshops" || otherEvent.category === "Bootcamps" || otherEvent.category === "Webinars")) {
      const skillsAddressed = (otherEvent.required_skills || []).filter(s => missingSet.has(s.toLowerCase().trim()));
      bridgingEvents.push({
        ...otherEvent,
        skillsAddressed: skillsAddressed.length > 0 ? skillsAddressed : skillResult.missing
      });
    }
  }

  // Curated learning pathways for common tech domains
  const learningPaths = skillResult.missing.map(missingSkill => {
    return {
      skill: missingSkill,
      estimatedHours: 12,
      difficulty: "Fast-track",
      recommendedType: "Hands-on Workshop / Bootcamp"
    };
  });

  return {
    matchPercentage: skillResult.score,
    matchedSkills: skillResult.matching,
    missingSkills: skillResult.missing,
    totalRequired: totalRequired,
    matchedCount: matchCount,
    readinessLevel,
    readinessColor,
    readinessBg,
    bridgingEvents: bridgingEvents.slice(0, 3),
    learningPaths
  };
}
