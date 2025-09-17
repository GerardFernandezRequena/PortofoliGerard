<?php
// Configuración de errores (solo en desarrollo)
ini_set('display_errors', 0); // Desactivar en producción
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/logs/error.log');
error_reporting(E_ALL);

// Configuración de seguridad de sesiones
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1); // Asegurar que estás usando HTTPS
ini_set('session.use_strict_mode', 1);

// Iniciar sesión
session_start();

// Regenerar ID de sesión para prevenir fixation attacks
if (!isset($_SESSION['initiated'])) {
    session_regenerate_id(true);
    $_SESSION['initiated'] = true;
}

// Headers de seguridad
header("X-Frame-Options: DENY");
header("X-Content-Type-Options: nosniff");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: strict-origin-when-cross-origin");

// Configuración de la base de datos
$servername = "localhost";
$username = "id17683801_gerardf";
$contra = "Daw202122---";
$database = "id17683801_test_db";
$charset = "utf8mb4";

// Validar que la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Método no permitido');
}

// Validar y sanitizar inputs
$mail = filter_input(INPUT_POST, "username", FILTER_SANITIZE_EMAIL);
$passwdUser = $_POST['passwd'] ?? '';

// Validaciones básicas
if (empty($mail) || empty($passwdUser)) {
    respondWithError('Por favor, complete todos los campos');
}

// Validar formato de email
if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
    respondWithError('El formato del email no es válido');
}

// Verificar credenciales de administrador
if ($mail === 'admin@admin.com') {
    // IMPORTANTE: Debes cambiar esta contraseña y usar hash en producción
    $adminHash = password_hash('1234', PASSWORD_DEFAULT); // Cambia esto en producción
    
    if (password_verify($passwdUser, $adminHash)) {
        $_SESSION['user_id'] = 'admin';
        $_SESSION['user_role'] = 'admin';
        $_SESSION['logged_in'] = true;
        $_SESSION['last_activity'] = time();
        
        respondWithSuccess('Benvingut administrador !!!', 'admin.php');
    } else {
        logFailedAttempt($mail, null);
        respondWithError('Credenciales incorrectas');
    }
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
    $sql = "SELECT id, mail, passwd, intentos_login, bloqueado_hasta FROM usuaris WHERE mail = ? AND estat = 'creat'";
    $stmt = $mysqli->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error en la preparación: " . $mysqli->error);
    }

    $stmt->bind_param("s", $mail);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // Usuario no encontrado o estado incorrecto
        logFailedAttempt($mail, $mysqli);
        respondWithError('Credenciales incorrectas o cuenta no activa');
    } else {
        $user = $result->fetch_assoc();

        // Verificar si la cuenta está temporalmente bloqueada
        if (!empty($user['bloqueado_hasta']) && strtotime($user['bloqueado_hasta']) > time()) {
            $tiempo_restante = strtotime($user['bloqueado_hasta']) - time();
            respondWithError('Cuenta temporalmente bloqueada. Intente nuevamente en ' . ceil($tiempo_restante/60) . ' minutos.');
        }

        // Verificar contraseña con password_verify()
        if (password_verify($passwdUser, $user['passwd'])) {
            // Login exitoso - resetear intentos fallidos
            $updateSql = "UPDATE usuaris SET intentos_login = 0, bloqueado_hasta = NULL WHERE id = ?";
            $updateStmt = $mysqli->prepare($updateSql);
            $updateStmt->bind_param("i", $user['id']);
            $updateStmt->execute();
            $updateStmt->close();

            // Establecer variables de sesión
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_email'] = $user['mail'];
            $_SESSION['user_role'] = 'user';
            $_SESSION['logged_in'] = true;
            $_SESSION['last_activity'] = time();

            // Regenerar ID de sesión para prevenir fixation attacks
            session_regenerate_id(true);

            respondWithSuccess('Sessió iniciada correctament!!!', 'paginaPrincipal.html');
        } else {
            // Incrementar intentos fallidos
            $intentos = $user['intentos_login'] + 1;
            $bloqueado_hasta = null;

            // Bloquear cuenta después de 3 intentos fallidos por 15 minutos
            if ($intentos >= 3) {
                $bloqueado_hasta = date('Y-m-d H:i:s', time() + 900); // 15 minutos
            }

            $updateSql = "UPDATE usuaris SET intentos_login = ?, bloqueado_hasta = ? WHERE id = ?";
            $updateStmt = $mysqli->prepare($updateSql);
            $updateStmt->bind_param("isi", $intentos, $bloqueado_hasta, $user['id']);
            $updateStmt->execute();
            $updateStmt->close();

            logFailedAttempt($mail, $mysqli);

            if ($intentos >= 3) {
                respondWithError('Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.');
            } else {
                respondWithError('Credenciales incorrectas. Le quedan ' . (3 - $intentos) . ' intentos.');
            }
        }
    }

    $stmt->close();
    $mysqli->close();

} catch (Exception $e) {
    // Log del error (en producción) y mensaje genérico al usuario
    error_log("Error en login: " . $e->getMessage());
    respondWithError('Error del sistema. Por favor, intente más tarde.');
}

/**
 * Función para responder con error
 */
function respondWithError($message) {
    echo "<script>alert('" . addslashes(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . "');</script>";
    echo "<script>setTimeout(() => { location.href='index.html' }, 1000);</script>";
    exit();
}

/**
 * Función para responder con éxito
 */
function respondWithSuccess($message, $redirect) {
    echo "<script>alert('" . addslashes(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . "');</script>";
    echo "<script>setTimeout(() => { location.href='" . htmlspecialchars($redirect, ENT_QUOTES, 'UTF-8') . "' }, 1000);</script>";
    exit();
}

/**
 * Registrar intento fallido
 */
function logFailedAttempt($email, $mysqli) {
    $sql = "INSERT INTO login_attempts (email, attempt_time, ip_address, user_agent) VALUES (?, NOW(), ?, ?)";
    $stmt = $mysqli->prepare($sql);
    $ip = $_SERVER['REMOTE_ADDR'];
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Desconocido';
    $stmt->bind_param("sss", $email, $ip, $user_agent);
    $stmt->execute();
    $stmt->close();
}
?>