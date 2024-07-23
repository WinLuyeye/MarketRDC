<?php
session_start();

// Génération du token CSRF pour le formulaire
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrf_token = $_SESSION['csrf_token'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validation CSRF
    if (empty($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        echo json_encode(['message' => 'Erreur CSRF.']);
        exit;
    }

    // Validation des champs
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    if (!$name || !$email || !$message) {
        echo json_encode(['message' => 'Veuillez remplir tous les champs obligatoires.']);
        exit;
    }

    // Envoi de l'email
    $to = 'winnerluyeye1@gmail.com'; // Remplacez par votre adresse email
    $subject = 'Message de ' . $name . ': ' . $subject;
    $body = "Nom: $name\nEmail: $email\nSujet: $subject\nMessage:\n$message";
    $headers = "From: $email\r\nReply-To: $email\r\n";

    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(['message' => 'Votre message a été envoyé avec succès.']);
    } else {
        echo json_encode(['message' => 'Une erreur est survenue lors de l\'envoi de votre message.']);
    }
}
?>
