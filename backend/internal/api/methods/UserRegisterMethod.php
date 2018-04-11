<?php
namespace api;

include_once __DIR__ . '/../Method.php';
include_once __DIR__ . '/../models/User.php';

class UserRegisterMethod extends Method {
    public $path = 'user/register';

    public final function execute($args) {
        // Prevent concurrent sessions
        if ($this->api->user->logged_in) {
            throw new Exception('already logged in');
        }
        
        // Assert that parameters were passed and are the correct type
        if (!isset($args['username']) || !is_string($args['username'])) {
            throw new Exception('missing username');
        } else if (!isset($args['password']) || !is_string($args['password'])) {
            throw new Exception('missing password');
        } else if (!isset($args['email']) || !is_string($args['email'])) {
            throw new Exception('missing email');
        }

        // Alias the arguments to variables
        $username = $args['username'];
        $password = $args['password'];
        $email = $args['email'];

        // Validate username
        if (strlen($username) < 4) {
            throw new Exception('usernames must be at least 4 characters long');
        } else if (strlen($username) > 20) {
            throw new Exception('usernames can only be up to 20 characters long');
        } else if (!preg_match('/^[a-zA-Z](?:[a-zA-Z0-9_]*[a-zA-Z0-9])?$/', $username)) {
            throw new Exception('usernames can only contain alphanumeric characters and underscores, and must start with '
                . 'a letter and end with a number or letter.');
        }

        // Validate password
        if (strlen($password) < 8) {
            throw new Exception('passwords must be at lest 8 characters long');
        }

        // Validate email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception('invalid email');
        }

        // Check for existing username/email
        $existing_user = $this->api->db->query(
            'SELECT username, email FROM users WHERE username = ? OR email = ? LIMIT 1',
            [$username, $email]
        )->fetchAll();
        if (count($existing_user) > 0) {
            if (strtolower($username) === strtolower($existing_user[0]['username'])) {
                throw new Exception('A user with that username already exists.');
            } else if (strtolower($username) === strtolower($existing_user[0]['email'])) {
                throw new Exception('A user with that email address already exists.');
            } else {
                // "Just in case" fallback.
                throw new Exception('A user with those credentials already exists.');
            }
        }

        // Insert new user
        $this->api->db->query(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            [$username, password_hash($password, PASSWORD_DEFAULT), $email]
        );

        // Update the session
        $new_user_id = (int) $this->api->db->last_insert_id();
        $_SESSION['user_id'] = $new_user_id;
        $this->api->user = new User($this->api, $new_user_id);

        // Return the new user data
        return $this->api->user->get_user_data();
    }
}
?>
