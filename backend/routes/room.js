const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.getRooms);
router.get('/:id/getRoom', roomController.getRoom);
router.get('/:id/getPlayers', roomController.getPlayers);

router.post('/create', roomController.createRoom);
router.post('/join', roomController.joinRoom);
router.post('/:id/start', roomController.startGame);
router.post('/:id/setCards', roomController.setCards);
router.post('/:id/setTurn', roomController.setTurn);
router.post('/:id/setTeamPlayers', roomController.setTeamPlayers);
router.post('/:id/setMap', roomController.setMap);
router.post('/:id/checkCard', roomController.checkCard);
router.post('/:id/nextTurn', roomController.nextTurn);

router.post('/:id/leave', roomController.leaveRoom);
router.post('/:id/end', roomController.endGame);
router.post('/:id/delete', roomController.deleteRoom);
router.post('/:id/reset', roomController.resetRoom);

module.exports = router;
