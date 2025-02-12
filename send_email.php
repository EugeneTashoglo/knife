<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $phone = $_POST["phone"];
    $address = $_POST["address"];
    $paymentMethod = $_POST["paymentMethod"];
    $items = $_POST["items"];
    $total = $_POST["total"];

    $to = $email; // 📩 Отправляем на email покупателя
    $subject = "Ваш заказ принят! 🎉";
    $message = "
        <html>
        <head>
            <title>Заказ принят!</title>
        </head>
        <body>
            <h2>Здравствуйте, $name!</h2>
            <p>Ваш заказ успешно оформлен. 🎉</p>
            <h3>📦 Детали заказа:</h3>
            <p><strong>Товары:</strong> $items</p>
            <p><strong>Адрес доставки:</strong> $address</p>
            <p><strong>💳 Способ оплаты:</strong> $paymentMethod</p>
            <p><strong>💰 Итоговая сумма:</strong> $total</p>
            <hr>
            <p>📞 Контакты: $phone</p>
            <p>Спасибо за покупку!</p>
        </body>
        </html>
    ";

    // Устанавливаем заголовки
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $headers .= "From: shop@example.com" . "\r\n"; // 📩 Измените на свой email

    // Отправка письма
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["status" => "success", "message" => "Заказ успешно отправлен!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Ошибка при отправке email."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Недопустимый метод запроса."]);
}
?>
