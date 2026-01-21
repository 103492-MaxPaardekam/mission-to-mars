// Menu / Eten - Mission to Mars
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");
  const categories = document.querySelectorAll(".menu-category");
  const menuItems = document.querySelectorAll(".menu-item");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const selectedItemsEl = document.getElementById("selectedItems");
  const orderBtn = document.getElementById("orderBtn");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");

  // Cart state
  let cart = [];

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const category = tab.dataset.category;

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Show corresponding category
      categories.forEach((cat) => {
        cat.classList.remove("active");
        if (cat.id === category) {
          cat.classList.add("active");
        }
      });
    });
  });

  // Menu item selection (multi-select)
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const name = item.dataset.name;
      const price = parseFloat(item.dataset.price);

      if (item.classList.contains("selected")) {
        // Remove from cart
        item.classList.remove("selected");
        const index = cart.findIndex((i) => i.name === name);
        if (index > -1) {
          cart.splice(index, 1);
        }
      } else {
        // Add to cart
        item.classList.add("selected");
        cart.push({ name, price });
      }

      updateCartDisplay();
    });
  });

  function updateCartDisplay() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartCount.textContent = cart.length;
    cartTotal.textContent = total.toFixed(2) + " credits";

    if (cart.length === 0) {
      selectedItemsEl.textContent = "Selecteer items om te bestellen";
      orderBtn.disabled = true;
    } else {
      const names = cart.map((i) => i.name).join(", ");
      selectedItemsEl.textContent = names;
      orderBtn.disabled = false;
    }
  }

  // Order button
  orderBtn.addEventListener("click", () => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const itemList = cart
      .map((i) => `${i.name} - ${i.price.toFixed(2)}`)
      .join("<br>");

    modalBody.innerHTML = `
      <div style="text-align: left; margin-bottom: 15px;">
        ${itemList}
      </div>
      <div style="border-top: 1px solid rgba(51, 175, 255, 0.3); padding-top: 10px; font-family: Orbitron; color: #10b981;">
        Totaal: ${total.toFixed(2)} credits
      </div>
      <div style="margin-top: 15px; font-size: 12px; color: #a0aec0;">
        Levertijd: ~15 minuten
      </div>
    `;

    modalOverlay.classList.add("active");

    // Clear cart after order
    cart = [];
    menuItems.forEach((item) => item.classList.remove("selected"));
    updateCartDisplay();
  });

  // Close modal
  modalClose.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove("active");
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      modalOverlay.classList.remove("active");
    }

    const tabArray = Array.from(tabs);
    const activeIndex = tabArray.findIndex((t) =>
      t.classList.contains("active"),
    );

    if (e.key === "ArrowRight" && activeIndex < tabArray.length - 1) {
      tabArray[activeIndex + 1].click();
    } else if (e.key === "ArrowLeft" && activeIndex > 0) {
      tabArray[activeIndex - 1].click();
    }
  });

  // Initialize
  updateCartDisplay();
});
