const clearUser = (req) => {
    req.session.userPresent = null;
    req.session.userEmail = null;
    req.session = null;
    req.currentUser = null;
    return;
}

module.exports = { clearUser }; 