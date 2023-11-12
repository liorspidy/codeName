const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, roomController.getRooms);
router.get('/:id', authMiddleware, roomController.getRoom);
router.get('/:id/players', authMiddleware, roomController.getPlayers);
router.get('/:id/cards', authMiddleware, roomController.getCards);
router.get('/:id/board', authMiddleware, roomController.getBoard);
router.get('/:id/turn', authMiddleware, roomController.getTurn);
router.get('/:id/round', authMiddleware, roomController.getRound);
router.get('/:id/started', authMiddleware, roomController.getStarted);
router.get('/:id/ended', authMiddleware, roomController.getEnded);
router.get('/:id/winner', authMiddleware, roomController.getWinner);
router.get('/:id/loser', authMiddleware, roomController.getLoser);

router.post('/create', authMiddleware, roomController.createRoom);
router.post('/join', authMiddleware, roomController.joinRoom);
router.post('/start', authMiddleware, roomController.startGame);
router.post('/play', authMiddleware, roomController.playTurn);
router.post('/leave', authMiddleware, roomController.leaveRoom);
router.post('/end', authMiddleware, roomController.endGame);
router.post('/delete', authMiddleware, roomController.deleteRoom);
router.post('/reset', authMiddleware, roomController.resetRoom);

module.exports = router;
