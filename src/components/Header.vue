<template>
  <header class="header">
    <div class="container">
      <div class="header-left">
        <img src="@/assets/image/logo.png" alt="Steam Logo" class="logo" />
        <nav class="nav">
          <a href="#" class="nav-link">МАГАЗИН ИГРОВЫХ НОЖЕЙ</a>
          <a href="#" class="nav-link">ПОДДЕРЖКА</a>
        </nav>
      </div>
      <div class="header-right">
        <button class="install-btn">Установить Steam</button>
        <div class="auth-links">
          <a  class="login">войти через Steam</a>
          <span class="divider">|</span>
          <a href="#" class="language">язык</a>
        </div>
      </div>
    </div>
    <div class="banner">
      <p>ВЫБЕРИ СВОЙ НОЖ ИЗ ИГРОВОЙ РЕАЛЬНОСТИ STEAM</p>
    </div>
  </header>
</template>


<style scoped>
.header {
  background-color: #1b1b1b;
  color: white;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Тень для выделения */
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.header-left {
  display: flex;
  align-items: center;
}
.logo {
  height: 30px;
  margin-right: 20px;
}
.nav {
  display: flex;
}
.nav-link {
  color: #5da8ff;
  margin-right: 15px;
  text-decoration: none;
}
.nav-link:hover {
  text-decoration: underline;
}
.header-right {
  display: flex;
  align-items: center;
}
.install-btn {
  background-color: #5da8ff;
  border: none;
  padding: 5px 10px;
  color: white;
  cursor: pointer;
  margin-right: 15px;
}
.auth-links {
  display: flex;
  align-items: center;
}
.login, .language {
  color: white;
  text-decoration: none;
}
.divider {
  margin: 0 5px;
  color: gray;
}
.banner {
  background-color: #111;
  text-align: center;
  padding: 15px 0;
  margin-top: 60px;
}
.banner h1 {
  font-size: 18px;
  font-weight: bold;
}
</style>
