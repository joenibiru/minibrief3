<?php
<<<<<<< HEAD

/* var_dump($_POST); */

    $data = array(
        "mail" => "joe.dwwm2022@gmail.com",// votre adresse mail
        "objet" => $_POST["objet"] ,// sujet du message sous le format : « NOM , DATE(JJ/MM) : [OBJET] »
        "message" =>$_POST["message"]  ,// contenu du message
        "isHTML" => 'true');
           

/* var_dump($data); */

$ch = curl_init();


curl_setopt($ch, CURLOPT_URL, "https://script.google.com/macros/s/AKfycbyAdBquoDhoL7jin4KcEDhkMv58PUVvC_o3N0MDHJsLDYDQlLyT0S_9o-lfbIOGP0vD8g/exec");
curl_setopt($ch, CURLOPT_HEADER, 0);


curl_exec($ch);


=======
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
>>>>>>> ca69528904b176662ac0459384c16023aaa612f0
curl_close($ch);   
?>
