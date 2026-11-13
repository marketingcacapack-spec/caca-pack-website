const toggle = document.querySelector(".menu-toggle");
const links = document.querySelector(".navlinks");

if (toggle && links) {
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "×" : "☰";
  });
}
document.querySelectorAll(".navlinks a").forEach((a) => {
  if (a.href === location.href || a.pathname === location.pathname)
    a.classList.add("active");
});
document.querySelectorAll("[data-contact-form]").forEach((form) =>
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const note = form.querySelector(".form-note");
    const data = new FormData(form);
    if (!form.reportValidity()) return;
    const subject = encodeURIComponent(
      "Website enquiry from " + (data.get("name") || "Website visitor"),
    );
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nCompany: ${data.get("company") || "-"}\nMessage: ${data.get("message")}`,
    );
    note.textContent =
      document.documentElement.lang === "id"
        ? "Aplikasi email Anda akan terbuka dengan pesan yang sudah disiapkan. Hubungkan layanan formulir untuk pengiriman langsung melalui website."
        : "Your email app will open with the message prepared. Connect a form service for direct online submissions.";
    window.location.href = `mailto:info@cacapack.co.id?subject=${subject}&body=${body}`;
  }),
);
document
  .querySelectorAll("[data-year]")
  .forEach((el) => (el.textContent = new Date().getFullYear()));
// Ganti URL di bawah ini dengan URL Web App Google Apps Script Anda
const scriptURL = 'https://docs.google.com/spreadsheets/d/17BWYJmV_MZx5ZjB501OjrWiBEOB7FS5r96ovL3FDyg4/edit?usp=sharing';

const form = document.getElementById('contactForm');
const statusMsg = document.getElementById('statusMsg');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        statusMsg.style.color = "blue";
        statusMsg.textContent = "Sedang mengirim pesan...";

        // Mengambil semua data dari input form (name, phone, message)
        const formData = new FormData(form);
        
        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => response.json()) // Membaca respon JSON dari Apps Script
            .then(data => {
                if (data.result === 'success') {
                    // Menampilkan pesan terima kasih
                    statusMsg.style.color = "green";
                    statusMsg.textContent = "Terima kasih atas pesannya! Data Anda telah tersimpan.";
                    
                    // Mengosongkan kembali kolom input form
                    form.reset();
                } else {
                    throw new Error(data.error || "Gagal menyimpan data");
                }
                submitBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error!', error.message);
                statusMsg.style.color = "red";
                statusMsg.textContent = "Terjadi kesalahan saat mengirim pesan, silakan coba lagi.";
                submitBtn.disabled = false;
            });
    });
}