const messageBox = document.getElementById("message");
const registerButton = document.getElementById("register");
const loginButton = document.getElementById("login");
const logoutButton = document.getElementById("logout");
const output = document.getElementById("output");

registerButton.addEventListener("click", async () => {
  try {
    // Simulate getting registration options from the server
    const registrationOptions = getRegistrationOptions();

    // Convert base64 to ArrayBuffer
    registrationOptions.challenge = Uint8Array.from(
      atob(registrationOptions.challenge),
      (c) => c.charCodeAt(0)
    );
    registrationOptions.user.id = Uint8Array.from(
      atob(registrationOptions.user.id),
      (c) => c.charCodeAt(0)
    );

    const credential = await navigator.credentials.create({
      publicKey: registrationOptions,
    });

    // Convert ArrayBuffer to base64
    const attestationResponse = {
      id: credential.id,
      rawId: btoa(
        String.fromCharCode.apply(null, new Uint8Array(credential.rawId))
      ),
      type: credential.type,
      response: {
        attestationObject: btoa(
          String.fromCharCode.apply(
            null,
            new Uint8Array(credential.response.attestationObject)
          )
        ),
        clientDataJSON: btoa(
          String.fromCharCode.apply(
            null,
            new Uint8Array(credential.response.clientDataJSON)
          )
        ),
      },
    };

    // Simulate sending the attestation response to the server
    const result = register(attestationResponse);

    output.textContent = JSON.stringify(result, null, 2);
    registerButton.style.display = "none";
    messageBox.innerHTML =
      "Passkey is now successfully registered on the server";
  } catch (error) {
    output.textContent = `Error: ${error.message}`;
  }
});

loginButton.addEventListener("click", async () => {
  const output = document.getElementById("output");
  try {
    // Simulate getting authentication options from the server
    const authOptions = getAuthenticationOptions();

    // Convert base64 to ArrayBuffer
    authOptions.challenge = Uint8Array.from(atob(authOptions.challenge), (c) =>
      c.charCodeAt(0)
    );
    authOptions.allowCredentials = authOptions.allowCredentials.map((cred) => ({
      ...cred,
      id: Uint8Array.from(
        atob(cred.id.replace(/_/g, "/").replace(/-/g, "+")),
        (c) => c.charCodeAt(0)
      ), // Replacing URL-safe characters
    }));

    const assertion = await navigator.credentials.get({
      publicKey: authOptions,
    });

    // Convert ArrayBuffer to base64
    const assertionResponse = {
      id: assertion.id,
      rawId: btoa(
        String.fromCharCode.apply(null, new Uint8Array(assertion.rawId))
      ),
      type: assertion.type,
      response: {
        authenticatorData: btoa(
          String.fromCharCode.apply(
            null,
            new Uint8Array(assertion.response.authenticatorData)
          )
        ),
        clientDataJSON: btoa(
          String.fromCharCode.apply(
            null,
            new Uint8Array(assertion.response.clientDataJSON)
          )
        ),
        signature: btoa(
          String.fromCharCode.apply(
            null,
            new Uint8Array(assertion.response.signature)
          )
        ),
        userHandle: assertion.response.userHandle
          ? btoa(
              String.fromCharCode.apply(
                null,
                new Uint8Array(assertion.response.userHandle)
              )
            )
          : null,
      },
    };

    // Simulate sending the assertion response to the server
    const result = login(assertionResponse);

    output.textContent = JSON.stringify(result, null, 2);
    loginButton.style.display = "none";
    logoutButton.style.display = "block";
    messageBox.innerHTML = "Passkey login successful!";
  } catch (error) {
    output.textContent = `Error: ${error.message}`;
  }
});

// Simulated server-side logic
let users = {}; // Simulated user database
let challenges = {}; // Simulated challenge storage

const getRegistrationOptions = () => {
  // must be a cryptographically random number sent from a server
  const challenge = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
  );
  const userId = btoa("user123");

  challenges[userId] = challenge;

  return {
    challenge,
    rp: {
      name: "example",
      // id: "example.com"
    },
    user: {
      id: userId,
      name: "user@example.com",
      displayName: "User Example",
    },
    pubKeyCredParams: [
      { alg: -7, type: "public-key" },
      { alg: -257, type: "public-key" },
    ],
    //     excludeCredentials: [{
    //       id: *****,
    //       type: 'public-key',
    //       transports: ['internal'],
    //     }],
    authenticatorSelection: {
      userVerification: "preferred",
      authenticatorAttachment: "platform",
      requireResidentKey: true,
    },
    timeout: 60000,
    attestation: "none",
  };
};

const register = (attestationResponse) => {
  const userId = btoa("user123");
  const challenge = challenges[userId];

  // Here, you'd normally verify the attestationResponse with the challenge and store the credential.
  users[userId] = {
    id: attestationResponse.id,
    publicKey: attestationResponse.response.attestationObject,
  };

  delete challenges[userId];

  return { status: "ok", userId };
};

const getAuthenticationOptions = () => {
  const userId = btoa("user123");

  if (!users[userId]) {
    throw new Error("User not registered");
  }

  const challenge = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
  );
  challenges[userId] = challenge;

  return {
    challenge,
    allowCredentials: [{ type: "public-key", id: users[userId].id }],
    userVerification: "preferred",
    timeout: 60000,
  };
};

const login = (assertionResponse) => {
  const userId = btoa("user123");
  const challenge = challenges[userId];

  // Here, you'd normally verify the assertionResponse with the stored public key and challenge.
  const isValid = true; // Simulated validation result

  delete challenges[userId];

  return { status: isValid ? "ok" : "error", userId: isValid ? userId : null };
};

logoutButton.addEventListener("click", async () => {
  loginButton.style.display = "block";
  logoutButton.style.display = "none";
  messageBox.innerHTML = "";
  output.innerHTML = "";
});

// Extras
// Want to Sign in with a passkey through form autofill?

const autoFillCode = async () => {
  // To abort a WebAuthn call, instantiate an `AbortController`.
  const abortController = new AbortController();

  // Availability of `window.PublicKeyCredential` means WebAuthn is usable.
  if (window.PublicKeyCredential && window.isConditionalMediationAvailable) {
    // Check if conditional mediation is available.
    const isCMA = await PublicKeyCredential.isConditionalMediationAvailable();
    if (isCMA) {
      // Call WebAuthn authentication
      const publicKeyCredentialRequestOptions = {
        // Server generated challenge
        challenge: "****",
        // The same RP ID as used during registration
        rpId: "example.com",
      };

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
        signal: abortController.signal,
        // Specify 'conditional' to activate conditional UI
        mediation: "conditional",
      });
    }
  }
};
