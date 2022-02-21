/**
 * Role permissions enum.
 */
const Roles = {
    ADMIN: 'admin',
    USER: 'user',
    LOGGED_USER: '_loggedUser',

    map: () => {
        return [{ value: Roles.USER }, { value: Roles.ADMIN }, { value: Roles.LOGGED_USER }];
    },

    isValidRole: (role) => {
        let valid = false;

        Roles.map().forEach((item) => {
            if (item.value === role) valid = true;
        });

        return valid;
    },

    getRoles: () => {
        return [Roles.ADMIN, Roles.USER, Roles.LOGGED_USER];
    }
};

module.exports =  Roles;
