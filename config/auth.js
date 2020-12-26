module.exports = {
    checkAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
          }
        res.redirect('/user/login');
    },
    checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect('/')
        }
        next()
    }
};