<template>
    <footer class="footer">
      <div class="footer-left">
        <img src="@/assets/image/logo.png" alt="Steam Logo" class="steam-logo" />
      </div>
  
      <div class="footer-center">
        <p>© 2024 Valve Corporation. Все права сохранены</p>
      </div>
  
      <div class="footer-right">
        <button class="cart-button" @click="$router.push('/cart')">
          <div class="cart-icon-container">
            <i class="cart-icon">🛒</i>
            <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
          </div>
          корзина
        </button>
      </div>
    </footer>
  </template>
  
  <script>
  import { eventBus } from "@/eventBus.js";
  
  export default {
    data() {
      return {
        cartItemCount: 0,
      };
    },
    methods: {
      updateCartCount() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        this.cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
      },
    },
    mounted() {
      this.updateCartCount();
      eventBus.on("cartUpdated", this.updateCartCount);
    },
    beforeUnmount() {
      eventBus.off("cartUpdated", this.updateCartCount);
    }
  };
  </script>
  
  <style scoped>
  .footer {
    background-color: #1b1b1b;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    width: 100%;
    margin-top: auto; /* Позволяет футеру оставаться внизу */
  }
  
  .footer-left img {
    height: 20px;
  }
  
  .footer-center p {
    font-size: 12px;
    color: #ccc;
  }
  
  .footer-right {
    display: flex;
    align-items: center;
  }
  
  .cart-button {
    background: none;
    border: none;
    color: white;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .cart-icon-container {
    position: relative;
    display: inline-block;
  }
  
  .cart-icon {
    font-size: 18px;
    margin-right: 5px;
  }
  
  .cart-count {
    position: absolute;
    top: -5px;
    right: -10px;
    background-color: red;
    color: white;
    font-size: 12px;
    font-weight: bold;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  