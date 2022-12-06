<?php
    $data = array(
        "mail" => joe.dwwm2022@gmail.com // votre adresse mail
        "objet" => devis // sujet du message sous le format : « NOM , DATE(JJ/MM) : [OBJET] »
        "message" => … // contenu du message
        "isHTML" => 'true');
           
//on envoie le message avec la fonction mail  
// initialisation de la session
$ch = curl_init();

// configuration des options
curl_setopt($ch, CURLOPT_URL, "https://script.google.com/macros/s/AKfycbyAdBquoDhoL7jin4KcEDhkMv58PUVvC_o3N0MDHJsLDYDQlLyT0S_9o-lfbIOGP0vD8g/exec");
curl_setopt($ch, CURLOPT_HEADER, 0);

// exécution de la session
curl_exec($ch);

// fermeture des ressources
curl_close($ch);   
?>
