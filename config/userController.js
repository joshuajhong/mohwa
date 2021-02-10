const User = require('./../models/users')
const { roles } = require('../config/roles')

exports.grantAccess = function(action, resource) {
    return async (req, res, next) => {
      try {
        const permission = roles.can(req.user.role)[action](resource);
        if (!permission.granted) {
          return res.status(401).json({
            error: "You don't have enough permission to perform this action"
          });
        }
        next()
      } catch (error) {
        next(error)
      }
    }
}
  
exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = req.user
        if (!user)
        return res.status(401).json({
            error: "You need to be logged in to access this route"
        });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        const { role } = req.body
        const userId = req.params.userId;
        await User.findByIdAndUpdate(userId, { role });
        const user = await User.findById(userId)
        res.status(200).json({
        data: user
        });
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        await User.findByIdAndDelete(userId);
        res.status(200).json({
        data: null,
        message: 'User has been deleted'
        });
    } catch (error) {
        next(error)
    }
}