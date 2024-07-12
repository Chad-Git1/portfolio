<?php
session_start();

if (!isset($_SESSION['board'])) {
    $_SESSION['board'] = array_fill(0, 9, null);
    $_SESSION['gameActive'] = false;
    $_SESSION['currentPlayer'] = 'X';
}

echo json_encode([
    'board' => $_SESSION['board'],
    'gameActive' => $_SESSION['gameActive'],
    'currentPlayer' => $_SESSION['currentPlayer']
]);
?>
