<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupération des données du formulaire
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);
    
    // Destinataire
    $to = "WinnerLuyeye1@gmail.com";
    
    // Sujet du mail
    $email_subject = "Contact Form Submission: $subject";
    
    // Corps du mail
    $email_body = "Nom: $name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Sujet: $subject\n";
    $email_body .= "Message:\n$message\n";
    
    // En-têtes du mail
    $headers = "From: $email";
    
    // Envoi de l'e-mail
    if (mail($to, $email_subject, $email_body, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
}
?>