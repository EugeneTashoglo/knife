<template>
    <div class="knife-detail">
      <router-link to="/" class="back-link">← Магазин игровых ножей</router-link>
  
      <div v-if="knife" class="detail-container">
        <img :src="imagePath" :alt="knife.name" class="knife-image" />
  
        <div class="knife-info">
          <h1 class="knife-title">{{ knife.name ? knife.name.toUpperCase() : '' }}</h1>
          <p class="knife-description">{{ knife.description }}</p>
  
          <div class="knife-specs">
            <p><strong>Категория:</strong> <span>{{ knife.category }}</span></p>
            <p><strong>Материал лезвия:</strong> <span>{{ knife.blade_material }}</span></p>
            <p><strong>Материал ручки:</strong> <span>{{ knife.handle_material }}</span></p>
            <p><strong>Длина лезвия:</strong> <span>{{ knife.length }} см</span></p>
            <p><strong>Вес:</strong> <span>{{ knife.weight }} кг</span></p>
          </div>
  
          <h2 class="knife-price">{{ knife.price }} $</h2>
  
          <div class="buttons">
            <button class="cart-btn" @click="addToCart">Добавить в корзину</button>
            <button class="game-btn">Осмотреть в игре</button>
          </div>
        </div>
      </div>
  
      <p v-else class="loading">⏳ Загрузка...</p>
    </div>
  </template>
  
  <script>
  import { eventBus } from "@/eventBus.js";
  
  const images = import.meta.glob("@/assets/images/*.png", { eager: true });
  
  export default {
    props: ["id"],
    data() {
      return {
        knife: null,
      };
    },
    computed: {
      imagePath() {
        if (!this.knife || !this.knife.image_url) return "/src/assets/images/default.png"; // Заглушка
        const fileName = this.knife.image_url.split("/").pop().replace(".jpg", ".png"); // Заменяем .jpg на .png
        return images[`/src/assets/images/${fileName}`]?.default || "/src/assets/images/default.png";
      },
    },
    mounted() {
      this.fetchKnife();
    },
    methods: {
      async fetchKnife() {
  try {
    const response = await fetch(`http://localhost:3000/api/knives/${this.id}`);
    
    if (!response.ok) {
      throw new Error("Нож не найден.");
    }

    this.knife = await response.json();
  } catch (error) {
    console.error("Ошибка при загрузке ножа:", error);
    this.knife = null; // Убираем загрузку, если нож не найден
  }
},
      addToCart() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existingItem = cart.find(item => item.id === this.knife.id);
  
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cart.push({ ...this.knife, quantity: 1 });
        }
  
        localStorage.setItem("cart", JSON.stringify(cart));
        eventBus.emit("cartUpdated"); // 🔥 Сообщаем футеру, что корзина обновилась
        alert(`${this.knife.name} добавлен в корзину!`);
      }
    }
  };
  </script>
  
  
  
  <style scoped>
  .knife-detail {
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
  
  .detail-container {
    display: flex;
    align-items: center;
    gap: 30px;
  }
  
  .knife-image {
    background-color: #071215;
    max-width: 400px;
  }
  
  .knife-info {
    max-width: 500px;
  }
  
  .knife-title {
    font-size: 32px;
    font-weight: bold;
  }
  
  .knife-description {
    font-size: 18px;
    color: #ccc;
    margin-bottom: 10px;
  }
  
  .knife-specs p {
    font-size: 16px;
    margin: 5px 0;
  }
  
  .knife-specs strong {
    color: #546671;
  }
  
  .knife-specs span {
    color: #66c0f4;
  }
  
  .knife-price {
    font-size: 28px;
    color: #66c0f4;
    margin: 20px 0;
  }
  
  .buttons {
    display: flex;
    gap: 15px;
  }
  
  .cart-btn {
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .game-btn {
    background-color: #5da8ff;
    color: white;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    border-radius: 5px;
  }
  
  /* Анимация загрузки */
  .loading {
    text-align: center;
    font-size: 18px;
    color: white;
    padding: 20px;
  }
  </style>
  