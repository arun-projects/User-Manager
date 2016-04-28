$(document).ready(function() {

    var router = Router({
        "/edit/:userId": showUserEdit,
        "/users": showUsers
    }).init("/users");

    function showUsers() {
        var userRef = new Firebase("[your endpoint]/users");

        var userTemplateSource = $("#users-template").html();
        var userTemplate = Handlebars.compile(userTemplateSource);

        $("#user-form").on("submit", function(event) {
            event.preventDefault();

            var newUser = {
                firstname: $("#firstname").val(),
                lastname: $("#lastname").val(),
                email: $("#email").val(),
                username: $("#username").val()
            };

            userRef.push(newUser);

            $("#user-form")[0].reset();
            $("#add-user-modal").modal("hide");
        });

        userRef.on("value", function(results) {
            var users = results.val();

            $("#main-view").html(userTemplate({
                users: users
            }));
        });
    }

    function showUserEdit(userId) {
        var editUserRef = new Firebase("[your endpoint]/users/" + userId);

        editUserRef.once("value", function(results) {
            var user = results.val();

            var editTemplateSource = $("#edit-user-template").html();
            var editTemplate = Handlebars.compile(editTemplateSource);

            $("#main-view").html(editTemplate(user));
        });

        $("#edit-user-form").on("submit", function(event) {
            event.preventDefault();

            var editUser = {
                firstname: $("#edit-firstname").val(),
                lastname: $("#edit-lastname").val(),
                email: $("#edit-email").val(),
                username: $("#edit-username").val()
            };

            editUserRef.update(editUser, function() {
                router.setRoute("/users");
            });
        });
    }

});
