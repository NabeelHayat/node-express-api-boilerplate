const AuthController = {}

/**
 * Returns jwt token if registration was successful
 * @public
 */
AuthController.register = async (req, res, next) => {
	try {
		const userData = omit(req.body, 'role');
		const user = await new User(userData).save();
		const userTransformed = user.transform();
		const token = generateTokenResponse(user, user.token());
		res.status(httpStatus.CREATED);
		return res.json({ token, user: userTransformed });
	} catch (error) {
		return next(User.checkDuplicateEmail(error));
	}
};

export default AuthController;