<?php
namespace api;

class Response {
    public $ok = true;
    public $data = null;
    public $error = null;

    public function respond($result) {
        if (isset($result)) {
            if (is_a($result, __NAMESPACE__ . '\\Exception')) {
                $this->ok = false;
                $this->error = $result->getMessage();
            } else {
                $this->ok = true;
                $this->data = $result;
            }
        }

        if ($this->ok) {
            echo json_encode([
                'ok' => true,
                'data' => $this->data
            ]);
        } else {
            echo json_encode([
                'ok' => false,
                'error' => $this->error
            ]);
        }
    }
}
?>
