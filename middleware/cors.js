// Middleware CORS pour permettre les requêtes depuis notre application React
module.exports = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // URL de l'application React
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Pour les requêtes OPTIONS (préflight)
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
};
