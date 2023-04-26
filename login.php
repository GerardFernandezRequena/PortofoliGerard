<?php
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    // Variables
    $servername = "localhost";
    $username = "id17683801_gerardf";
    $contra = "Daw202122---";
    $database = "id17683801_test_db";
    $mail = isset($_POST["username"]) ? $_POST["username"] : "";
    $passwdUser = isset($_POST['passwd']) ? $_POST['passwd'] : "";

    if($mail == 'admin@admin.com' &&  $passwdUser == '1234'){
        echo "<script>alert('Benvingut administrador !!!');</script>";
        echo "<script> setTimeout(\"location.href='admin.php'\", 1000) </script>";
    } else {
         // Crear Connexió
        $mysqli = new mysqli($servername,$username,$contra,$database);

        if(!$mysqli){
            echo "Error: Connexio amb BBDD";
            exit();
        }

        $sql = "SELECT mail,passwd FROM usuaris WHERE mail='".$mail."' AND passwd='".$passwdUser."' AND estat='creat'";
        $result = $mysqli->query($sql);

        if(!$result){
            echo "Error: Connexio amb BBDD ".$mysqli->erno." - ".$mysqli->error;
        } else {

            if($result -> num_rows == 0){
                echo "<script>alert('Credencials Errònies!!!');</script>";
                echo "<script> setTimeout(\"location.href='index.html'\", 1000) </script>";
            }else{
                echo "<script>alert('Iniciat Sessió Correctament!!!');</script>";
                echo "<script> setTimeout(\"location.href='paginaPrincipal.html'\", 1000) </script>";
            }
        }
    }
?>