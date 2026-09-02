/**
 * ACE AI TF-IDF & Cosine Similarity Engine
 * Pure mathematical implementation for content-based profile-event similarity matching.
 */

const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "cannot", "could", "did", "do", "does", "doing", "don't", "down", "during", "each", "few",
  "for", "from", "further", "had", "has", "have", "having", "he", "her", "here", "hers", "herself",
  "him", "himself", "his", "how", "i", "if", "in", "into", "is", "isn't", "it", "its", "itself",
  "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on",
  "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same",
  "she", "should", "so", "some", "such", "than", "that", "the", "their", "theirs", "them", "themselves",
  "then", "there", "these", "they", "this", "those", "through", "to", "too", "under", "until", "up",
  "very", "was", "wasn't", "we", "were", "weren't", "what", "when", "where", "which", "while", "who",
  "whom", "why", "with", "won't", "would", "you", "your", "yours", "yourself", "yourselves", "will",
  "also", "using", "work", "world", "across", "bring", "including"
]);

/**
 * Tokenizes and normalizes raw text into clean term tokens.
 * @param {string} text 
 * @returns {string[]}
 */
export function tokenize(text) {
  if (!text || typeof text !== "string") return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/[-_]/g, " ")
    .split(/\s+/)
    .map(token => token.trim())
    .filter(token => token.length > 1 && !STOP_WORDS.has(token));
}

/**
 * Computes Term Frequency (TF) dictionary for a document token list.
 * Uses augmented term frequency to prevent bias towards long documents:
 * TF(t, d) = 0.5 + 0.5 * (count(t, d) / max_count(d))
 * @param {string[]} tokens 
 * @returns {Map<string, number>}
 */
export function computeTF(tokens) {
  const counts = new Map();
  if (!tokens.length) return counts;

  for (const token of tokens) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }

  let maxCount = 0;
  for (const count of counts.values()) {
    if (count > maxCount) maxCount = count;
  }

  const tfMap = new Map();
  for (const [term, count] of counts.entries()) {
    // Sublinear TF or standard augmented TF
    tfMap.set(term, 0.5 + (0.5 * count) / maxCount);
  }
  return tfMap;
}

/**
 * Computes Inverse Document Frequency (IDF) dictionary across a corpus of documents.
 * IDF(t) = ln((1 + |D|) / (1 + df(t))) + 1 (Smooth IDF standard)
 * @param {string[][]} corpusTokensList 
 * @returns {Map<string, number>}
 */
export function computeIDF(corpusTokensList) {
  const docCount = corpusTokensList.length;
  const dfMap = new Map();

  for (const tokens of corpusTokensList) {
    const uniqueTerms = new Set(tokens);
    for (const term of uniqueTerms) {
      dfMap.set(term, (dfMap.get(term) || 0) + 1);
    }
  }

  const idfMap = new Map();
  for (const [term, df] of dfMap.entries()) {
    idfMap.set(term, Math.log((1 + docCount) / (1 + df)) + 1);
  }
  return idfMap;
}

/**
 * Calculates the Cosine Similarity between a student query/profile vector and a target document vector.
 * @param {Map<string, number>} tfQuery 
 * @param {Map<string, number>} tfDoc 
 * @param {Map<string, number>} idfMap 
 * @returns {number} Score normalized between 0 and 100
 */
export function computeCosineSimilarity(tfQuery, tfDoc, idfMap) {
  let dotProduct = 0;
  let queryNormSq = 0;
  let docNormSq = 0;

  // Compute weights for query terms
  for (const [term, tfQ] of tfQuery.entries()) {
    const idf = idfMap.get(term) || 1.0;
    const wQ = tfQ * idf;
    queryNormSq += wQ * wQ;

    if (tfDoc.has(term)) {
      const tfD = tfDoc.get(term);
      const wD = tfD * idf;
      dotProduct += wQ * wD;
    }
  }

  // Compute norm for document terms
  for (const [term, tfD] of tfDoc.entries()) {
    const idf = idfMap.get(term) || 1.0;
    const wD = tfD * idf;
    docNormSq += wD * wD;
  }

  if (queryNormSq === 0 || docNormSq === 0) return 0;

  const similarity = dotProduct / (Math.sqrt(queryNormSq) * Math.sqrt(docNormSq));
  // Scale cleanly to 0 - 100 with non-linear boost for meaningful high matches
  const normalized = Math.min(100, Math.max(0, Math.round(similarity * 100)));
  return normalized;
}

/**
 * Creates rich representation text from student profile
 * @param {object} student 
 * @returns {string}
 */
export function createStudentText(student) {
  if (!student) return "";
  const skills = (student.skills || []).join(" ");
  const interests = (student.interests || []).join(" ");
  const career = student.career_goal || "";
  const dept = student.department || "";
  const bio = student.bio || "";
  // Emphasize core skills & career goal with double weighting in text
  return `${skills} ${skills} ${interests} ${career} ${career} ${dept} ${bio}`;
}

/**
 * Creates rich representation text from an event object
 * @param {object} event 
 * @returns {string}
 */
export function createEventText(event) {
  if (!event) return "";
  const title = event.title || "";
  const desc = event.description || "";
  const cat = event.category || "";
  const skills = (event.required_skills || []).join(" ");
  const career = (event.career_relevance || []).join(" ");
  const org = event.organization || "";
  // Emphasize title, category & required skills
  return `${title} ${title} ${cat} ${skills} ${skills} ${career} ${desc} ${org}`;
}
