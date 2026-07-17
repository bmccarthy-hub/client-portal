(function () {
  const form = document.getElementById("login-form");
  const errorMsg = document.getElementById("login-error");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim().toLowerCase();
    const passcode = document.getElementById("passcode").value;
    const hash = await sha256Hex(passcode);

    let clients;
    try {
      const res = await fetch(CLIENTS_INDEX_URL);
      clients = await res.json();
    } catch (err) {
      errorMsg.textContent = "Couldn't reach the client list — check your connection and try again.";
      errorMsg.hidden = false;
      return;
    }

    const match = clients.find(
      (c) => c.username.toLowerCase() === username && c.passcode_hash === hash
    );

    if (match) {
      sessionStorage.setItem("lf_unlock_" + match.slug, match.passcode_hash);
      window.location.href = match.url;
    } else {
      errorMsg.textContent =
        "That username/passcode combination doesn't match. Double-check your welcome email, or reach out to Brigitte.";
      errorMsg.hidden = false;
    }
  });
})();
