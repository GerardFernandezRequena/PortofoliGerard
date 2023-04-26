<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Variables Db
$servername = "localhost";
$username = "id17683801_gerardf";
$contra = "Daw202122---";
$database = "id17683801_test_db";
// Variables
$nomUsuari = isset($_POST['nom']) ? $_POST['nom'] : "";
$correuUsuari = isset($_POST['email']) ? $_POST['email'] : "";
$passUsuari = isset($_POST['pass']) ? $_POST['pass'] : "";

  // Crear Connexió
  $mysqli = new mysqli($servername,$username,$contra,$database);

  if(!$mysqli){
    echo "Error: Connexio amb BBDD";
    exit();
  }

  $sql = "SELECT mail FROM `usuaris` WHERE mail='".$correuUsuari."'";
  $result = $mysqli->query($sql);

  if(!$result){
    echo "Error: Connexio amb BBDD ".$mysqli->erno." - ".$mysqli->error;
  } else {
    // En caso que no allà registros
    if($result->num_rows == 0){

      $sql = "INSERT INTO `usuaris` (`id_usuari`, `nom`, `mail`, `passwd`, `estat`) VALUES (null,'".$nomUsuari."','".$correuUsuari."','".$passUsuari."','creacio')";
      $result = $mysqli->query($sql);

      $destinatari = $correuUsuari;
      $asunto = "Enviament de Dades del Portafoli Gerard Fernández";
      $mensaje = "T'enviem ".$nomUsuari." informació personal del Portafolio\n
                  El teu nom al Portafoli: ".$nomUsuari."\n
                  El teu Correu Electrònic al Portafoli: ".$correuUsuari."\n
                  La teva Contrasenya al Portafoli: ".$passUsuari." \n
                  Espera el correu de confirmació de l'Admin.\n";
      $header = "Enviat des del Portafoli de Gerard Fernández";

      mail($destinatari, $asunto, $mensaje, $header);

      if(!$result){
        echo "Error: Connexio amb BBDD ".$mysqli->erno." - ".$mysqli->error;
      } else {
        echo "<script>alert('Correu electrònic enviat!!!');</script>";
        echo "<script> setTimeout(\"location.href='index.html'\", 1000) </script>";
      }

    } else {
      echo "<script>alert('Correu electrònic erroni!!!');</script>";
      echo "<script> setTimeout(\"location.href='index.html'\", 1000) </script>";
    }
  }
?>