/**
 * Template Google Apps Script untuk menyimpan data peserta MPI.
 * Tempelkan file ini di Extensions > Apps Script pada Google Sheet tujuan.
 */

const SHEET_NAME = 'Data Peserta';
const HEADERS = ['Timestamp', 'Nama', 'Kelas', 'Sekolah', 'Halaman'];

/**
 * Jalankan fungsi ini satu kali untuk membuat dan menyiapkan template sheet.
 * Fungsi ini tidak menghapus data yang sudah ada.
 */
function setuptemplate() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  const currentHeaders = headerRange.getValues()[0];
  const headersMatch = HEADERS.every((header, index) => currentHeaders[index] === header);

  if (!headersMatch) {
    headerRange.setValues([HEADERS]);
  }

  headerRange
    .setFontWeight('bold')
    .setBackground('#087f78')
    .setFontColor('#ffffff');

  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);

  return `Template siap digunakan pada sheet "${SHEET_NAME}".`;
}

/**
 * Alias dengan penulisan camelCase.
 */
function setupTemplate() {
  return setuptemplate();
}

/**
 * Menerima data JSON dari form website.
 * Format data yang diterima:
 * { nama: '...', kelas: '...', sekolah: '...', halaman: '...' }
 */
function doPost(event) {
  try {
    if (!event || !event.postData || !event.postData.contents) {
      return jsonResponse({ ok: false, error: 'Data tidak ditemukan.' });
    }

    const data = JSON.parse(event.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      sheet.setFrozenRows(1);
    }

    const nama = cleanValue(data.nama);
    const kelas = cleanValue(data.kelas);
    const sekolah = cleanValue(data.sekolah);
    const halaman = cleanValue(data.halaman);

    if (!nama || !kelas || !sekolah) {
      return jsonResponse({ ok: false, error: 'Nama, kelas, dan sekolah wajib diisi.' });
    }

    sheet.appendRow([new Date(), nama, kelas, sekolah, halaman]);
    return jsonResponse({ ok: true, message: 'Data berhasil disimpan.' });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  }
}

/**
 * Endpoint sederhana untuk memeriksa apakah Web App aktif.
 */
function doGet() {
  return jsonResponse({ ok: true, message: 'MPI Google Apps Script aktif.' });
}

function cleanValue(value) {
  return String(value == null ? '' : value).trim().slice(0, 250);
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
