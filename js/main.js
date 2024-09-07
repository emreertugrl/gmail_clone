import { categories, months } from "./constants.js";
import { renderCategories, renderMails, showModal } from "./ui.js";
// ! HTML'den Elemanların Çekilmesi
const body = document.querySelector("body");
const btn = document.getElementById("toggle");
const createMailBtn = document.querySelector(".create");
const closeMailBtn = document.querySelector("#close-btn");
const modal = document.querySelector(".modal-wrapper");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const navigation = document.querySelector("nav");
const form = document.querySelector("#create-mail-form");
const mailsArea = document.querySelector(".mails-area");
const searchButton = document.querySelector("#search-icon");
const searchInput = document.querySelector("#search-input");
const categoryArea = document.querySelector(".nav-middle");
// localstorage verileri al
const strMailData = localStorage.getItem("data");

//! Mail Data
const mailData = JSON.parse(strMailData) || [];

//! sayfa yüklendiğinde ekrana bas
document.addEventListener("DOMContentLoaded", () =>
  renderMails(mailsArea, mailData)
);
//! search iconuna tıklanmasını izleme
searchButton.addEventListener("click", searchMails);

//! mail alanını güncelle
mailsArea.addEventListener("click", updateMail);

//! Hamburger menuye tıklanınca nav kısmını gizle ve aç
hamburgerMenu.addEventListener("click", hideMenu);
// hamburger menüye tıklanınca çalışacak fonksiyon
function hideMenu() {
  navigation.classList.toggle("hide");
}
//! getDate ile oluşturma tarihini alma

function getDate() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  return `${day} ${month} `;
}

//! oluştur butonuna tıklanınca modalı açan fonksiyon
createMailBtn.addEventListener("click", () => showModal(modal, true));
closeMailBtn.addEventListener("click", () => showModal(modal, false));
// form gönderildiğinde sendMail fonksiyonu çalıştırılır.
form.addEventListener("submit", sendMail);
//! Ekran boyutuna bağlı olarak nav kısmını düzenleme
window.addEventListener("resize", (e) => {
  const width = e.target.innerWidth;
  if (width < 1100) {
    navigation.classList.add("hide");
  } else {
    navigation.classList.remove("hide");
  }
});
//! categori olay izleyici
categoryArea.addEventListener("click", watchCategory);

//! toggle yapısı sayesinde dark/light mode eklendi
btn.addEventListener("click", () => {
  btn.classList.toggle("active");
  body.classList.toggle("darkMode");
});

function sendMail(e) {
  e.preventDefault();
  // form içerisindeki inputlara erişme
  const receiver = e.target[0].value;
  const title = e.target[1].value;
  const message = e.target[2].value;
  //
  if (!receiver || !title || !message) {
    return Toastify({
      text: "Formu Doludurunuz!! ",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#FDCC00",
        borderRadius: "10px",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
  }
  // mail objesi
  const newMail = {
    id: new Date().getTime(),
    sender: "Emre",
    receiver,
    title,
    message,
    stared: false,
    date: getDate(),
  };
  // oluşturduğumuz objeyi dizinin başına ekleme
  mailData.unshift(newMail);
  // localStorage verileri kaydetme
  localStorage.setItem("data", JSON.stringify(mailData));
  // mailleri ekrana yazdırma
  renderMails(mailsArea, mailData);
  // modalı kapatma
  showModal(modal, false);
  // input sıfırlama
  form.reset();
  Toastify({
    text: "Mail başarıyla gönderildi",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "#24BB33",
      borderRadius: "10px",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

//! mailleri güncelleme
function updateMail(e) {
  if (e.target.classList.contains("bi-trash")) {
    const mail = e.target.parentElement.parentElement.parentElement;
    // id değerini bildiğimiz elemanı diziden alma
    const mailId = mail.dataset.id;
    // id bildiğimiz elemanı diziden çıkarma
    const filtredData = mailData.filter((i) => i.id != mailId);
    // diziyi localStorage göndermek için veriyi string çevir
    const strData = JSON.stringify(filtredData);
    Toastify({
      text: "Mail Silindi",
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "crimson",
        borderRadius: "10px",
      },
      onClick: function () {}, // Callback after click
    }).showToast();
    // localstoragedan veriyi kaldır
    localStorage.removeItem("data");
    // localstoragea yeni veriyi kaydet
    localStorage.setItem("data", strData);

    // ekranı güncelleme
    renderMails(mailsArea, filtredData);
    mail.remove();
  }
  if (e.target.classList.contains("bi-star")) {
    // güncellenecek veriyi belirle
    const mail = e.target.closest("#mail");
    // bu mail elemanına id ekleyelim
    const mailId = mail.dataset.id;
    // id'den mail objesine filtreleme
    const foundItem = mailData.find((i) => i.id == mailId);
    // bulunan elemanı stared değerini tersine çevirmek
    const updatedItem = { ...foundItem, stared: !foundItem.stared };
    // güncellenecek elemanın sırasını bul
    const index = mailData.findIndex((i) => i.id == mailId);
    // dizideki elemanı güncelle
    mailData[index] = updatedItem;
    // localStorage verileri kaydetme
    localStorage.setItem("data", JSON.stringify(mailData));
    // ekranı güncelleme
    renderMails(mailsArea, mailData);
  }

  if (e.target.classList.contains("bi-star-fill")) {
    const mail = e.target.parentElement.parentElement;
    const mailId = mail.dataset.id;
    const foundItem = mailData.find((i) => i.id == mailId);

    const updatedItem = { ...foundItem, stared: !foundItem.stared };
    const index = mailData.findIndex((i) => i.id == mailId);
    mailData[index] = updatedItem;
    localStorage.setItem("data", JSON.stringify(mailData));
    renderMails(mailsArea, mailData);
  }
}
//! kategori kısmına tıklanınca çalışacak fonksiyon
function watchCategory(e) {
  const leftNav = e.target.parentElement;
  const selectedCategory = leftNav.dataset.name;
  renderCategories(categoryArea, categories, selectedCategory);

  if (selectedCategory === "Yıldızlananlar") {
    const filtred = mailData.filter((i) => i.stared === true);
    renderMails(mailsArea, filtred);
    return;
  }
  renderMails(mailsArea, mailData);
}
//! Arama fonksiyonu
function searchMails() {
  // arama içeriğini içeren mailleri alma
  const filtredArray = mailData.filter((i) =>
    i.message.toLowerCase().includes(searchInput.value.toLowerCase())
  );
  // filtrelenen veriyi mailleri ekrana bas
  renderMails(mailsArea, filtredArray);
}
