const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  if (!name || !email || !message) {
    status.textContent = "Harap isi semua field.";
    return;
  }
  // Contoh: kirim ke backend via fetch()
  status.textContent = "Mengirim...";
  // Simulasi
  setTimeout(() => {
    status.textContent = "Pesan terkirim! Terima kasih.";
    form.reset();
  }, 900);
});

// jika tidak ingin behavior default type=submit, tambahkan listener ke button
document
  .getElementById("sendBtn")
  .addEventListener("click", () => form.dispatchEvent(new Event("submit")));
