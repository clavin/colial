<?php
namespace api;

include_once __DIR__ . '/../Method.php';
include_once __DIR__ . '/../models/User.php';

class SessionLoginMethod extends Method {
    public $path = 'session/login';

    public final function execute($args) {
        // Prevent concurrent sessions
        if ($this->api->user->logged_in) {
            throw new Exception('already logged in');
        }

        // Assert that the parameters were passed and are the correct type
        if (!isset($args['username']) || !is_string($args['username'])) {
            throw new Exception('missing username');
        } else if (!isset($args['password']) || !is_string($args['password'])) {
            throw new Exception('missing password');
        }

        // Alias the arguments to variables
        $username = $args['username'];
        $password = $args['password'];

        // Sanity-check the username
        if (strlen($username) < 4) {
            throw new Exception('usernames must be at least 4 characters long');
        } else if (strlen($username) > 20) {
            throw new Exception('usernames can only be up to 20 characters long');
        } else if (!preg_match('/^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$/', $username)) {
            throw new Exception('usernames can only contain alphanumeric characters and underscores, and must start with '
                . 'a letter and end with a number or letter.');
        }

        // Find user
        $user = $this->api->db->query(
            'SELECT id, username, password FROM users WHERE username = ? LIMIT 1',
            [$username]
        )->fetchAll();
        if (count($user) === 0) {
            throw new Exception('Cannot find a user with that username.');
        }

        // Check password
        if (!password_verify($password, $user[0]['password'])) {
            // TODO: throttle excess attempts
            throw new Exception('Incorrect password.');
        }

        // Update the session
        $user_id = (int) $user[0]['id'];
        $_SESSION['user_id'] = $user_id;
        $this->api->user = new User($this->api, $user_id);

        // Return the new user data
        return $this->api->user->get_user_data();
    }
}
?>
