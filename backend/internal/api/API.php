<?php
namespace api;

include_once __DIR__ . '/../Database.php';
include_once 'Response.php';
include_once 'models/User.php';

class API {
    public $config;
    public $db;
    public $user;
    public $response;
    public $methods;

    public function __construct($config) {
        session_start();

        $this->config = $config;
        $this->db = new \Database(
            $config['database']['username'],
            $config['database']['password'],
            $config['database']['database_name'],
            $config['database']['port'],
            $config['database']['host']
        );
        $this->response = new Response();

        $this->user = new User($this, isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null);
    }

    public function run($method_path) {
        // Assert that a path was given
        if (!isset($method_path)) {
            $this->response->respond(new Exception('missing API path.'));
            return;
        }

        $this->load_methods();

        // Assert the given path is registered
        $target_path = strtolower($method_path);
        if (!array_key_exists($target_path, $this->methods)) {
            $this->response->respond(new Exception('unknown API path.'));
            return;
        }

        // Retrieve any arguments
        $args = null;
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            try {
                $args = json_decode(file_get_contents('php://input'), true);
            } catch (\Error $err) {}
            if ($args === null) {
                $this->response->respond(new Exception('unable to parse arguments.'));
                return;
            }
        }

        // Run the appropriate method with the retrieved arguments
        $method_instance = $this->methods[$target_path];
        try {
            $result = $method_instance->execute($args);
            $this->response->respond($result);
        } catch (\PDOException $err) {
            $this->response->respond(new Exception('a database error occurred'));
            return;
        } catch (Exception $err) {
            $this->response->respond($err);
            return;
        } catch (\Throwable $throwable) {
            $this->response->respond(new Exception('an error has occurred'));
            return;
        }
    }

    private function load_methods() {
        // Include, instantiate, and store all Method classes
        $this->methods = [];
        foreach (glob(__DIR__ . '/methods/*.php') as $method_file_name) {
            $method_class_name = __NAMESPACE__ . '\\' . basename($method_file_name, '.php');
            include_once $method_file_name;

            $method_instance = new $method_class_name($this);
            $this->methods[$method_instance->path] = $method_instance;
        }
    }
}
?>
