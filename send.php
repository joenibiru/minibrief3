<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // récupère les données du formulaire
  $email = $_POST['email'];
  $message = $_POST['message'];

  // crée le contenu de l'e-mail
  $to = 'joe.dwwm2022@gmail.com';
  $subject = 'Nouveau message de ' . $name;

  // envoie l'e-mail
  if (mail($to, $subject, $body)) {
    echo 'Votre message a été envoyé avec succès.';
  } else {
    echo 'Une erreur est survenue lors de l\'envoi de votre message.';
  }
}
?>

