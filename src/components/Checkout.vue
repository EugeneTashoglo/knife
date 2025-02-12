<template>
  <div class="checkout">
    <router-link to="/cart" class="back-link"
      >← Вернуться в корзину</router-link
    >

    <h1>Оформление заказа</h1>

    <form @submit.prevent="submitOrder">
      <div class="form-group">
        <label for="name">Имя</label>
        <input type="text" id="name" v-model="order.name" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="order.email" required />
      </div>

      <div class="form-group">
        <label for="phone">Телефон</label>
        <input type="tel" id="phone" v-model="order.phone" required />
      </div>

      <div class="form-group">
        <label for="address">Адрес доставки</label>
        <textarea id="address" v-model="order.address" required></textarea>
      </div>

      <div class="form-group">
        <label for="payment">Способ оплаты</label>
        <select id="payment" v-model="order.paymentMethod" required>
          <option value="card">💳 Оплата картой</option>
          <option value="cash">💵 Наложенный платеж</option>
          <option value="crypto">₿ Криптовалюта</option>
        </select>
      </div>

      <div class="order-summary">
        <p>
          Количество товаров: <strong>{{ totalItems }}</strong>
        </p>
        <p>
          Итоговая сумма: <strong>{{ totalPrice }} $</strong>
        </p>
      </div>

      <button type="submit" class="checkout-btn">Подтвердить заказ</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        name: "",
        email: "",
        phone: "",
        address: "",
        paymentMethod: "card",
      },
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
    loadCart() {
      const cart = localStorage.getItem("cart");
      if (cart) {
        this.cartItems = JSON.parse(cart);
      }
    },
    async submitOrder() {
      this.successMessage = "";
      this.errorMessage = "";

      if (
        !this.order.name ||
        !this.order.email ||
        !this.order.phone ||
        !this.order.address
      ) {
        alert("❌ Все поля должны быть заполнены!");
        return;
      }

      if (this.cartItems.length === 0) {
        alert("❌ Корзина пуста!");
        return;
      }

      const orderData = {
        name: this.order.name,
        email: this.order.email,
        phone: this.order.phone,
        address: this.order.address,
        paymentMethod: this.order.paymentMethod,
        items: this.cartItems
          .map(
            (item) =>
              `${item.name} (x${item.quantity}) - ${
                item.price * item.quantity
              } $`
          )
          .join("\n"),
        total: `${this.totalPrice} $`,
      };

      console.log("📤 Отправка заказа:", orderData);

      try {
        const response = await fetch("http://localhost:3000/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (response.ok) {
          alert("✅ Заказ успешно оформлен! Письмо отправлено.");
          localStorage.removeItem("cart");
          this.cartItems = [];
          this.$router.push("/");
        } else {
          throw new Error(result.error || "Ошибка при оформлении заказа.");
        }
      } catch (error) {
        console.error("❌ Ошибка при отправке email:", error);
        alert("❌ Ошибка при оформлении заказа. Попробуйте снова.");
      }
    },
  },
  mounted() {
    this.loadCart();
  },
};
</script>

<style scoped>
.checkout {
  color: white;
  padding: 20px;
  max-width: 500px;
  margin: auto;
  background: #1b1b1b;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(93, 168, 255, 0.3);
}

.back-link {
  color: #5da8ff;
  text-decoration: none;
  font-size: 14px;
  display: inline-block;
  margin-bottom: 15px;
}

h1 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-size: 16px;
  margin-bottom: 5px;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: none;
  border-radius: 5px;
  background: #2c3e50;
  color: white;
}

textarea {
  height: 60px;
  resize: none;
}

.order-summary {
  background: #0d1b2a;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
}

.order-summary p {
  font-size: 16px;
  margin: 5px 0;
}

.checkout-btn {
  background-color: #28a745;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 15px;
  text-align: center;
}

.checkout-btn:hover {
  background-color: #218838;
}
</style>
