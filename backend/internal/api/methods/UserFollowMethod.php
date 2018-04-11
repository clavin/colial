<?php
namespace api;

include_once __DIR__ . '/../Method.php';

class UserFollowMethod extends Method {
    public $path = 'user/follow';

    public final function execute($args) {
        // Assert that the accessor is logged in
        if (!$this->api->user->logged_in) {
            throw new Exception('not logged in');
        }

        // Assert that the target user id argument is present and correctly typed
        if (!isset($args['id']) || !is_integer($args['id'])) {
            throw new Exception('missing id');
        }

        // Assert that a user can't follow themselves
        if ($args['id'] === $this->api->user->id) {
            throw new Exception('cannot follow self');
        }

        // Find the current following status
        $is_following = $this->api->db->query(
            'SELECT COUNT(*) FROM user_follows WHERE follower_id = ? AND following_id = ?',
            [$this->api->user->id, $args['id']]
        )->fetchColumn() !== '0';

        // Check if we're trying to following or unfollowing the target user
        if (isset($args['remove']) && is_bool($args['remove']) && $args['remove']) {
            // Unfollow the target user

            // Assert that we're currently following the target
            if (!$is_following) {
                throw new Exception('not currently following target user');
            }

            // Delete the rows
            $this->api->db->query(
                'DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?',
                [$this->api->user->id, $args['id']]
            );

            return true;
        } else {
            // Follow the target user
            
            // Assert that we're not already following the target
            if ($is_following) {
                throw new Exception('already following target user');
            }

            // Add the new row
            $this->api->db->query(
                'INSERT INTO user_follows (follower_id, following_id) VALUES (?, ?)',
                [$this->api->user->id, $args['id']]
            );

            return true;
        }
    }
}
?>
