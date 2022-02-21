const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../../../models/user.model');

const UserController = {};

/**
 * Load user and append to req.
 *
 * @public
 * @param req
 * @param res
 * @param next
 * @param id
 */
UserController.load = async (req, res, next, id) => {
    try {
        const user = await User.get(id);

        req.locals = { user };

        return next();
    } catch (error) {
        return next(error);
    }
};

/**
 * Get user.
 *
 * @public
 * @param req
 * @param res
 */
UserController.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info.
 *
 * @public
 * @param req
 * @param res
 */
UserController.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user.
 *
 * @public
 * @param req
 * @param res
 * @param next
 */
UserController.create = async (req, res, next) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();

        res.status(httpStatus.CREATED);
        res.json(savedUser.transform());
    } catch (error) {
        next(User.checkDuplicateEmail(error));
    }
};

/**
 * Replace existing user.
 *
 * @public
 * @param req
 * @param res
 * @param next
 */
UserController.replace = async (req, res, next) => {
    try {
        const { user } = req.locals;
        const newUser = new User(req.body);
        const ommitRole = user.role !== 'admin' ? 'role' : '';
        const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

        await user.updateOne(newUserObject, { override: true, upsert: true });
        const savedUser = await User.findById(user._id);

        res.json(savedUser.transform());
    } catch (error) {
        next(User.checkDuplicateEmail(error));
    }
};

/**
 * Update existing user.
 *
 * @public
 * @param req
 * @param res
 * @param next
 */
UserController.update = (req, res, next) => {
    const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
    const updatedUser = omit(req.body, ommitRole);
    const user = Object.assign(req.locals.user, updatedUser);

    user.save()
        .then((savedUser) => res.json(savedUser.transform()))
        .catch((e) => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list.
 *
 * @public
 * @param req
 * @param res
 * @param next
 */
UserController.list = async (req, res, next) => {
    try {
        const users = await User.list(req.query);
        const transformedUsers = users.map((user) => user.transform());

        res.json(transformedUsers);
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user.
 *
 * @public
 * @param req
 * @param res
 * @param next
 */
UserController.remove = (req, res, next) => {
    const { user } = req.locals;

    user.remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};

module.exports =  UserController;
