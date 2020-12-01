const { ObjectId } = require("mongodb");

const clearUser = (req) => {
    req.session.userPresent = null;
    req.session.userEmail = null;
    req.session = null;
    req.currentUser = null;
    return;
}

const ensureSecure = (req, res, next) => {
    //Heroku stores the origin protocol in a header variable. The app itself is isolated within the dyno and all request objects have an HTTP protocol.
    if (req.get('X-Forwarded-Proto')=='https' || req.hostname == 'localhost') {
        //Serve Node.js App by passing control to the next middleware
        next();
    } else if(req.get('X-Forwarded-Proto')!='https' && req.get('X-Forwarded-Port')!='443'){
        //Redirect if not HTTP with original request URL
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