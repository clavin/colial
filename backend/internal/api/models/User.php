<?php
namespace api;

class User {
    public $logged_in = false;
    public $id;

    private $api;
    private $db_row;

    public function __construct($api, $user_id = null) {
        $this->api = $api;
        if ($user_id !== null) {
            $this->logged_in = true;
            $this->id = (int) $user_id;
            $this->db_row = $this->api->db->query(
                'SELECT * FROM users WHERE id = ?',
                [$this->id]
            )->fetch();
        }
    }

    public function get_user_data() {
        if (!$this->logged_in) {
            return [
                'loggedIn' => false
            ];
        }

        return [
            'loggedIn' => true,
            'id' => $this->id,
            'username' => $this->get_username(),
            'statusColor' => $this->get_latest_status_color()
        ];
    }

    public function get_username() {
        return $this->db_row['username'];
    }

    public function get_latest_status_color() {
        $result = $this->api->db->query(
            'SELECT color FROM posts WHERE poster_id = ? ORDER BY timestamp DESC LIMIT 1',
            [$this->id]
        )->fetchAll();

        if (count($result) === 0) {
            return null;
        } else {
            return '#' . $result[0]['color'];
        }
    }
}
?>
