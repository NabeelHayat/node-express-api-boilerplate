import httpStatus from "http-status";
import passport from 'passport';
import Promise from "bluebird";

import Roles from "../helpers/roles";
import { failureReponse } from "./apiResponse";
import { authenticateJwt } from "../shared/auth.service";

const handleJwt = (req, res, next, roles) => async (err, user, info) => {
    const error = err || info;
    const message = error ? error.message : 'Unauthorized';
    const errors = error ? error : undefined;
    const apiError = failureReponse(httpStatus.UNAUTHORIZED, message, errors);

    const reqLogin = Promise.promisify(req.login);

    try {
        if (error || !user) throw error;
        await reqLogin(user, { session: false });
    } catch (e) {
        return next(apiError);
    }

    if (roles === Roles.LOGGED_USER) {
        if (user.role !== Roles.ADMIN && req.params.userId !== user._id.toString()) {
            apiError.status = httpStatus.FORBIDDEN;
            apiError.message = 'Forbidden';
            return next(apiError);
        }
    } else if (!roles.includes(user.role)) {
        apiError.status = httpStatus.FORBIDDEN;
        apiError.message = 'Forbidden';
        return next(apiError);
    } else if (err || !user) {
        return next(apiError);
    }

    req.user = user;

    return next();
};

export const ADMIN = Roles.ADMIN;
export const LOGGED_USER = Roles.LOGGED_USER;

export const authorize = (roles = [Roles.USER]) => (req, res, next) => 
    authenticateJwt(handleJwt(req, res, next, roles))(req, res, next);