// Fallback gate for a client page when someone lands on it directly
// (bookmarked link, shared link) instead of coming through /login/.
(function () {
  const portal = document.querySelector(".portal");
  if (!portal) return;

  const slug = portal.dataset.slug;
  const expectedHash = portal.dataset.hash;
  const gate = document.getElementById("passcode-gate");
  const content = document.getElementById("portal-content");
  const unlockKey = "lf_unlock_" + slug;

  function reveal() {
    gate.hidden = true;
    content.hidden = false;
  }

  // Already unlocked this session via /login/ or a previous correct entry?
  if (sessionStorage.getItem(unlockKey) === expectedHash) {
    reveal();
    return;
  }

  const form = document.getElementById("passcode-form");
  const errorMsg = document.getElementById("gate-error");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const entered = document.getElementById("gate-passcode").value;
    const hash = await sha256Hex(entered);

    if (hash === expectedHash) {
      sessionStorage.setItem(unlockKey, hash);
      errorMsg.hidden = true;
      reveal();
    } else {
      errorMsg.hidden = false;
    }
  });
})();
