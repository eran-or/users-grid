
(function(w){
    var db_mock = {
        hospitals: [
            {id: 1, name: "Saint George"},
            {id: 2, name: "Father Dave"},
            {id: 3, name: "Ichilov"},
            {id: 4, name: "Assuta"},
            {id: 5, name: "Saint Claire"},
            {id: 6, name: "Saint Nitsan"},
        ],
        users: [
            {
                id: 1,
                first_name: "Clarence J.",
                last_name: "Carpenter",
                email: "ClarenceJCarpenter@teleworm.us",
                permissions: {
                    all_hospitals: false,
                    hospitals: [2, 6]
                }
            },
            {
                id: 2,
                first_name: "Rebecca",
                last_name: "Caballero",
                email: "RebeccaRCaballero@teleworm.us",
                permissions: {
                    all_hospitals: false,
                    hospitals: [2, 3]
                }
            },
            {
                id: 3,
                first_name: "Peter",
                last_name: "Deguzman-Flores",
                email: "peter.flor@gmail.com",
                permissions: {
                    all_hospitals: false,
                    hospitals: [2, 6]
                }
            },
            {
                id: 4,
                first_name: "Dumby",
                last_name: "Dumb",
                email: "dumb.eldore@hogwarts.us",
                permissions: {
                    all_hospitals: false,
                    hospitals: []
                }
            },
            {
                id: 5,
                first_name: "Peggy J.",
                last_name: "Moore",
                email: "PeggyJMoore@armyspy.com",
                permissions: {
                    all_hospitals: false,
                    hospitals: [1, 2, 3, 4, 6]
                }
            },
            {
                id: 6,
                first_name: "Mena",
                last_name: "Hell",
                email: "i.am.the.fucking.manager@cool.com",
                permissions: {
                    all_hospitals: true,
                    hospitals: []
                }
            },
            {
                id: 7,
                first_name: "Karen",
                last_name: "Kumar",
                email: "KarenMKumar@rhyta.com",
                permissions: {
                    all_hospitals: false,
                    hospitals: [6]
                }
            },
        ],
        next_user_id: 8
    };
    
    function failSometimes(callback, error_prefix, resolve, reject) {
        if (Math.random() < 0.2) {
            reject({
                success: false,
                error: error_prefix + ": Database is busy"
            });
        } else {
            try {
                resolve(callback());
            } catch (error) {
                reject({ success: false, error: error });
            }
        }
    }

    function runDelayed(callback) {
        var delay_ms = parseInt(Math.random() < 0.2 ? Math.random() * 5000 : Math.random() * 300);
        setTimeout(callback, delay_ms);
    }

    function createPromiseFactory(callback, error) {
        return function() {
            var args = [].slice.call(arguments);
            return new Promise(function(resolve, reject) {
                runDelayed(
                    failSometimes(Object.bind.apply(callback, [null].concat(args)),
                                  error, resolve, reject)
                );
            });
        };
    }

    function copyUser(user) {
        return Object.assign({}, user, {
            permissions: {
                all_hospitals: user.permissions.all_hospitals,
                hospitals: [].concat(user.permissions.hospitals)
            }
        });
    }

    function copyShallow(obj) {
        return Object.assign({}, obj);
    }

    w.medAPI = {
        users: {
            list: createPromiseFactory(function() { return db_mock.users.map(copyUser); }, "Failed listing users"),

            get: createPromiseFactory(function(user_id) {
                var found = db_mock.users.filter(function(user) { return user.id === user_id; });
                if (found.length !== 1)
                    throw new Error("Wrong user_id");

                return copyUser(found[0]);
            }, "Failed getting specified user"),

            add: createPromiseFactory(function(first_name, last_name, email, all_hospitals_permission, hospitals_permissions) {
                if (typeof all_hospitals_permission !== "boolean")
                    throw new Error("all_hospitals_permission should be boolean");

                if (!Array.isArray(hospitals_permissions))
                    throw new Error("hospitals_permissions should be an array");

                if (!first_name || !last_name || !email)
                    throw new Error("All fields are required");
                
                if (db_mock.users.filter(function(user) { return user.email === email; }).length > 0)
                    throw new Error("User with the given email already exists");

                hospitals_permissions.map(function(hospital) {
                    if (db_mock.hospitals.filter(function(h) { return h.id === hospital; }).length === 0)
                        throw new Error("Invalid hospital id: " + hospital);
                    return hospital    
                });

                var user = {
                    id: db_mock.next_user_id++,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    permissions: {
                        all_hospitals: all_hospitals_permission,
                        hospitals: [].concat(hospitals_permissions)
                    }
                };
                db_mock.users.push(user);

                return {
                    success: true,
                    user: copyUser(user)
                };
            }, "Failed getting specified user"),

            update: createPromiseFactory(function(user_id, update_obj) {
                var found = db_mock.users.filter(function(user) { return user.id === user_id; });
                if (found.length !== 1)
                    throw new Error("Wrong user_id");
                
                var user = found[0];
                // Ignore the 'id' attribute, it can't be changed
                if (update_obj.id && update_obj.id !== user_id)
                    throw new Error("User ID can't be changed");

                delete update_obj["id"];
                
                if (update_obj.permissions) {
                    if (typeof update_obj.permissions.all_hospitals !== "boolean")
                        throw new Error("permissions.all_hospitals should be boolean");

                    if (!Array.isArray(update_obj.permissions.hospitals))
                        throw new Error("permissions.hospitals should be an array");
                }

                if (update_obj.permissions && !(update_obj.permissions.all_hospitals && update_obj.permissions.hospitals)) {
                    return { success: true, user: Object.assign(user, copyUser(update_obj)) };
                } else {
                    return { success: false };
                }
            }, "Failed updating specified user"),
        },

        hospitals: {
            list: createPromiseFactory(function() { return db_mock.hospitals.map(copyShallow); }, "Failed listing hospitals"),
            get: createPromiseFactory(function(hospital_id) {
                var found = db_mock.hospitals.filter(function(hospital) { return hospital.id === hospital_id; });
                if (found.length !== 1)
                    throw new Error("Wrong hospital_id");

                return copyShallow(found[0]);
            }, "Failed getting specified hospital"),
        }
    };
})(window);