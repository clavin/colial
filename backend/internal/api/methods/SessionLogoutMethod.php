<?php
namespace api;

include_once __DIR__ . '/../Method.php';

class SessionLogoutMethod extends Method {
    public $path = 'session/logout';

    public final function execute($args) {
        // Can't log out of nothing!
        if (!$this->api->user->logged_in) {
            return false;
        }

        unset($_SESSION['user_id']);
        return true;
    }
}
?>
