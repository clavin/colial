<?php
namespace api;

include_once __DIR__ . '/../Method.php';

class PostsDeleteMethod extends Method {
    public $path = 'posts/delete';

    public final function execute($args) {
        // Assert the user is logged in
        if (!$this->api->user->logged_in) {
            throw new Exception('not logged in');
        }

        // Assert a post id was passed and is correctly typed
        if (!isset($args['id']) || !is_integer($args['id'])) {
            throw new Exception('missing id');
        }

        // Find the target post
        $post_rows = $this->api->db->query(
            'SELECT * FROM posts WHERE id = ?',
            [$args['id']]
        )->fetchAll();

        // Assert there is a post with the given id
        if (count($post_rows) === 0) {
            throw new Exception('invalid post id');
        }

        // Assert that the user is the owner of the post
        if ((int) $post_rows[0]['poster_id'] !== $this->api->user->id) {
            throw new Exception('not your post');
        }

        // Remove the post
        $this->api->db->query(
            'DELETE FROM posts WHERE id = ?',
            [$args['id']]
        );
        return true;
    }
}
?>
