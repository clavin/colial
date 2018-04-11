<?php
namespace api;

class Exception extends \Exception {
    public function __construct($method, $code = 0, Exception $previous = null) {
        parent::__construct($method, $code, $previous);
    }
}
?>