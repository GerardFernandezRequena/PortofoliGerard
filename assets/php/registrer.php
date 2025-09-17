<?php
// Configuración de errores (solo para desarrollo)
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);
// En producción, estos deberían estar desactivados y los errores registrados en un archivo de log

// Iniciar sesión
session_start();

// Headers de seguridad
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff");

// Incluir configuración
require_once 'config.php';

// Función para redirigir con mensaje
function redirectWithMessage($url, $message, $type = 'error') {
    $_SESSION['flash_message'] = $message;
    $_SESSION['flash_type'] = $type;
    header("Location: $url");
    exit();
}

// Validar que la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirectWithMessage('../index.html', 'Método de solicitud no válido.');
}

// Validar token CSRF
if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    redirectWithMessage('../index.html', 'Solicitud no válida.');
}

// Validar y sanitizar entradas
$nomUsuari = filter_input(INPUT_POST, 'nom', FILTER_SANITIZE_STRING);
$correuUsuari = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
$passUsuari = $_POST['pass'] ?? '';
$passConfirm = $_POST['repass'] ?? '';

// Validaciones básicas
if (empty($nomUsuari) || empty($correuUsuari) || empty($passUsuari) || empty($passConfirm)) {
    redirectWithMessage('../index.html', 'Todos los campos son obligatorios.');
}

if (!filter_var($correuUsuari, FILTER_VALIDATE_EMAIL)) {
    redirectWithMessage('../index.html', 'El formato del correo electrónico no es válido.');
}

if (strlen($nomUsuari) < 2 || strlen($nomUsuari) > 50) {
    redirectWithMessage('../index.html', 'El nombre debe tener entre 2 y 50 caracteres.');
}

if ($passUsuari !== $passConfirm) {
    redirectWithMessage('../index.html', 'Las contraseñas no coinciden.');
}

// Validar fortaleza de la contraseña
if (strlen($passUsuari) < 8) {
    redirectWithMessage('../index.html', 'La contraseña debe tener al menos 8 caracteres.');
}

if (!preg_match('/[A-Z]/', $passUsuari)) {
    redirectWithMessage('../index.html', 'La contraseña debe contener al menos una letra mayúscula.');
}

if (!preg_match('/[a-z]/', $passUsuari)) {
    redirectWithMessage('../index.html', 'La contraseña debe contener al menos una letra minúscula.');
}

if (!preg_match('/[0-9]/', $passUsuari)) {
    redirectWithMessage('../index.html', 'La contraseña debe contener al menos un número.');
}

// Protección contra registro excesivo desde la misma IP
$ip = $_SERVER['REMOTE_ADDR'];
if (!isset($_SESSION['last_registration_attempt'])) {
    $_SESSION['last_registration_attempt'] = 0;
}

$timeSinceLastAttempt = time() - $_SESSION['last_registration_attempt'];
if ($timeSinceLastAttempt < 30) { // 30 segundos entre registros
    redirectWithMessage('../index.html', 'Por favor, espere antes de intentar registrarse nuevamente.');
}

$_SESSION['last_registration_attempt'] = time();

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
        redirectWithMessage('../index.html', 'Este correo electrónico ya está registrado.');
    }

    // Hash de la contraseña (nunca almacenar contraseñas en texto plano)
    $hashedPassword = password_hash($passUsuari, PASSWORD_DEFAULT);

    // Generar token de verificación
    $verificationToken = bin2hex(random_bytes(32));

    // Consulta preparada para insertar nuevo usuario
    $stmt = $mysqli->prepare("INSERT INTO usuaris (nom, mail, passwd, estat, verification_token) VALUES (?, ?, ?, 'pendent', ?)");
    $stmt->bind_param("ssss", $nomUsuari, $correuUsuari, $hashedPassword, $verificationToken);

    if (!$stmt->execute()) {
        throw new Exception("Error al registrar usuario: " . $stmt->error);
    }

    // Obtener el ID del usuario recién insertado
    $userId = $mysqli->insert_id;

    // Envío de correo electrónico de verificación
    $destinatario = $correuUsuari;
    $asunto = "Verifica tu cuenta - Portafolio de Gerard Fernández";

    $verificationLink = "https://tudominio.com/verify.php?token=$verificationToken&email=" . urlencode($correuUsuari);

    $mensaje = "Hola $nomUsuari,\n\n" .
               "Gracias por registrarte en el Portafolio de Gerard Fernández.\n\n" .
               "Para completar tu registro, por favor verifica tu cuenta haciendo clic en el siguiente enlace:\n" .
               "$verificationLink\n\n" .
               "Si no has solicitado este registro, por favor ignora este mensaje.\n\n" .
               "Saludos cordiales,\n" .
               "Equipo de Portafolio Gerard Fernández";

    $headers = "From: no-reply@portafoliogerard.com\r\n";
    $headers .= "Reply-To: no-reply@portafoliogerard.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (!mail($destinatario, $asunto, $mensaje, $headers)) {
        error_log("Error al enviar correo electrónico a $destinatario");
        // No redirigimos con error porque el usuario se registró correctamente
    }

    // Redirección con éxito
    redirectWithMessage('../index.html', 'Registro completado. Por favor, verifica tu correo electrónico para activar tu cuenta.', 'success');

} catch (Exception $e) {
    error_log($e->getMessage());
    redirectWithMessage('../index.html', 'Error interno del servidor. Por favor, inténtelo más tarde.');
} finally {
    // Cerrar conexiones
    if (isset($stmt)) $stmt->close();
    if (isset($mysqli)) $mysqli->close();
}
?>