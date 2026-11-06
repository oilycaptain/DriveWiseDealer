<?php
session_start();
include 'config.php';

$email = $_POST['email'];
$password = $_POST['password'];

// SQL to check if the email exists
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    // Verify password
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        header("Location: welcome.php"); // Redirect to a welcome page
    } else {
        echo "Invalid password!";
    }
} else {
    echo "User does not exist!";
}
?>
