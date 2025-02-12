<template>
  <div class="admin-panel">
    <h1>🛠 Админ-панель</h1>

    <!-- Форма для добавления ножа -->
    <form @submit.prevent="addKnife">
      <input v-model="newKnife.name" placeholder="Название ножа" required />
      <input v-model="newKnife.description" placeholder="Описание" />
      <input v-model="newKnife.category" placeholder="Категория" />
      <input v-model="newKnife.blade_material" placeholder="Материал лезвия" />
      <input v-model="newKnife.handle_material" placeholder="Материал ручки" />
      <input v-model="newKnife.length" type="number" placeholder="Длина (см)" />
      <input v-model="newKnife.weight" type="number" placeholder="Вес (кг)" />
      <input v-model="newKnife.price" type="number" placeholder="Цена ($)" required />
      <input v-model="newKnife.image_url" placeholder="Ссылка на изображение" />
      <button type="submit">Добавить нож</button>
    </form>

    <!-- Список товаров -->
    <h2>📦 Товары</h2>
    <ul>
      <li v-for="knife in knives" :key="knife.id">
        <img v-if="knife.image_url" :src="knife.image_url" alt="Изображение ножа" class="knife-image" />
        <strong>{{ knife.name }}</strong> - {{ knife.price }} $
        <button @click="deleteKnife(knife.id)">🗑</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      knives: [],
      newKnife: {
        name: "",
        description: "",
        category: "",
        blade_material: "",
        handle_material: "",
        length: "",
        weight: "",
        price: "",
        image_url: "",
      },
    };
  },
  methods: {
    async fetchKnives() {
      try {
        const res = await axios.get("http://localhost:3000/api/knives");
        this.knives = res.data;
      } catch (error) {
        console.error("Ошибка при получении списка ножей:", error);
      }
    },
    async addKnife() {
      try {
        const res = await axios.post("http://localhost:3000/api/knives", this.newKnife);
        this.knives.push(res.data); // Добавляем новый нож в список
        this.clearForm();
      } catch (error) {
        console.error("Ошибка при добавлении ножа:", error);
      }
    },
    async deleteKnife(id) {
      try {
        await axios.delete(`http://localhost:3000/api/knives/${id}`);
        this.knives = this.knives.filter(knife => knife.id !== id); // Удаляем нож локально
      } catch (error) {
        console.error("Ошибка при удалении ножа:", error);
      }
    },
    clearForm() {
      this.newKnife = {
        name: "",
        description: "",
        category: "",
        blade_material: "",
        handle_material: "",
        length: "",
        weight: "",
        price: "",
        image_url: "",
      };
    }
  },
  mounted() {
    this.fetchKnives();
  },
};
</script>
  
  <style scoped>
  .admin-panel {
    color: white;
    padding: 20px;
  }
  
  h1, h2 {
    margin-bottom: 15px;
  }
  
  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  form input {
    padding: 8px;
    border: 1px solid #ccc;
  }
  
  button {
    padding: 8px;
    background: #5da8ff;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    display: flex;
    justify-content: space-between;
    background: #222;
    padding: 10px;
    margin: 5px 0;
  }
  
  button {
    background: red;
  }
  </style>
  