<?php
 ini_set('display_errors', 1);
 ini_set('display_startup_errors', 1);
 error_reporting(E_ALL);
 // Variables
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

    $sql = "SELECT * FROM usuaris WHERE estat='creacio'";
    $result = $mysqli->query($sql);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.min.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.5.1.js"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
    <script src="admin.js"></script>
    <title>Document</title>
</head>

<body>
    <nav class="navbar navbar-light bg-light fixed-top">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Panell d'administració d'usuaris</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Opcions</h5>
                    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li class="nav-item">
                            <a class="nav-link active" href="/">Home</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/">Link</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="offcanvasNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="index.html">Sortir</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
    <div class="container" style="border:3px solid black;margin-top: 5%;margin-bottom: 5%;padding: 1%;">
        <table id="example" class="display" style="width:100%;">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Correu Electrònic</th>
                    <th>Contrasenya</th>
                    <th>Operacions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                    if(!$result){
                        echo "Error: Connexio amb BBDD ".$mysqli->erno." - ".$mysqli->error;
                    } else {
                        // En caso que no allà registros
                        if($result -> num_rows == 0){
                            echo "<tr>";
                            echo "<td>No hi ha usuaris en creació</td>";
                            echo "</tr>";
                        } else {
                            while($row = $result->fetch_array()){
                                $id = $row['id_usuari'];
                                $nom = $row['nom'];
                                $correo = $row['mail'];
                                echo "<tr>";
                                    echo "<td>".$row['id_usuari']."</td>";
                                    echo "<td>".$row['nom']."</td>";
                                    echo "<td>".$row['mail']."</td>";
                                    echo "<td>".$row['passwd']."</td>";
                                    echo "<td><form action='afegirUsuari.php' method='post'>";
                                    echo "<input type='submit' class='btn btn-success' value='Afegir'/>";
                                    echo "<input type='hidden' value='".$id."' name='idUsuari'>";
                                    echo "<input type='hidden' value='".$nom."' name='nomUsuari'>";
                                    echo "<input type='hidden' value='".$correo."' name='correoUsuari'>";
                                    echo "</form></td>";

                                echo "</tr>";
                            }
                        }
                    }
                ?>
            </tbody>
        </table>
    </div>
</body>
</html>