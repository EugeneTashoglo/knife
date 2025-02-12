import express from "express";
import session from "express-session";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

// Загружаем переменные среды из .env
dotenv.config();

const app = express();
const PORT = 3000;

// Подключение к базе данных SQLite
const dbPath = path.resolve("C:/sqlite/knives.db");
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.error("❌ Ошибка подключения к БД:", err.message);
  else console.log("✅ Подключено к базе данных SQLite");
});

// CORS (разрешаем запросы с клиента)
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Настройка сессии
app.use(
  session({
    secret: "super_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// API: Получить список ножей из базы данных
app.get("/api/knives", (req, res) => {
  const sql = "SELECT * FROM products";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API: Получить нож по ID
app.get("/api/knives/:id", (req, res) => {
  const sql = "SELECT * FROM products WHERE id = ?";
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Нож не найден." });
      return;
    }
    res.json(row);
  });
});

// API: Добавить новый нож
app.post("/api/knives", (req, res) => {
  const {
    name,
    description,
    category,
    blade_material,
    handle_material,
    length,
    weight,
    price,
    image_url,
  } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: "Название и цена обязательны" });
  }

  const sql = `
    INSERT INTO products (name, description, category, blade_material, handle_material, length, weight, price, image_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    name,
    description,
    category,
    blade_material,
    handle_material,
    length,
    weight,
    price,
    image_url,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, ...req.body });
  });
});

// API: Удалить нож
app.delete("/api/knives/:id", (req, res) => {
  const sql = "DELETE FROM products WHERE id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Нож удалён", changes: this.changes });
  });
});

// API: Обновить данные о ноже
app.put("/api/knives/:id", (req, res) => {
  const {
    name,
    description,
    category,
    blade_material,
    handle_material,
    length,
    weight,
    price,
    image_url,
  } = req.body;
  const sql = `
    UPDATE products 
    SET name = ?, description = ?, category = ?, blade_material = ?, handle_material = ?, length = ?, weight = ?, price = ?, image_url = ?
    WHERE id = ?`;
  const params = [
    name,
    description,
    category,
    blade_material,
    handle_material,
    length,
    weight,
    price,
    image_url,
    req.params.id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Нож обновлён", changes: this.changes });
  });
});

// Настройка nodemailer для отправки email через Yandex SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: "tashoglo00@yandex.ru",
    pass: "zbrquwaoswjszmyd",
  },
});

// API: Отправка email при заказе
app.post("/api/send-email", async (req, res) => {
  const { email, name, phone, address, paymentMethod, items, total } = req.body;

  if (!email || !name || !items || !total) {
    return res.status(400).json({ error: "Некорректные данные для заказа" });
  }

  const mailOptions = {
    from: '"Магазин ножей" <tashoglo00@yandex.ru>',
    to: email,
    subject: "Ваш заказ оформлен",
    text: `Здравствуйте, ${name}!

Ваш заказ:
${items}

Сумма: ${total}

Спасибо за покупку!`,
    html: `<h2>Здравствуйте, ${name}!</h2><p><strong>Ваш заказ:</strong></p><pre>${items}</pre><p><strong>Сумма:</strong> ${total}</p><p>Спасибо за покупку!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "Письмо отправлено!" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при отправке письма." });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
