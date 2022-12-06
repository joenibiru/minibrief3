<?php

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


curl_close($ch);   
?>
