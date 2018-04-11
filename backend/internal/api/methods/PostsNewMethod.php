<?php
namespace api;

include_once __DIR__ . '/../Method.php';

class PostsNewMethod extends Method {
    public $path = 'posts/new';

    public final function execute($args) {
        // Assert that the user is logged in
        if (!$this->api->user->logged_in) {
            throw new Exception('not logged in');
        }

        // Assert the parameter was passed and is the correct type
        if (!isset($args['color']) || !is_string($args['color'])) {
            throw new Exception('missing color');
        }

        // Assert the color is a valid hex color
        if (strlen($args['color']) !== 6 || !preg_match('/^[0-9a-f]+$/i', $args['color'])) {
            throw new Exception('invalid color');
        }

        // Make the post
        $post_time = time();
        $this->api->db->query(
            'INSERT INTO posts (poster_id, color, timestamp) VALUES (?, ?, ?)',
            [$this->api->user->id, $args['color'], $post_time]
        );

        // Store the post's info
        $result = [
            'id' => (int) $this->api->db->last_insert_id(),
            'userId' => $this->api->user->id,
            'username' => $this->api->user->get_username(),
            'timestamp' => $post_time,
            'color' => '#' . $args['color']
        ];

        // Send out an email to followers
        /* NOTE: mail server not set up
        $follower_emails = $this->api->db->query(
            'SELECT email FROM users WHERE id IN (
                SELECT follower_id AS id FROM user_follows WHERE following_id = ?
            )',
            [$this->api->user->id]
        )->fetchAll();
        foreach ($follower_emails as $email_row) {
            mail(
                $email_row['email'],
                $this->api->user->get_username() . ' just made a new post!',
                'Come check it out!', // if there was one, a url could be put here.
                ['From' => 'admin@localhost']
            );
        }
        */

        return $result;
    }
}
?>
