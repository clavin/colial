<?php
class Database {
    private $db;

    public function __construct(
        $user,
        $pass,
        $db_name,
        $port = 3306,
        $host = 'localhost',
        $charset = 'utf8mb4'
    ) {
        $dsn = "mysql:host=$host;port=$port;dbname=$db_name;charset=$charset";
        $this->db = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    }

    public function query($query_str, $query_vars = []) {
        if (count($query_vars) > 0) {
            // Run as prepared statement.
            $statement = $this->db->prepare($query_str);
            $statement->execute($query_vars);
            return $statement;
        } else {
            // Run as standalone query.
            return $this->db->query($query_str);
        }
    }

    public function last_insert_id() {
        return $this->db->lastInsertId();
    }
}
?>
