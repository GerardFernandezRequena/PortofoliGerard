<?php
// Configuración de errores (solo en desarrollo)
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);
// En producción, registrar errores en un archivo de log en lugar de mostrarlos

// Iniciar sesión para mantener el estado del usuario
session_start();

// Headers de seguridad
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff");

// Incluir configuración de la base de datos
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

// Validar entradas
$mail = filter_input(INPUT_POST, 'username', FILTER_VALIDATE_EMAIL);
$passwdUser = $_POST['passwd'] ?? '';

if (!$mail || empty($passwdUser)) {
    redirectWithMessage('../index.html', 'Por favor, proporciona credenciales válidas.');
}

// Protección contra fuerza bruta
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['last_login_attempt'] = time();
}

// Bloquear después de 5 intentos fallidos durante 15 minutos
if ($_SESSION['login_attempts'] >= 5 && (time() - $_SESSION['last_login_attempt']) < 900) {
    redirectWithMessage('../index.html', 'Demasiados intentos fallidos. Por favor, espere 15 minutos antes de intentar nuevamente.');
}

// Credenciales de administrador (deberían estar en variables de entorno)
$adminEmail = getenv('ADMIN_EMAIL') ?: 'admin@admin.com';
$adminPassword = getenv('ADMIN_PASSWORD') ?: '1234';

// Verificar credenciales de administrador
if ($mail === $adminEmail && $passwdUser === $adminPassword) {
    // Restablecer contador de intentos en éxito
    unset($_SESSION['login_attempts']);
    unset($_SESSION['last_login_attempt']);

    $_SESSION['user'] = ['email' => $mail, 'role' => 'admin'];
    redirectWithMessage('admin.php', '¡Bienvenido administrador!', 'success');
}

// Conexión a la base de datos con manejo de errores
try {
    $mysqli = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

    if ($mysqli->connect_error) {
        throw new Exception("Error de conexión: " . $mysqli->connect_error);
    }

    // Consulta preparada para prevenir inyecciones SQL
    $sql = "SELECT id, mail, passwd, nom, estat FROM usuaris WHERE mail = ? AND estat = 'creat'";
    $stmt = $mysqli->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error en la preparación de la consulta: " . $mysqli->error);
    }

    $stmt->bind_param("s", $mail);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // Incrementar contador de intentos fallidos
        $_SESSION['login_attempts']++;
        $_SESSION['last_login_attempt'] = time();

        // Mensaje genérico para evitar fuga de información
        redirectWithMessage('../index.html', 'Credenciales incorrectas o usuario no activo.');
    }

    $user = $result->fetch_assoc();

    // Verificar contraseña (asumiendo que ahora están hasheadas)
    if (password_verify($passwdUser, $user['passwd'])) {
        // Restablecer contador de intentos en éxito
        unset($_SESSION['login_attempts']);
        unset($_SESSION['last_login_attempt']);

        // Regenerar ID de sesión después de login exitoso
        session_regenerate_id(true);

        // Establecer datos de sesión
        $_SESSION['user'] = [
            'id' => $user['id'],
            'email' => $user['mail'],
            'name' => $user['nom'],
            'role' => 'user'
        ];

        redirectWithMessage('paginaPrincipal.php', '¡Sesión iniciada correctamente!', 'success');
    } else {
        // Incrementar contador de intentos fallidos
        $_SESSION['login_attempts']++;
        $_SESSION['last_login_attempt'] = time();

        redirectWithMessage('../index.html', 'Credenciales incorrectas.');
    }

    $stmt->close();
    $mysqli->close();

} catch (Exception $e) {
    // En producción, registrar el error en un archivo de log
    error_log('Error de login: ' . $e->getMessage());
    redirectWithMessage('../index.html', 'Error interno del servidor. Por favor, inténtelo más tarde.');
}