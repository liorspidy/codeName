const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/getRooms', roomController.getRooms);
router.get('/:id/getRoom', roomController.getRoom);
router.get('/:id/getPlayers', roomController.getPlayers);
router.get('/:id/getMessages', roomController.getMessages);

router.post('/create', roomController.createRoom);
router.post('/join', roomController.joinRoom);
router.post('/:id/setStatus', roomController.setStatus);
router.post('/:id/setCards', roomController.setCards);
router.post('/:id/setTurn', roomController.setTurn);
router.post('/:id/setPlayers', roomController.setPlayers);
router.post('/:id/setTeamPlayers', roomController.setTeamPlayers);
router.post('/:id/setPlayerNotReady', roomController.setPlayerNotReady);
router.post('/:id/setMap', roomController.setMap);
router.post('/:id/setUsersScore', roomController.setUsersScore);
router.post('/:id/nextRound', roomController.nextRound);
router.post('/:id/nextTurn', roomController.nextTurn);
router.post('/:id/setOperatorsWord', roomController.setOperatorsWord);
router.post('/:id/setWordsToGuess', roomController.setWordsToGuess);
router.post('/:id/updateRevealedCards', roomController.updateRevealedCards);
router.post('/:id/setWinner', roomController.setWinner);
router.post('/:id/setScore', roomController.setScore);
router.post('/:id/leaveRoom', roomController.leaveRoom);
router.post('/:id/reset', roomController.resetRoom);
router.post('/:id/updateTimer', roomController.updateTimer);
router.post('/:id/sendMessage', roomController.sendMessage);
router.post('/:id/readMessages', roomController.readMessages);

module.exports = router;
