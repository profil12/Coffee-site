// ========== БУРГЕР-МЕНЮ ==========
const burger = document.getElementById('burgerBtn');
const navMenu = document.getElementById('navMenu');

if (burger && navMenu) {
    burger.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    });
}

const menuData = [
    { id: 1, name: "Эспрессо", price: 190, composition: "Классический, 30 мл", type: "coffee", img: "images/es.jpg" },
    { id: 2, name: "Латте", price: 260, composition: "Эспрессо + нежное молоко", type: "coffee", img: "images/la.jpg" },
    { id: 3, name: "Капучино", price: 240, composition: "Эспрессо + пышная пенка", type: "coffee", img: "images/ka.jpg" },
    { id: 4, name: "Раф", price: 290, composition: "Эспрессо + сливки + ваниль", type: "coffee", img: "images/ra.jpg" },
    { id: 5, name: "Чизкейк Нью-Йорк", price: 320, composition: "Крем-сыр, ваниль, печенье", type: "dessert", img: "images/ch.jpg" },
    { id: 6, name: "Брауни с вишней", price: 290, composition: "Шоколад, вишня, орех", type: "dessert", img: "images/br.jpg" },
    { id: 7, name: "Круассан миндальный", price: 210, composition: "Слойка, миндаль", type: "dessert", img: "images/kr.jpg" },
    { id: 8, name: "Маття латте", price: 270, composition: "Японский чай, молоко", type: "tea", img: "images/ma.jpg" },
    { id: 9, name: "Улун", price: 230, composition: "Китайский чай, молочные ноты", type: "tea", img: "images/ul.jpg" },
    { id: 10, name: "Чай с бергамотом", price: 210, composition: "Чёрный чай, бергамот", type: "tea", img: "images/te.jpg" }
];

function renderMenu(filterType = "all") {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;
    
    const filtered = filterType === "all" ? menuData : menuData.filter(item => item.type === filterType);
    
    grid.innerHTML = filtered.map(item => `
        <div class="menu-card" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
            <img src="${item.img}" alt="${item.name}" loading="lazy" style="width: 100%; height: 200px; object-fit: cover;" onerror="this.src='https://placehold.co/600x400/5C3E1F/F5DEB3?text=${encodeURIComponent(item.name)}'">
            <div class="menu-card-content">
                <h3>${item.name}</h3>
                <div class="price">${item.price} ₽</div>
                <div class="composition">${item.composition}</div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', () => {
            const name = card.getAttribute('data-name');
            const price = parseInt(card.getAttribute('data-price'));
            openOrderModal(name, price);
        });
    });
}

// Инициализация фильтров
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length) {
    renderMenu('all');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenu(btn.getAttribute('data-filter'));
        });
    });
}

// ========== МОДАЛКА ОФОРМЛЕНИЯ ЗАКАЗА ==========
const orderModal = document.getElementById('orderModal');
const receiptModal = document.getElementById('receiptModal');
let currentProduct = { name: '', price: 0 };

function openOrderModal(name, price) {
    currentProduct = { name, price };
    document.getElementById('selectedProductDisplay').innerText = `${name} — ${price} ₽`;
    document.getElementById('orderProductName').value = name;
    document.getElementById('orderProductPrice').value = price;
    document.getElementById('orderQuantity').value = 1;
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('deliveryMethod').value = 'pickup';
    updateTotalPrice();
    orderModal.style.display = 'flex';
}

function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('orderQuantity').value) || 1;
    const delivery = document.getElementById('deliveryMethod').value === 'delivery' ? 200 : 0;
    const total = currentProduct.price * quantity + delivery;
    document.getElementById('totalPrice').innerHTML = `ИТОГО: ${total} ₽`;
}

document.getElementById('orderQuantity')?.addEventListener('input', updateTotalPrice);
document.getElementById('deliveryMethod')?.addEventListener('change', updateTotalPrice);

document.getElementById('orderForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const quantity = parseInt(document.getElementById('orderQuantity').value);
    const deliveryMethod = document.getElementById('deliveryMethod').value;
    const deliveryPrice = deliveryMethod === 'delivery' ? 200 : 0;
    const totalPrice = currentProduct.price * quantity + deliveryPrice;
    
    if (!customerName || !customerPhone) {
        alert('❌ Пожалуйста, введите имя и телефон');
        return;
    }
    
    const now = new Date();
    const orderId = Math.floor(Math.random() * 1000000);
    
    const receiptHTML = `
        <div style="text-align: center;">
            <div style="font-size: 1.5rem;">☕ AROMA COFFEE</div>
            <div style="font-size: 0.8rem; color: #8B5A2B;">г. Москва, ул. Кофейная, 15</div>
            <div style="font-size: 0.7rem; color: #8B5A2B;">Тел: +7 (999) 123-45-67</div>
            <div style="border-top: 1px dashed #DBC8AC; margin: 12px 0;"></div>
            <div><strong>ЧЕК № ${orderId}</strong></div>
            <div>${now.toLocaleString()}</div>
            <div style="border-top: 1px dashed #DBC8AC; margin: 12px 0;"></div>
            <div class="receipt-item"><span>${currentProduct.name}</span><span>${currentProduct.price} ₽ x ${quantity}</span></div>
            ${deliveryMethod === 'delivery' ? '<div class="receipt-item"><span>🚚 Доставка</span><span>200 ₽</span></div>' : ''}
            <div class="receipt-total">К ОПЛАТЕ: ${totalPrice} ₽</div>
            <div style="border-top: 1px dashed #DBC8AC; margin: 12px 0;"></div>
            <div>Клиент: ${customerName}</div>
            <div>Телефон: ${customerPhone}</div>
            <div>Способ: ${deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка'}</div>
            <div class="receipt-footer">Спасибо за заказ! Ждём вас в AROMA ☕</div>
        </div>
    `;
    
    document.getElementById('receiptBody').innerHTML = receiptHTML;
    orderModal.style.display = 'none';
    receiptModal.style.display = 'flex';
});

document.getElementById('closeOrderBtn')?.addEventListener('click', () => {
    orderModal.style.display = 'none';
});
document.getElementById('closeReceiptBtn')?.addEventListener('click', () => {
    receiptModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === orderModal) orderModal.style.display = 'none';
    if (e.target === receiptModal) receiptModal.style.display = 'none';
});

document.getElementById('printReceiptBtn')?.addEventListener('click', () => {
    const receiptContent = document.getElementById('receiptBody').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head><title>Чек AROMA</title>
        <style>
            body { font-family: 'Courier New', monospace; padding: 20px; max-width: 400px; margin: 0 auto; }
            .receipt-item { display: flex; justify-content: space-between; margin: 8px 0; }
            .receipt-total { font-weight: bold; font-size: 1.2rem; margin-top: 12px; text-align: right; }
        </style>
        </head>
        <body>${receiptContent}</body>
        </html>
    `);
    printWindow.print();
    printWindow.close();
});

// ========== ФОРМА ОБРАТНОЙ СВЯЗИ ==========
const contactForm = document.getElementById('feedbackForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();
        
        if (!name || !email || !message) {
            alert("❌ Пожалуйста, заполните все поля.");
            return;
        }
        if (!email.includes('@')) {
            alert("❌ Введите корректный email.");
            return;
        }
        alert("✅ Сообщение не отправлено (демо-режим). Спасибо за внимание!");
        contactForm.reset();
    });
}

const bookingBtn = document.getElementById('heroBookingBtn');
if (bookingBtn) {
    bookingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'contacts.html#booking';
    });
}