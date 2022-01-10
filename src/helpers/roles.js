/**
 * Role permissions enum
 */
const Roles = {
	admin: 'Admin',
	user: 'User',

	map: () => {
		return [
			{ value: Roles.user },
			{ value: Roles.admin }
		];
	},

	isValidRole: (role) => {
		let valid = false;
		Roles.map().forEach((item) => {
			if (item.value === role) valid = true;
		});
		return valid;
	}
};

export default Roles;