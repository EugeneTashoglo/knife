<template>
  <div class="cart">
    <router-link to="/" class="back-link">← Магазин игровых ножей</router-link>

    <h1>Корзина</h1>

    <div v-if="cartItems.length > 0" class="cart-container">
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img
            :src="getImagePath(item.image_url)"
            :alt="item.name"
            class="item-image"
          />
          <div class="item-details">
            <h2>{{ item.name.toUpperCase() }}</h2>
            <div class="quantity-controls">
              <button @click="decreaseQuantity(item)">➖</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQuantity(item)">➕</button>
            </div>
            <button class="remove-btn" @click="removeItem(item.id)">
              🗑 Удалить
            </button>
          </div>
          <p class="item-price">{{ item.price * item.quantity }} $</p>
        </div>
      </div>

      <div class="cart-summary">
        <p>
          ВЫБРАНО ТОВАРОВ <span>{{ totalItems }}</span>
        </p>
        <hr />
        <h2>
          ИТОГО <span>{{ totalPrice }} $</span>
        </h2>
        <button class="checkout-btn" @click="$router.push('/checkout')">
          Оформить заказ
        </button>
      </div>
    </div>

    <p v-else class="empty-cart">🛒 Ваша корзина пуста</p>
  </div>
</template>

<script>
const images = import.meta.glob("@/assets/images/*.png", { eager: true });

export default {
  data() {
    return {
      cartItems: [],
    };
  },
  computed: {
    totalItems() {
      return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    totalPrice() {
      return this.cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
  },
  methods: {
    getImagePath(imageUrl) {
      if (!imageUrl) return "/src/assets/images/default.png"; // Заглушка, если нет изображения
      const fileName = imageUrl.split("/").pop().replace(".jpg", ".png"); // Заменяем .jpg на .png
      return (
        images[`/src/assets/images/${fileName}`]?.default ||
        "/src/assets/images/default.png"
      );
    },
    increaseQuantity(item) {
      item.quantity++;
      this.saveCart();
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.saveCart();
      }
    },
    removeItem(id) {
      this.cartItems = this.cartItems.filter((item) => item.id !== id);
      this.saveCart();
    },
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cartItems));
    },
    loadCart() {
      const cart = localStorage.getItem("cart");
      if (cart) {
        this.cartItems = JSON.parse(cart);
      }
    },
  },
  mounted() {
    this.loadCart();
  },
};
</script>

<style scoped>
.cart {
  color: white;
  padding: 20px;
}

.back-link {
  color: #5da8ff;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 15px;
  display: inline-block;
}

h1 {
  font-size: 24px;
}

.cart-container {
  display: flex;
  gap: 20px;
}

.cart-items {
  width: 70%;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #1b1b1b;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.item-image {
  width: 80px;
  height: auto;
  border-radius: 5px;
}

.item-details {
  flex: 1;
}

.item-details h2 {
  font-size: 18px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff5555;
  cursor: pointer;
}

.item-price {
  font-size: 18px;
  color: white;
  font-weight: bold;
}

.cart-summary {
  width: 30%;
  background: #1b1b1b;
  padding: 20px;
  border-radius: 8px;
}

.cart-summary p {
  font-size: 16px;
}

.cart-summary h2 {
  font-size: 24px;
  margin-top: 10px;
}

.cart-summary span {
  float: right;
}

.checkout-btn {
  background-color: #28a745;
  color: white;
  padding: 10px;
  width: 100%;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}

.empty-cart {
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
}
</style>
