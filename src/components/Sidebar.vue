<template>
    <aside class="sidebar">
      <h3>Цена, $</h3>
      <div class="range-inputs">
        <input type="number" v-model="tempFilters.priceMin" placeholder="80" />
        <span>—</span>
        <input type="number" v-model="tempFilters.priceMax" placeholder="500" />
      </div>
  
      <h3>Категория</h3>
      <div class="checkbox-group">
        <label><input type="checkbox" v-model="tempFilters.categories" value="Охотничьи ножи" /> Охотничьи ножи</label>
        <label><input type="checkbox" v-model="tempFilters.categories" value="Коллекционные ножи" /> Коллекционные ножи</label>
      </div>
  
      <h3>Материал ручки</h3>
      <div class="checkbox-group">
        <label><input type="checkbox" v-model="tempFilters.handleMaterials" value="Пластик" /> Пластик</label>
        <label><input type="checkbox" v-model="tempFilters.handleMaterials" value="Дерево" /> Дерево</label>
      </div>
  
      <h3>Материал лезвия</h3>
      <div class="checkbox-group">
        <label><input type="checkbox" v-model="tempFilters.bladeMaterials" value="Нержавеющая сталь" /> Нержавеющая сталь</label>
        <label><input type="checkbox" v-model="tempFilters.bladeMaterials" value="Сталь" /> Сталь</label>
        <label><input type="checkbox" v-model="tempFilters.bladeMaterials" value="Углеродистая сталь" /> Углеродистая сталь</label>
      </div>
  
      <h3>Длина лезвия, см</h3>
      <div class="range-inputs">
        <input type="number" v-model="tempFilters.lengthMin" placeholder="15" />
        <span>—</span>
        <input type="number" v-model="tempFilters.lengthMax" placeholder="31" />
      </div>
  
      <h3>Вес, кг</h3>
      <div class="range-inputs">
        <input type="number" v-model="tempFilters.weightMin" placeholder="0.2" />
        <span>—</span>
        <input type="number" v-model="tempFilters.weightMax" placeholder="0.8" />
      </div>
  
      <button class="apply-btn" @click="applyFilters">Применить</button>
      <button class="reset-btn" @click="resetFilters">Сбросить</button>
    </aside>
  </template>
  
  <script>
  export default {
    data() {
      return {
        tempFilters: {
          priceMin: 80,
          priceMax: 500,
          categories: [],
          handleMaterials: [],
          bladeMaterials: [],
          lengthMin: 15,
          lengthMax: 31,
          weightMin: 0.2,
          weightMax: 0.8,
        },
        defaultFilters: {}, // Для хранения начальных значений
      };
    },
    created() {
      this.defaultFilters = JSON.parse(JSON.stringify(this.tempFilters));
    },
    methods: {
      applyFilters() {
        this.$emit("filter", JSON.parse(JSON.stringify(this.tempFilters))); // Клонируем объект
      },
      resetFilters() {
        this.tempFilters = JSON.parse(JSON.stringify(this.defaultFilters));
        this.$emit("filter", JSON.parse(JSON.stringify(this.defaultFilters)));
      },
    },
  };
  </script>
  
  <style scoped>
  .sidebar {
    background-color: #1b1b1b;
    color: white;
    padding: 20px;
    width: 100%;
    max-width: 250px;
    border-radius: 8px;
  }
  
  h3 {
    color: #5da8ff;
    margin-bottom: 10px;
  }
  
  .range-inputs {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .range-inputs input {
    width: 45%;
    padding: 5px;
    text-align: center;
    background: #2a2a2a;
    color: white;
    border: none;
    border-radius: 5px;
  }
  
  .checkbox-group label {
    display: block;
    margin-bottom: 5px;
  }
  
  .apply-btn, .reset-btn {
    background-color: #1A9FFF;
    color: #20232E;
    padding: 10px;
    width: 100%;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .reset-btn {
    background-color: #ff5555;
    border-radius: 10px;

  }
  </style>
  