<?php
namespace api;

include_once __DIR__ . '/../Method.php';

class UserInfoMethod extends Method {
    public $path = 'user/info';

    public final function execute($args) {
        // Assert that a user id was provided and is correctly typed
        if (!isset($args['id']) || !is_integer($args['id'])) {
            throw new Exception('missing id');
        }

        // Check that user exists
        $user_rows = $this->api->db->query(
            'SELECT * FROM users WHERE id = ? LIMIT 1',
            [$args['id']]
        )->fetchAll();
        if (count($user_rows) === 0) {
            throw new Exception('unknown user id');
        }

        // Count followers
        $follower_count = (int) $this->api->db->query(
            'SELECT COUNT(*) FROM user_follows WHERE following_id = ?',
            [$args['id']]
        )->fetchColumn();

        // Initialize result
        $user_row = $user_rows[0];
        $result = [
            'id' => $args['id'],
            'username' => $user_row['username'],
            'followers' => $follower_count
        ];

        // Attempt to attach following information
        if ($this->api->user->logged_in && $this->api->user->id !== $args['id']) {
            $is_following_num = $this->api->db->query(
                'SELECT COUNT(*) FROM user_follows WHERE follower_id = ? AND following_id = ?',
                [$this->api->user->id, $args['id']]
            )->fetchColumn();
            $result['following'] = $is_following_num !== '0';
        }

        // I could write "return the result" here, but maybe it's better I don't just rewrite the
        // next line as a comment. ;)
        return $result;
    }
}
?>
