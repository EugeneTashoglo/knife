<template>
  <div class="item" @click="goToDetail">
    <img :src="imagePath" :alt="knife.name" class="item-image" />
    <div class="info">
      <h3 class="item-title">{{ knife.name }}</h3>
      <p class="item-price">{{ knife.price }} $</p>
    </div>
  </div>
</template>

<script>
const images = import.meta.glob("@/assets/images/*.png", { eager: true });

export default {
  props: {
    knife: Object,
  },
  computed: {
    imagePath() {
      if (!this.knife.image_url) return "/default-image.jpg"; // ✅ Картинка по умолчанию

      if (this.knife.image_url.startsWith("http")) {
        return this.knife.image_url; // ✅ Если это внешняя ссылка, возвращаем её
      }

      const fileName = this.knife.image_url.split("/").pop().replace(".jpg", ".png");

      return images[`/src/assets/images/${fileName}`]?.default || `/uploads/${fileName}`; // ✅ Либо файл из локальной папки
    },
  },
  methods: {
    goToDetail() {
      this.$router.push(`/knife/${this.knife.id}`);
    },
  },
};
</script>

<style scoped>
.item {
  text-align: center;
  max-width: 200px;
  cursor: pointer;
  color: #c1c8d6;
  background-color: #223a62;
  transition: transform 0.2s ease;
}

.item:hover {
  transform: scale(1.05);
}

.item-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
}
.info {
  background-color: #192f4d;
}
.item-title {
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
}

.item-price {
  font-size: 16px;
  color: #c1c8d6;
  font-weight: bold;
}
</style>
