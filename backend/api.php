<?php
include_once 'internal/api/API.php';

// Pass the application config & target API path to the API handler
$config = include_once 'internal/config.php';
$api = new api\API($config);
$api->run($_GET['method']);
?>
