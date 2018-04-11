<?php
namespace api;

include_once __DIR__ . '/../Method.php';

class SessionCurrentMethod extends Method {
    public $path = 'session/current';

    public final function execute($args) {
        return $this->api->user->get_user_data();
    }
}
?>
