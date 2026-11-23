const Book = require('../models/Book');

/**
 * Clean and normalize a book title:
 * Converts to lowercase, trims whitespace, collapses multiple spaces
 */
const normalizeTitle = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
};

/**
 * Escapes regex special characters
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Search the main title and verified aliases for a matching book.
 * Exact case-insensitive comparison after space normalization.
 */
const findBookByTitleOrAlias = async (submittedTitle) => {
  const normalized = normalizeTitle(submittedTitle);
  if (!normalized) return null;

  const escaped = escapeRegex(normalized);
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
 * Generates a beginner-friendly unique Book ID (e.g. B001 or BK-4912)
 */
const generateBookId = () => {
  const randomPart = Math.floor(100 + Math.random() * 900);
  return `B${randomPart}`;
};

module.exports = {
  normalizeTitle,
  escapeRegex,
  findBookByTitleOrAlias,
  generateBookId
};
