import express from "express";
import session from "express-session";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import passport from "passport";
import { Strategy as SteamStrategy } from "passport-steam";

dotenv.config();

const app = express();
const PORT = 3000;
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.resolve(__dirname, "sqlite", "knives.db");


const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.error("❌ Ошибка подключения к БД:", err.message);
  else console.log("✅ Подключено к базе данных SQLite");
});
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Доступ запрещен" });
};

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.get("/admin", isAdmin, (req, res) => {
  res.json({ message: "Добро пожаловать в админ-панель!" });
});

app.use(
  session({
    secret: "super_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:3000/auth/steam/return",
      realm: "http://localhost:3000/",
      apiKey: "973AC5E2135A3737608900A5EC911419",
    },
    (identifier, profile, done) => {
      const steamID = profile.id;
      const username = profile.displayName;
      const avatar = profile.photos[2].value;

      db.get(
        "SELECT * FROM users WHERE steam_id = ?",
        [steamID],
        (err, row) => {
          if (err) return done(err);
          if (row) {
            return done(null, row);
          } else {
            db.run(
              "INSERT INTO users (steam_id, username, avatar, role) VALUES (?, ?, ?, 'user')",
              [steamID, username, avatar],
              function (err) {
                if (err) return done(err);
                return done(null, {
                  id: this.lastID,
                  steam_id: steamID,
                  username,
                  avatar,
                  role: "user",
                });
              }
            );
          }
        }
      );
    }
  )
);

passport.serializeUser((user, done) => done(null, user.steam_id));
passport.deserializeUser((steam_id, done) => {
  db.get("SELECT * FROM users WHERE steam_id = ?", [steam_id], (err, row) => {
    done(err, row);
  });
});

app.get("/auth/steam", passport.authenticate("steam"));

app.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/" }),
  (req, res) => res.redirect("http://localhost:5173")
);

app.get("/api/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      steam_id: req.user.steam_id,
      username: req.user.username,
      avatar: req.user.avatar,
      role: req.user.role,
    });
  } else {
    res.status(401).json({ error: "Пользователь не авторизован" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Ошибка выхода" });
    }
    res.clearCookie("connect.sid"); // Удаляем куку сессии
    res.json({ message: "Выход выполнен" });
  });
});

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
// API: Удалить нож по ID
app.delete("/api/knives/:id", (req, res) => {
  const sql = "DELETE FROM products WHERE id = ?";
  db.run(sql, [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Нож не найден." });
      return;
    }
    res.json({ message: "Нож удален успешно" });
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
// SMTP настройка
const transporter = nodemailer.createTransport({
  service: "Yandex",
  auth: {
    user: "tashoglo00@yandex.ru",
    pass: "zbrquwaoswjszmyd",
  },
});

// API: Отправка email с заказом
app.post("/api/send-email", async (req, res) => {
  const { name, email, phone, address, paymentMethod, items, total } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !address ||
    !paymentMethod ||
    !items ||
    !total
  ) {
    return res.status(400).json({ error: "Все поля обязательны" });
  }

  const mailOptions = {
    from: "tashoglo00@yandex.ru",
    to: email,
    subject: "Подтверждение заказа",
    text: `Здравствуйте, ${name}!

Ваш заказ оформлен:

Товары:
${items}

Общая сумма: ${total}

Способ оплаты: ${paymentMethod}

Адрес доставки: ${address}

Спасибо за покупку!`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Письмо успешно отправлено!" });
  } catch (error) {
    console.error("Ошибка при отправке письма:", error);
    res.status(500).json({ error: "Ошибка при отправке email" });
  }
});
app.listen(PORT, () =>
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
);
