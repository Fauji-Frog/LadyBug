const Book = require('../models/Book');

/**
 * Clean and normalize a book title:
 * 1. Convert to lowercase
 * 2. Trim whitespace from start and end
 * 3. Replace multiple consecutive spaces with a single space
 * 
 * Example: "  Thomas   Calculus  " => "thomas calculus"
 */
const normalizeTitle = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
};

/**
 * Escapes regex special characters so user text is matched literally
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Search the main title and verified aliases for a matching book.
 * Exact case-insensitive comparison after space normalization.
 * 
 * Rules:
 * - No AI or fuzzy matching.
 * - Compares normalized title against main title and aliases array.
 * 
 * Returns:
 * - Existing Book document if found.
 * - null if no verified book/alias is found.
 */
const findBookByTitleOrAlias = async (submittedTitle) => {
  const normalized = normalizeTitle(submittedTitle);
  if (!normalized) return null;

  const escaped = escapeRegex(normalized);
  // Match exact normalized string case-insensitively
  const exactRegex = new RegExp(`^${escaped}$`, 'i');

  const existingBook = await Book.findOne({
    $or: [
      { title: { $regex: exactRegex } },
      { aliases: { $regex: exactRegex } }
    ]
  });

  return existingBook;
};

/**
 * Generates a beginner-friendly unique Book ID
 * Example: BK-173233
 */
const generateBookId = () => {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  const timePart = Date.now().toString().slice(-4);
  return `BK-${timePart}${randomPart}`;
};

module.exports = {
  normalizeTitle,
  escapeRegex,
  findBookByTitleOrAlias,
  generateBookId
};
