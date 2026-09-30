(function () {
  const accessKey = "mpiDataPeserta";
  const webAppUrl = "https://script.google.com/macros/s/AKfycbw_44gcSVfvAPRF2GpdXgh4pxMYzeOxsNqVfMOdwlpd7L0mTQamzsluJAS4dzDZ09sXrg/exec";
  const root = document.documentElement;
  root.classList.add("mpi-access-pending");

  function revealContent() {
    root.classList.add("mpi-access-open");
  }

  function getParticipant() {
    try {
      return JSON.parse(sessionStorage.getItem(accessKey));
    } catch (error) {
      return null;
    }
  }

  function showForm() {
    const overlay = document.createElement("div");
    overlay.className = "mpi-access-overlay";
    overlay.innerHTML = `
      <section class="mpi-access-card" role="dialog" aria-modal="true" aria-labelledby="mpi-access-title">
        <h2 id="mpi-access-title">Data Peserta</h2>
        <p>Isi data berikut terlebih dahulu untuk membuka materi pembelajaran.</p>
        <form id="mpi-access-form">
          <div class="mpi-access-field">
            <label for="mpi-name">Nama</label>
            <input id="mpi-name" name="nama" type="text" autocomplete="name" required>
          </div>
          <div class="mpi-access-field">
            <label for="mpi-class">Kelas</label>
            <select id="mpi-class" name="kelas" required>
              <option value="">Pilih kelas</option>
              <option value="Kelas 7">Kelas 7</option>
              <option value="Kelas 8">Kelas 8</option>
              <option value="Kelas 9">Kelas 9</option>
            </select>
          </div>
          <div class="mpi-access-field">
            <label for="mpi-school">Sekolah</label>
            <input id="mpi-school" name="sekolah" type="text" autocomplete="organization" required>
          </div>
          <button class="mpi-access-submit" type="submit">Buka Materi</button>
          <p class="mpi-access-note">Data digunakan selama sesi tab browser ini.</p>
        </form>
      </section>
    `;
    document.body.prepend(overlay);
    revealContent();

    const form = document.getElementById("mpi-access-form");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      data.halaman = document.title;
      sessionStorage.setItem(accessKey, JSON.stringify(data));

      fetch(webAppUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(function () {
        // Form tetap dapat digunakan jika koneksi ke Google Sheets sedang gagal.
      });

      overlay.remove();
    });
    document.getElementById("mpi-name").focus();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (getParticipant()) {
      revealContent();
    } else {
      showForm();
    }
  });
})();
