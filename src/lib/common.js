const { ObjectId } = require("mongodb");

const clearUser = (req) => {
    req.session.userPresent = null;
    req.session.userEmail = null;
    req.session = null;
    req.currentUser = null;
    return;
}

const ensureSecure = (req, res, next) => {
    if (req.get('X-Forwarded-Proto')=='https' || req.hostname == 'localhost') {
        next();
    } else if(req.get('X-Forwarded-Proto')!='https' && req.get('X-Forwarded-Port')!='443'){
        res.redirect('https://' + req.hostname + req.url);
    }
}

const getId = (id) => {
    if(id.length !== 24) {
        return id;
    }
    return ObjectId(id);
}


module.exports = { clearUser, ensureSecure, getId }; 