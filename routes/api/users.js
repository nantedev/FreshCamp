const express = require('express');
const router = express.Router();
const users = require('../../controllers/api/users');
const catchAsync = require('../../utils/catchAsync');
const passport = require('passport');

// Inscription
router.post('/register', catchAsync(users.register));

// Connexion
router.post('/login', users.login);

// Déconnexion
router.post('/logout', users.logout);

// Obtenir l'utilisateur courant
router.get('/me', users.getCurrentUser);

module.exports = router;
