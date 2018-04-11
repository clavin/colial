<?php
namespace api;

include_once __DIR__ . '/../Method.php';

class PostsListMethod extends Method {
    public $path = 'posts/list';

    public final function execute($args) {
        // Assert the type of posts is present and correctly typed
        if (!isset($args['type']) || !is_string($args['type'])) {
            throw new Exception('missing type');
        }

        $post_rows = [];
        $username_cache = [];
        $posts = [];

        switch (strtolower($args['type'])) {
            case 'public':
                // Get the latest (by id--not by timestamp) posts
                $post_rows = $this->api->db->query(
                    'SELECT * FROM posts ORDER BY id DESC LIMIT 30'
                )->fetchAll();
                break;
            case 'user':
                // Assert that a target user id is provided and correctly typed
                if (!isset($args['id']) || !is_integer($args['id'])) {
                    throw new Exception('missing id');
                }

                // Get the latest (by id--not by timestamp) posts by the target user
                $post_rows = $this->api->db->query(
                    'SELECT * FROM posts WHERE poster_id = ? ORDER BY id DESC LIMIT 20',
                    [$args['id']]
                )->fetchAll();

                break;
            default:
                throw new Exception('unknown type');
        }

        // Map each post row to a post object, which includes extra metadata
        foreach ($post_rows as $post_row) {
            $post_username = '';
            if (isset($username_cache[$post_row['poster_id']])) {
                $post_username = $username_cache[$post_row['poster_id']];
            } else {
                $post_username = $this->api->db->query(
                    'SELECT username FROM users WHERE id = ?',
                    [$post_row['poster_id']]
                )->fetchColumn();
                $username_cache[$post_row['poster_id']] = $post_username;
            }

            $posts[] = [
                'id' => (int) $post_row['id'],
                'userId' => (int) $post_row['poster_id'],
                'username' => $post_username,
                'color' => '#' . $post_row['color'],
                'timestamp' => (int) $post_row['timestamp']
            ];
        }

        return [
            'type' => $args['type'],
            'posts' => $posts
        ];
    }
}
?>
