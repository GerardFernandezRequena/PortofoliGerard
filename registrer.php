<?php
// Configuración de errores (solo para desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuración de la base de datos
define('DB_HOST', 'localhost');
define('DB_USER', 'id17683801_gerardf');
define('DB_PASS', 'Daw202122---');
define('DB_NAME', 'id17683801_test_db');

// Validar y sanitizar entradas
$nomUsuari = filter_input(INPUT_POST, 'nom', FILTER_SANITIZE_STRING);
$correuUsuari = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$passUsuari = filter_input(INPUT_POST, 'pass', FILTER_SANITIZE_STRING);

// Validaciones básicas
if (empty($nomUsuari) || empty($correuUsuari) || empty($passUsuari)) {
    die("Todos los campos son obligatorios");
}

if (!filter_var($correuUsuari, FILTER_VALIDATE_EMAIL)) {
    die("El formato del correo electrónico no es válido");
}

try {
    // Crear conexión con MySQLi (modo orientado a objetos)
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Verificar conexión
    if ($mysqli->connect_error) {
        throw new Exception("Error de conexión: " . $mysqli->connect_error);
    }

    // Consulta preparada para verificar si el correo existe
    $stmt = $mysqli->prepare("SELECT mail FROM usuaris WHERE mail = ?");
    $stmt->bind_param("s", $correuUsuari);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // Correo ya existe
        header("Location: index.html?error=email_exists");
        exit();
    }

    // Hash de la contraseña (nunca almacenar contraseñas en texto plano)
    $hashedPassword = password_hash($passUsuari, PASSWORD_DEFAULT);

    // Consulta preparada para insertar nuevo usuario
    $stmt = $mysqli->prepare("INSERT INTO usuaris (nom, mail, passwd, estat) VALUES (?, ?, ?, 'creacio')");
    $stmt->bind_param("sss", $nomUsuari, $correuUsuari, $hashedPassword);

    if (!$stmt->execute()) {
        throw new Exception("Error al registrar usuario: " . $stmt->error);
    }

    // Envío de correo electrónico
    $destinatario = $correuUsuari;
    $asunto = "Registro en el Portafolio de Gerard Fernández";
    $mensaje = "Gracias por registrarte, $nomUsuari.\n\n" .
               "Tus datos de registro son:\n" .
               "Nombre: $nomUsuari\n" .
               "Correo Electrónico: $correuUsuari\n\n" .
               "Por seguridad, nunca compartas tu contraseña.\n" .
               "Espera el correo de confirmación del administrador.\n";
    $headers = "From: no-reply@portafoliogerard.com\r\n";
    $headers .= "Reply-To: no-reply@portafoliogerard.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (!mail($destinatario, $asunto, $mensaje, $headers)) {
        error_log("Error al enviar correo electrónico a $destinatario");
    }

    // Redirección con éxito
    header("Location: index.html?success=registered");
    exit();

} catch (Exception $e) {
    error_log($e->getMessage());
    header("Location: index.html?error=database_error");
    exit();
} finally {
    // Cerrar conexiones
    if (isset($stmt)) $stmt->close();
    if (isset($mysqli)) $mysqli->close();
}
?>