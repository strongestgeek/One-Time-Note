# One-Time Note

One-Time Note is a simple, secure note-sharing application that generates one-time links for notes. Once a note is viewed, the link expires, ensuring that the note can only be accessed once.
This is designed to be ran on your own local server to limit who has access to this and to also store any data on your own machines.

## Features

- Generate secure one-time links for notes, secrets and passwords.
- Notes are deleted after being opened, and can only be viewed once.
- Short,secure and user-friendly URLs using Base62 encoding.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/strongestgeek/one-time-note.git
    cd one-time-note/One-Time-Note-Rust
    ```

2. Check and edit the URL's:
    ```sh
    nano src/main.rs
    ```
    2.1 Please edit the below line to inculde your desired IP or domain:
       This is for the links that are created.
    ```sh
    HttpResponse::Ok().json(serde_json::json!({ "link": format!("http://127.0.0.1/note/{}", short_id) }))
    ```

    2.2 You may also want to edit this line if you dont have anything setup for it.
   ```sh
    .bind("127.0.0.1:3000")?
    ```

3. Start the server:
    ```sh
    cargo run
    ```

## Usage

1. Run the server and open your browser to `http://127.0.0.1:3000`.
2. Enter your note and click "Create Note".
3. A one-time link will be generated. Share this link securely.
4. The recipient can view the note once, after which the link will expire.
5. Make sure they also have access to the server this is running on.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

This project was developed with the assistance of AI tools, including GitHub Copilot.
