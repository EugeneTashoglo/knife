<template>
  <div id="app">
    <Header />

    <div class="main-content">
      <!-- Sidebar отображается только на главной странице -->
      <Sidebar v-if="isItemListPage" @filter="applyFilter" />
      
      <!-- Главный контент с динамической подгрузкой -->
      <router-view :filters="filters" />
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Sidebar,
    Footer
  },
  data() {
    return {
      filters: {},
    };
  },
  computed: {
    // Показываем Sidebar только на главной странице
    isItemListPage() {
      return this.$route.path === "/" || this.$route.path.startsWith("/category");
    }
  },
  methods: {
    applyFilter(filterData) {
      this.filters = filterData;
    },
  },
};
</script>

<style>
/* Сброс отступов */
html, body {
  margin: 0;
  padding: 0;
  background-color: #1b2838;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  color: white;
}

/* Общие стили для всей страницы */
* {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

/* Контейнер для Sidebar и ItemList */
.main-content {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  min-height: calc(100vh - 80px); /* Фикс для прилипания футера */
}

/* Sidebar занимает 25% ширины, а ItemList 75% */
.sidebar {
  width: 25%;
}

.item-list {
  width: 75%;
}

/* Фикс для прилипания футера */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>
