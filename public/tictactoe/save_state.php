<?php
session_start();

$data = json_decode(file_get_contents('php://input'), true);
$_SESSION['board'] = $data['board'];
$_SESSION['gameActive'] = $data['gameActive'];
$_SESSION['currentPlayer'] = $data['currentPlayer'];

echo json_encode(['status' => 'success']);
?>
