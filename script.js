const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    status.textContent = "Harap isi semua kolom.";
    return;
  }

  const phoneNumber = "6283134708667";

  // format teks WA
  const text = `Halo, saya ${name} (%0AEmail: ${email})%0A%0A${message}`;

  const waURL = `https://wa.me/${phoneNumber}?text=${text}`;

  window.open(waURL, "_blank");

  status.textContent = "Mengalihkan ke WhatsApp...";
  form.reset();
});

document
  .getElementById("sendBtn")
  .addEventListener("click", () => form.dispatchEvent(new Event("submit")));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

const loader = document.getElementById("loader");
const MIN_TIME = 5000; // minimal 1 detik
const start = Date.now();

window.addEventListener("load", () => {
  const elapsed = Date.now() - start;
  const delay = Math.max(MIN_TIME - elapsed, 0);

  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.transition = "3s";
    setTimeout(() => (loader.style.display = "none"), 3000);
  }, delay);
});
