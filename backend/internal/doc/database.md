# Colial Database Structure

## Tables
### Symbols
* 🔑 - Primary key
* 👽 - Foreign key
* 🔺 - Auto-increment


### `users`
| Type                 | Name       | Notes |
|----------------------|------------|-------|
| `MEDIUMINT UNSIGNED` | `id`       | 🔑 🔺 |
| `VARCHAR[20]`        | `username` | |
| `CHAR[255]`          | `password` | |
| `VARCHAR[128]`       | `email`    | |


### `user_follows`
| Type                 | Name           | Notes |
|----------------------|----------------|-------|
| `MEDIUMINT UNSIGNED` | `follower_id`  | 🔑 👽 `users` |
| `MEDIUMINT UNSIGNED` | `following_id` | 🔑 👽 `users` |


### `posts`
| Type                 | Name        | Notes |
|----------------------|-------------|-------|
| `MEDIUMINT UNSIGNED` | `id`        | 🔑 🔺 |
| `MEDIUMINT UNSIGNED` | `poster_id` | 👽 `users` |
| `CHAR[6]`            | `color`     | |
| `BIGINT UNSIGNED`    | `timestamp` | |
