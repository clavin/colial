# Colial's Backend
The backend is a small REST-like framework built using:

* [PHP](https://php.net/)
* [MySQL](https://www.mysql.com/)
* The [PDO extension](https://php.net/manual/en/book.pdo.php)
* The [Apache `mod_rewrite` module](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)

The constraints of this project more or less meant that I was restricted from using a framework for
this portion of the application. Thus, the code may be more verbose than it would've otherwise been.

## Project Structure
* `internal/`: A directory that houses all the server logic, inaccessable to users browsing.
  * `api/`
    * `methods/`: A directory housing all API methods (which are automatically included).
    * `models/`
      * `User.php`: A model that handles the information of the logged-in user.
    * `API.php`: The overall API controller.
    * `Exception.php`: A copy of the generic `Extension` object in the `api` namespace, used to
      differentiate API exceptions from application exceptions.
    * `Method.php`: The abstract definition of an API method.
    * `Response.php`: A small class that handles formatting responses for API requests.
  * `doc/`: Internal documentation.
  * `config.php`: Exports the application configuration, which only consists of the databse info.
  * `Database.php`: A wrapper around PDO.
* `api.php`: A script that all `api/*` urls are forwarded to for handling API requests.
