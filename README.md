# One-Time-Note
Share one time notes, passwords or secrets. 

# One-Time Note

One-Time Note is a simple, secure note-sharing application that generates one-time links for notes. Once a note is viewed, the link expires, ensuring that the note can only be accessed once.

## Features

- Generate secure one-time links for notes
- Notes are deleted after being viewed once
- Short, user-friendly URLs using Base62 encoding

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/strongestgeek/one-time-note.git
    cd one-time-note
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Start the server:
    ```sh
    node server.js
    ```

## Usage

1. Run the server and open your browser to `http://localhost:3000`.
2. Enter your note and click "Create Note".
3. A one-time link will be generated. Share this link securely.
4. The recipient can view the note once, after which the link will expire.

## Configuration

- **Custom Domain**: To use a custom domain, update the `BASE_URL` variable in `server.js`.
- **Port**: Change the port by modifying the `PORT` variable in `server.js`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgements

This project was developed with the assistance of AI tools, including GitHub Copilot.
