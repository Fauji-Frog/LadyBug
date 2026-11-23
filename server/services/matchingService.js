const AvailableBook = require('../models/AvailableBook');
const WantedBook = require('../models/WantedBook');
const Match = require('../models/Match');

/**
 * Automatic Book Matching Service
 * 
 * Compares available books and active wanted books using simple JavaScript loops
 * and conditional checks according to the 4 matching rules:
 *   Rule 1: Same Book ID
 *   Rule 2: Exact same edition (no unknown or missing editions)
 *   Rule 3: Price is ignored during matching, seller price is recorded
 *   Rule 4: Seller status must be 'Available' and wanted status must be 'Active'
 * 
 * Prevents duplicates by checking existing Match records.
 */
async function findAndCreateMatches() {
  // Step 1: Fetch all Available books (Rule 4)
  const availableBooks = await AvailableBook.find({ status: 'Available' });

  // Step 2: Fetch all Active wanted books (Rule 4)
  const wantedBooks = await WantedBook.find({ status: 'Active' });

  const createdMatches = [];
  let matchesCreated = 0;
  let matchesSkipped = 0;

  // Step 3: Loop through each available book
  for (let i = 0; i < availableBooks.length; i++) {
    const available = availableBooks[i];

    // Step 4: Loop through each wanted book
    for (let j = 0; j < wantedBooks.length; j++) {
      const wanted = wantedBooks[j];

      // --- Rule 1: Book ID check ---
      if (!available.bookId || !wanted.bookId || available.bookId !== wanted.bookId) {
        continue;
      }

      // --- Rule 2: Edition check ---
      // Both editions must be present, valid, and exactly the same
      if (!available.edition || !wanted.edition) {
        continue;
      }

      const availableEd = available.edition.toString().trim();
      const wantedEd = wanted.edition.toString().trim();

      // Missing or unknown editions must never match
      if (
        availableEd === '' ||
        wantedEd === '' ||
        availableEd.toLowerCase() === 'unknown' ||
        wantedEd.toLowerCase() === 'unknown'
      ) {
        continue;
      }

      // Editions must match exactly (case-insensitive trim comparison for robustness)
      if (availableEd.toLowerCase() !== wantedEd.toLowerCase()) {
        continue;
      }

      // --- Rule 3: Price is ignored during matching ---
      // Seller's actual price (available.price) will be saved in the Match record

      // --- Rule 4: Status validation ---
      if (available.status !== 'Available' || wanted.status !== 'Active') {
        continue;
      }

      // --- Duplicate Prevention ---
      // Check if this pair has already been matched
      const existingMatch = await Match.findOne({
        availableBook: available._id,
        wantedBook: wanted._id
      });

      if (existingMatch) {
        matchesSkipped++;
        continue;
      }

      // --- Create new Match record & Website Notification ---
      const newMatch = new Match({
        availableBook: available._id,
        wantedBook: wanted._id,
        bookId: available.bookId,
        bookTitle: available.bookTitle,
        edition: available.edition,
        sellerId: available.sellerId,
        sellerName: available.sellerName,
        buyerId: wanted.buyerId,
        buyerName: wanted.buyerName,
        price: available.price, // Rule 3: Seller's actual price
        status: 'New',
        notificationStatus: 'Unread', // Website notification status
        matchDate: new Date()
      });

      const savedMatch = await newMatch.save();
      createdMatches.push(savedMatch);
      matchesCreated++;
    }
  }

  // Return matching summary
  return {
    totalAvailable: availableBooks.length,
    totalWanted: wantedBooks.length,
    matchesCreated,
    matchesSkipped,
    matches: createdMatches
  };
}

module.exports = {
  findAndCreateMatches
};
