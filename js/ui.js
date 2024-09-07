// ekrana mail oluşturma modalını açan fonksiyon

export function showModal(modal, willOpen) {
  modal.style.display = willOpen ? "block" : "none";
}

// Ekrana Mail gönderme işlemini yapan fonksiyon
// bu fonksiyon 2 parametre alır.1-hangi kısımda render,2-hangi veriyi render edecek
export function renderMails(outlet, data) {
  if (!data) return;
  outlet.innerHTML = data
    .map(
      (mail) =>
        `
        <div class="mail" id="mail" data-id=${mail.id}>
        <div class="left">
          <input type="checkbox" />
          <i class="bi bi-star${mail.stared ? "-fill" : ""}"></i>
          <span>${trimString(mail.receiver, 20)}</span>
        </div>
        <div class="right">
          <p class="message-title">${trimString(mail.title, 20)}</p>
          <p class="message-description">${trimString(mail.message, 70)}</p>
          <p class="message-date">${mail.date}</p>
          <div class="delete">
            <i class="bi bi-trash"></i>
          </div>
        </div>
      </div>
      `
    )
    .join("");
}

// metin ifadeleri belirli karakterden sonra kesecek fonksiyon
function trimString(str, max) {
  // eğer max karakter limiti aşmazsa veri döndürür, büyükse ... ekler.
  if (str.length < max) return str;
  return str.slice(0, max) + "...";
}
// kategorileri dinamik olarak render etmek
export function renderCategories(outlet, data, selectCategory) {
  // eski kategorileri sil
  outlet.innerHTML = "";
  // yeni kategorileri render et
  data.forEach((category) => {
    const categoryItem = document.createElement("a");
    // kategori elemanınına veri ekleme
    categoryItem.dataset.name = category.title;
    // aktif olan kateforiye active ekleme
    categoryItem.className = selectCategory === category.title && "active";

    categoryItem.innerHTML = `
    <i class="${category.class}"></i>
    <span>${category.title}</span>
    `;
    outlet.appendChild(categoryItem);
  });
}
