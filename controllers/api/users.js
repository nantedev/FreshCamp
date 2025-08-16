const User = require('../../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Fonction utilitaire pour générer un token JWT
const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, username: user.username, email: user.email },
        process.env.SECRET || 'devsecret',
        { expiresIn: '7d' }
    );
};

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        
        // Connecter l'utilisateur après l'inscription
        req.login(registeredUser, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const token = generateToken(registeredUser);
            return res.status(201).json({
                message: 'Inscription réussie',
                user: {
                    _id: registeredUser._id,
                    username: registeredUser.username,
                    email: registeredUser.email
                },
                token
            });
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
        
        req.login(user, (err) => {
            if (err) return next(err);
            
            const token = generateToken(user);
            return res.json({
                message: 'Connexion réussie',
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                },
                token
            });
        });
    })(req, res, next);
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Déconnexion réussie' });
    });
};

module.exports.getCurrentUser = (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Non authentifié' });
    }
    
    res.json({
        user: {
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email
        }
    });
};
