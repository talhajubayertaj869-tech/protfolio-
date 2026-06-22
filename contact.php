<?php
$to_email = "hello@talhajubayer.dev";

header('Content-Type: text/plain; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method not allowed.";
    exit;
}

function clean($value) {
    return htmlspecialchars(strip_tags(trim($value ?? '')), ENT_QUOTES, 'UTF-8');
}

$name    = clean($_POST['name'] ?? '');
$email   = clean($_POST['email'] ?? '');
$subject = clean($_POST['subject'] ?? 'New message from portfolio site');
$message = clean($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo "Please fill in all required fields.";
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Please provide a valid email address.";
    exit;
}

$body = "You received a new message from your portfolio contact form.\n\n";
$body .= "Name: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Subject: {$subject}\n\n";
$body .= "Message:\n{$message}\n";

$headers = "From: {$name} <no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . ">\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = @mail($to_email, "[Portfolio] {$subject}", $body, $headers);

if ($sent) {
    http_response_code(200);
    echo "OK";
} else {
    http_response_code(500);
    echo "Sorry, the message could not be sent. Please try again later or email directly.";
}
