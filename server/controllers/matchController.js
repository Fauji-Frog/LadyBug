const Match = require('../models/Match');
const matchingService = require('../services/matchingService');

/**
 * Helper function to format match objects cleanly for API responses.
 * Contains bookTitle, edition, buyer/seller information, seller price,
 * match date, and notification status as requested.
 */
function formatMatch(match) {
  return {
    _id: match._id,
    bookId: match.bookId,
    bookTitle: match.bookTitle,
    edition: match.edition,
    sellerId: match.sellerId,
    sellerName: match.sellerName,
    buyerId: match.buyerId,
    buyerName: match.buyerName,
    price: match.price,
    status: match.status,
    notificationStatus: match.notificationStatus,
    matchDate: match.matchDate,
    availableBook: match.availableBook,
    wantedBook: match.wantedBook
  };
}

/**
 * API 1: Run Matching
 * Method: POST
 * Endpoint: /api/matches/run
 * 
 * Runs the matching service, creates new matches, prevents duplicates,
 * and returns the summary and newly created match records.
 */
exports.runMatching = async (req, res) => {
  try {
    const summary = await matchingService.findAndCreateMatches();

    const formattedData = summary.matches.map(formatMatch);

    return res.status(200).json({
      success: true,
      message:
        summary.matchesCreated > 0
          ? `${summary.matchesCreated} new matching book(s) found`
          : 'No new matches found',
      summary: {
        totalAvailable: summary.totalAvailable,
        totalWanted: summary.totalWanted,
        matchesCreated: summary.matchesCreated,
        matchesSkipped: summary.matchesSkipped
      },
      data: formattedData
    });
  } catch (error) {
    console.error('Error running book matching:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to run matching process',
      error: error.message
    });
  }
};

/**
 * API 2: Get All Matches
 * Method: GET
 * Endpoint: /api/matches
 * 
 * Returns all matching records in the system with populated relationships.
 */
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('availableBook')
      .populate('wantedBook')
      .sort({ matchDate: -1 });

    const formattedData = matches.map(formatMatch);

    return res.status(200).json({
      success: true,
      message:
        formattedData.length > 0
          ? 'Matching books found'
          : 'No matches found',
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching all matches:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve matches',
      error: error.message
    });
  }
};

/**
 * API 3: Get Student Matches
 * Method: GET
 * Endpoint: /api/matches/:studentId
 * 
 * Returns matches where the given student is either the buyer OR seller.
 */
exports.getStudentMatches = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'studentId parameter is required'
      });
    }

    // Query for matches where student is buyer OR seller
    const matches = await Match.find({
      $or: [{ buyerId: studentId }, { sellerId: studentId }]
    })
      .populate('availableBook')
      .populate('wantedBook')
      .sort({ matchDate: -1 });

    const formattedData = matches.map(formatMatch);

    return res.status(200).json({
      success: true,
      message:
        formattedData.length > 0
          ? `Matches retrieved for student: ${studentId}`
          : `No matches found for student: ${studentId}`,
      data: formattedData
    });
  } catch (error) {
    console.error('Error fetching student matches:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student matches',
      error: error.message
    });
  }
};
