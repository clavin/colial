<?php
namespace api;

include_once 'Exception.php';

abstract class Method {
    protected $api;

    public $path;

    public final function __construct($api) {
        $this->api = $api;
    }

    abstract public function execute($args);
}
?>
