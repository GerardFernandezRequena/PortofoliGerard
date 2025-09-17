<?php
// Configuración de errores (solo en desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Validar y sanitizar inputs
$idUser = filter_input(INPUT_POST, 'idUsuari', FILTER_VALIDATE_INT);
$nomUsuari = filter_input(INPUT_POST, 'nomUsuari', FILTER_SANITIZE_STRING);
$correuUsuari = filter_input(INPUT_POST, 'correoUsuari', FILTER_SANITIZE_EMAIL);

// Validaciones
if (!$idUser || empty($nomUsuari) || !filter_var($correuUsuari, FILTER_VALIDATE_EMAIL)) {
    echo "<script>alert('Datos de entrada inválidos');</script>";
    echo "<script>setTimeout(() => { location.href='admin.php' }, 1000);</script>";
    exit();
}

// Configuración de la base de datos
$servername = "localhost";
$username = "id17683801_gerardf";
$contra = "Daw202122---";
$database = "id17683801_test_db";
$charset = "utf8mb4";

try {
    // Crear Conexión con manejo de errores
    $mysqli = new mysqli($servername, $username, $contra, $database);

    if ($mysqli->connect_error) {
        throw new Exception("Error de conexión: " . $mysqli->connect_error);
    }

    // Configurar charset
    if (!$mysqli->set_charset($charset)) {
        throw new Exception("Error setting charset: " . $mysqli->error);
    }

    // Preparar consulta con statement para prevenir SQL injection
    $sql = "UPDATE `usuaris` SET `estat` = 'creat' WHERE id_usuari = ?";
    $stmt = $mysqli->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error en la preparación: " . $mysqli->error);
    }

    $stmt->bind_param("i", $idUser);
    $result = $stmt->execute();

    if (!$result) {
        throw new Exception("Error en la actualización: " . $stmt->error);
    }

    // Verificar si se actualizó alguna fila
    if ($stmt->affected_rows === 0) {
        echo "<script>alert('No se encontró el usuario o ya estaba activado');</script>";
    } else {
        // Configurar email
        $destinatari = $correuUsuari;
        $asunto = "Confirmació del Portafoli Gerard Fernández";
        $mensaje = "Ya pots entrar " . htmlspecialchars($nomUsuari) . " al Portafoli Gerard Fernández.";
        $header = "From: no-reply@tu-dominio.com\r\n";
        $header .= "Reply-To: no-reply@tu-dominio.com\r\n";
        $header .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $header .= "X-Mailer: PHP/" . phpversion();

        // Intentar enviar email
        if (mail($destinatari, $asunto, $mensaje, $header)) {
            echo "<script>alert('Usuari Afegit i email enviat!!!');</script>";
        } else {
            echo "<script>alert('Usuari Afegit pero error enviant email!!!');</script>";
        }
    }

    $stmt->close();
    $mysqli->close();

    // Redirección
    echo "<script>setTimeout(() => { location.href='admin.php' }, 1000);</script>";

} catch (Exception $e) {
    // Log del error (en producción) y mensaje genérico al usuario
    error_log("Error en actualización de usuario: " . $e->getMessage());
    echo "<script>alert('Error del sistema. Por favor, intente más tarde.');</script>";
    echo "<script>setTimeout(() => { location.href='admin.php' }, 1000);</script>";
}
?>