<?php
// Configuración de errores (solo en desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuración de la base de datos
$servername = "localhost";
$username = "id17683801_gerardf";
$contra = "Daw202122---";
$database = "id17683801_test_db";
$charset = "utf8mb4";

// Validar y sanitizar inputs
$mail = filter_input(INPUT_POST, "username", FILTER_SANITIZE_EMAIL);
$passwdUser = $_POST['passwd'] ?? '';

// Validaciones básicas
if (empty($mail) || empty($passwdUser)) {
    echo "<script>alert('Por favor, complete todos los campos');</script>";
    echo "<script>setTimeout(() => { location.href='index.html' }, 1000);</script>";
    exit();
}

// Verificar credenciales de administrador
if ($mail === 'admin@admin.com' && $passwdUser === '1234') {
    echo "<script>alert('Benvingut administrador !!!');</script>";
    echo "<script>setTimeout(() => { location.href='admin.php' }, 1000);</script>";
    exit();
}

// Conexión a la base de datos con manejo de errores
try {
    $mysqli = new mysqli($servername, $username, $contra, $database);

    if ($mysqli->connect_error) {
        throw new Exception("Error de conexión: " . $mysqli->connect_error);
    }

    // Configurar charset
    if (!$mysqli->set_charset($charset)) {
        throw new Exception("Error setting charset: " . $mysqli->error);
    }

    // Preparar consulta con statements para prevenir SQL injection
    $sql = "SELECT mail, passwd FROM usuaris WHERE mail = ? AND estat = 'creat'";
    $stmt = $mysqli->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error en la preparación: " . $mysqli->error);
    }

    $stmt->bind_param("s", $mail);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // Usuario no encontrado o estado incorrecto
        echo "<script>alert('Credencials Errònies!!!');</script>";
        echo "<script>setTimeout(() => { location.href='index.html' }, 1000);</script>";
    } else {
        $user = $result->fetch_assoc();

        // Verificar contraseña (considera usar password_verify() si las contraseñas están hasheadas)
        if ($passwdUser === $user['passwd']) {
            echo "<script>alert('Iniciat Sessió Correctament!!!');</script>";
            echo "<script>setTimeout(() => { location.href='paginaPrincipal.html' }, 1000);</script>";
        } else {
            echo "<script>alert('Credencials Errònies!!!');</script>";
            echo "<script>setTimeout(() => { location.href='index.html' }, 1000);</script>";
        }
    }

    $stmt->close();
    $mysqli->close();

} catch (Exception $e) {
    // Log del error (en producción) y mensaje genérico al usuario
    error_log("Error en login: " . $e->getMessage());
    echo "<script>alert('Error del sistema. Por favor, intente más tarde.');</script>";
    echo "<script>setTimeout(() => { location.href='index.html' }, 1000);</script>";
}
?>