let users = {}; // Simulated user database
let challenges = {}; // Simulated challenge storage

export function getRegistrationOptions() {
  const challenge = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))
  );
  const userId = btoa("user123");

  challenges[userId] = challenge;

  return {
    challenge,
    rp: { name: "Example" },
    user: {
      id: userId,
      name: "user@example.com",
      displayName: "User Example",
    },
    pubKeyCredParams: [{ type: "public-key", alg: -7 }],
    authenticatorSelection: { userVerification: "preferred" },
    timeout: 60000,
    attestation: "none",
  };
}

export function register(attestationResponse) {
  const userId = btoa("user123");
  const challenge = challenges[userId];

  // Here, you'd normally verify the attestationResponse with the challenge and store the credential.
  users[userId] = {
    id: attestationResponse.id,
    publicKey: attestationResponse.response.attestationObject,
  };

  delete challenges[userId];

  return { status: "ok", userId };
}

export function getAuthenticationOptions() {
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
}

export function login(assertionResponse) {
  const userId = btoa("user123");
  const challenge = challenges[userId];

  // Here, you'd normally verify the assertionResponse with the stored public key and challenge.
  const isValid = true; // Simulated validation result

  delete challenges[userId];

  return { status: isValid ? "ok" : "error", userId: isValid ? userId : null };
}
