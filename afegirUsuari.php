<?php

$idUser = isset($_POST['idUsuari']) ? $_POST['idUsuari']: "";
$nomUsuari = isset($_POST['nomUsuari']) ? $_POST['nomUsuari']: "";
$correuUsuari = isset($_POST['correoUsuari']) ? $_POST['correoUsuari']: "";

$servername = "localhost";
$username = "id17683801_gerardf";
$contra = "Daw202122---";
$database = "id17683801_test_db";

// Crear Connexió
$mysqli = new mysqli($servername,$username,$contra,$database);

if(!$mysqli){
    echo "Error: Connexio amb BBDD";
    exit();
}

$sql = "UPDATE `usuaris` SET `estat`='creat' WHERE id_usuari=$idUser";
$result = $mysqli->query($sql);

if(!$result){
    echo "Error: Connexio amb BBDD ".$mysqli->erno." - ".$mysqli->error;
}

$destinatari = $correuUsuari;
$asunto = "Confirmació del Portafoli Gerard Fernández";
$mensaje = "Ya pots entrar ".$nomUsuari." al Portafoli Gerard Fernández.";
$header = "Enviat des del Portafoli de Gerard Fernández";

mail($destinatari, $asunto, $mensaje, $header);

echo "<script>alert('Usuari Afegit!!!');</script>";
echo "<script> setTimeout(\"location.href='admin.php'\", 1000) </script>";

?>