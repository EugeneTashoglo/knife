<template>
  <div class="item-list">
    <template v-if="filteredKnives.length > 0">
      <Item v-for="knife in filteredKnives" :key="knife.id" :knife="knife" />
    </template>
    <p v-else class="no-knives">❌ Ножей, соответствующих фильтрам, не найдено.</p>
  </div>
</template>

<script>
import Item from "./Item.vue";
import axios from "axios";

export default {
  props: {
    filters: Object, // Получаем фильтры
  },
  components: { Item },
  data() {
    return {
      knives: [],
      allKnives: [], // Сохраняем изначальный список ножей
    };
  },
  computed: {
    filteredKnives() {
      if (!this.filters || Object.keys(this.filters).length === 0) {
        return this.allKnives; // Показываем все ножи, если фильтры не заданы
      }

      return this.allKnives.filter(knife => {
        return (
          knife.price >= this.filters.priceMin &&
          knife.price <= this.filters.priceMax &&
          (this.filters.categories.length === 0 || this.filters.categories.includes(knife.category.trim())) &&
          (this.filters.handleMaterials.length === 0 || this.filters.handleMaterials.includes(knife.handle_material.trim())) &&
          (this.filters.bladeMaterials.length === 0 || 
            this.filters.bladeMaterials.some(material => 
              material.trim().toLowerCase() === knife.blade_material.trim().toLowerCase()
            )
          ) &&
          knife.length >= this.filters.lengthMin &&
          knife.length <= this.filters.lengthMax &&
          knife.weight >= this.filters.weightMin &&
          knife.weight <= this.filters.weightMax
        );
      });
    },
  },
  mounted() {
    this.fetchKnives();
  },
  methods: {
    async fetchKnives() {
      try {
        const response = await axios.get("http://localhost:3000/api/knives");
        this.knives = response.data;
        this.allKnives = response.data; // Сохраняем изначальный список ножей
      } catch (error) {
        console.error("Ошибка при загрузке ножей:", error);
      }
    },
  },
};
</script>

<style scoped>
.item-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 элемента в строке */
  gap: 20px;
  justify-content: center;
  padding: 20px;
  width: 75%;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .item-list {
    grid-template-columns: repeat(2, 1fr); /* 2 элемента на средних экранах */
  }
}

@media (max-width: 600px) {
  .item-list {
    grid-template-columns: repeat(1, 1fr); /* 1 элемент на мобильных */
  }
}

.no-knives {
  color: white;
  text-align: center;
  font-size: 18px;
  margin-top: 20px;
  grid-column: span 4; /* Сообщение центрируется */
}
</style>
