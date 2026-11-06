<?php
include 'config.php';

$email = $_POST['email'];
$password = $_POST['password'];
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// SQL to insert new user
$sql = "INSERT INTO users (email, password) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $hashed_password);
if ($stmt->execute()) {
    echo "User registered successfully!";
    // Optionally redirect to login page or somewhere else
} else {
    echo "Error: " . $stmt->error;
}
?>
