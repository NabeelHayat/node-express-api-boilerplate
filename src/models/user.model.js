/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { v1 as uuidv1 } from 'uuid';
import passportLocalMongoose from 'passport-local-mongoose';

import APIError from '../helpers/APIError';
import Roles from '../helpers/roles';
import { paginate, toJSON } from '../plugins';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
	_id: { type: String, default: _ => uuidv1() },
	email: {
		type: String,
		required: true,
		unique: true, // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
		match: [
			// eslint-disable-next-line no-useless-escape
			/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please enter a valid email',
		],
	},
	password: { type: String },
	phoneNumber: { type: String },
	userId: { type: String, unique: true },
	token: { type: String, unique: true },
	createdAt: { type: Date, default: Date.now },
	role: { type: String, enum: Roles.getRoles(), default: 'user' },
	deviceToken: { type: String, unique: true, default: '---' },
	deviceType: { type: String },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

// add plugin that converts mongoose to json
UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

/**
 * Methods
 */
UserSchema.method({
	authenticateUser(password) {
		return compareSync(password, this.password);
	},
});

/**
 * Statics
 */
UserSchema.statics = {
	/**
	 * Get user
	 * @param {ObjectId} id - The objectId of user.
	 * @returns {Promise<User, APIError>}
	 */
	get(id) {
	  return this.findById(id)
	    .exec()
	    .then(user => {
	      if (user) {
	        return user;
	      }
	      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND, {});
	      return Promise.reject(err);
	    });
	},

	/**
	 * Get user by email
	 * @param {String} email - The string of user.
	 * @returns {Promise<User, APIError>}
	 */
	getByEmail(email) {
		const regex = new RegExp(`${email}`, 'i');
		return this.findOne({ email: { $regex: regex } })
			.exec()
			.then(user => {
				if (user) {
					return user;
				}
				const err = new APIError('No such user exists!', httpStatus.NOT_FOUND, {});
				return Promise.reject(err);
			});
	},

	/**
	 * Get user by phoneNumber
	 * @param {String} phoneNumber - The string of user.
	 * @returns {Promise<User, APIError>}
	 */
	getByPhoneNumber(phoneNumber) {
		return this.findOne({ phoneNumber })
			.exec()
			.then(user => {
				if (user) {
					return user;
				}
				const err = new APIError('No such user exists!', httpStatus.NOT_FOUND, {});
				return Promise.reject(err);
			});
	},

	/**
	 * Get user by userId
	 * @param {String} userId - The string id of user.
	 * @returns {Promise<User, APIError>}
	 */
	getByUserId(userId) {
		return this.findOne({ userId })
			.exec()
			.then(user => {
				if (user) {
					return user;
				}
				const err = new APIError('No such user exists!', httpStatus.NOT_FOUND, {});
				return Promise.reject(err);
			});
	},

	/**
	 * List users in descending order of 'createdAt' timestamp.
	 * @param {number} skip - Number of users to be skipped.
	 * @param {number} limit - Limit number of users to be returned.
	 * @returns {Promise<User[]>}
	 */
	list({ skip = 0, limit = 50 } = {}) {
	  return this.find()
	    .sort({ createdAt: -1 })
	    .skip(skip)
	    .limit(limit)
	    .exec();
	},
};

UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
