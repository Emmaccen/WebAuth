# Web Authentication API Demo

This is a demo project to showcase the use of the Web Authentication API (WebAuthn) with a simulated backend using JavaScript. The demo includes both registration and login flows using the WebAuthn API, and is designed to work without a real server setup by simulating server-side logic within the client-side code.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Setup](#setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Web Authentication (WebAuthn) is a web standard for strong authentication, using [public key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) instead of passwords. This demo project demonstrates the registration and login processes using WebAuthn, with the backend logic simulated in the frontend code.

## Features

- **Registration**: Demonstrates user registration with WebAuthn.
- **Login**: Demonstrates user login with WebAuthn.
- **Simulated Backend**: Backend logic is simulated within the client-side JavaScript.

## Setup

### Prerequisites

- A modern web browser that supports WebAuthn (e.g., Chrome, Firefox).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Emmaccen/WebAuth.git
   cd WebAuth
   ```

2. Serve the `index.html` file using a static file server. You can use tools like `http-server` in Node.js, Python's `http.server`, or the Live Server extension in VS Code (Recommended).

   #### Using Node.js `http-server`:

   ```bash
   npm install -g http-server
   http-server .
   ```

   #### Using Python:

   ```bash
   python -m http.server
   ```

   #### Using Live Server in VS Code:

   - Install the Live Server extension in VS Code.
   - Open the project folder in VS Code.
   - Right-click on `index.html` and select `Open with Live Server`.

   By default, Live Server runs on port 5500.

   #### Port Forwarding in VS Code:

   If you need to serve an HTTPS URL, you can use port forwarding in VS Code:

   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
   - Search for and select `Forward a Port`.
   - Enter the port number (default is 5500 for Live Server).
   - VS Code will provide an HTTPS URL for accessing your application.

3. Open your browser and navigate to the appropriate URL:
   - For `http-server`: `http://localhost:8080` (or the appropriate port).
   - For Python: `http://localhost:8000`.
   - For Live Server: `http://localhost:5500` or the HTTPS URL provided by VS Code.

### Important Note

WebAuthn requires secure origins (HTTPS) and will not work on insecure origins like `http://localhost` or `http`.

## Usage

1. Open the `index.html` file in your web browser.
2. Click the "Register" button to simulate user registration.
3. Click the "Login" button to simulate user login.
4. The results will be displayed in the output area on the page.

## Project Structure

```plaintext
webAuth/
├── index.html    # The main HTML file for the demo
└── client.js     # The JavaScript file containing client-side and simulated backend logic
└── styles.css    # irrelevant for this demo
```

## How It Works

### Client-Side Logic (`client.js`)

- **Registration**:
  - The client requests registration options from the simulated backend.
  - The WebAuthn `create` method is called with these options to generate a new credential.
  - The credential is sent to the simulated backend for registration.

- **Login**:
  - The client requests authentication options from the simulated backend.
  - The WebAuthn `get` method is called with these options to generate an assertion.
  - The assertion is sent to the simulated backend for verification.

### Simulated Backend Logic

- The backend logic is simulated within the `client.js` file.
- Registration options, authentication options, and verification logic are implemented as JavaScript functions.
- This approach allows the demo to run without a real server setup.

## Contributing

Contributions are welcome! If you have any improvements or suggestions, feel free to open an issue or submit a pull request.

## Resources
* [Passwordless login with passkeys](https://developers.google.com/identity/passkeys/)
* [Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
* [Create a passkey for passwordless logins](https://web.dev/articles/passkey-registration)
* [Sign in with a passkey through form autofill](https://web.dev/articles/passkey-form-autofill)
* [Frequently asked questions (FAQ)](https://developers.google.com/identity/passkeys/faq)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
