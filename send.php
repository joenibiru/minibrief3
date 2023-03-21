<?php

if (isset($_POST['submit'])) {
    // récupère les données soumises par l'utilisateur
    $user_email = $_POST['email'];
    $user_message = $_POST['message'];

    // construire le contenu du message électronique
    $to = "lacoste_jonathan@orange.fr";
    $subject = "Nouveau message de $user_email";
    $message = "Un utilisateur a soumis un nouveau message :\n\n";
    $message .= "Email : $user_email\n";
    $message .= "Message : $user_message\n";

    // envoyer le courriel
    mail($to, $subject, $message);

    // afficher un message de confirmation à l'utilisateur
    echo "Merci d'avoir soumis votre message !";
}
?>
