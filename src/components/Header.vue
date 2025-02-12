<template>
  <header class="header">
    <div class="container">
      <div class="header-left">
        <img src="@/assets/image/logo.png" alt="Steam Logo" class="logo" />
        <nav class="nav">
          <a href="#" class="nav-link">МАГАЗИН ИГРОВЫХ НОЖЕЙ</a>
          <a href="#" class="nav-link">ПОДДЕРЖКА</a>
          <a v-if="user && user.role === 'admin'" href="/admin" class="nav-link admin-link">Админ-панель</a>
        </nav>
      </div>
      <div class="header-right">
        <button class="install-btn">Установить Steam</button>
        <div class="auth-links">
          <template v-if="user">
            <img :src="user.avatar" alt="Avatar" class="avatar" />
            <span class="username">{{ user.username }}</span>
            <button @click="logout" class="logout-btn">Выйти</button>
          </template>
          <template v-else>
            <a href="http://localhost:3000/auth/steam" class="login">Войти через Steam</a>
          </template>
        </div>
      </div>
    </div>
 
  </header>
</template>

<script>
import { eventBus } from "@/eventBus";

export default {
  data() {
    return {
      user: null,
    };
  },
  async mounted() {
    await this.fetchUser();
    eventBus.on("user-logged-out", this.handleLogout);
  },
  beforeUnmount() {
    eventBus.off("user-logged-out", this.handleLogout);
  },
  methods: {
    async fetchUser() {
      try {
        const response = await fetch("http://localhost:3000/api/user", {
          credentials: "include",
        });
        if (response.ok) {
          this.user = await response.json();
        } else {
          this.user = null;
        }
      } catch (error) {
        console.error("Ошибка загрузки пользователя:", error);
      }
    },

    async logout() {
      try {
        await fetch("http://localhost:3000/logout", { credentials: "include" });

        document.cookie.split(";").forEach((c) => {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
        });

        eventBus.emit("user-logged-out");
        await this.fetchUser();
      } catch (error) {
        console.error("Ошибка выхода:", error);
      }
    },

    handleLogout() {
      this.user = null;
    },
  },
};
</script>


<style scoped>
.header {
  background-color: #1b1b1b;
  color: white;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}
.username {
  color: white;
  font-weight: bold;
  margin-right: 10px;
}
.logout-btn {
  background: #ff5555;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
.login {
  color: white;
  text-decoration: none;
}
.admin-link {
  color: red;
  font-weight: bold;
}
</style>
