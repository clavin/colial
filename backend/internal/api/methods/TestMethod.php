<?php
namespace api;

include_once __DIR__ . '/../Method.php';

class TestMethod extends Method {
    public $path = 'test';

    public final function execute($args) {
        return $args;
    }
}
?>
