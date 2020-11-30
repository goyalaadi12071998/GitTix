const clearUser = (req) => {
    req.session = null;
    req.userPresent = null;
    req.userEmail = null;
    return;
}

module.exports = { clearUser };