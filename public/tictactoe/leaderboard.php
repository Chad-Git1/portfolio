<?php
session_start();

// Initialize leaderboard
if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = [
        'wins' => 0,
        'losses' => 0,
        'ties' => 0,
    ];
}

// Handling the update requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = $_POST['result'];

    if ($result === 'win') {
        $_SESSION['leaderboard']['wins'] += 1;
    } elseif ($result === 'loss') {
        $_SESSION['leaderboard']['losses'] += 1;
    } elseif ($result === 'tie') {
        $_SESSION['leaderboard']['ties'] += 1;
    }
}

// Returning the leaderboard data
echo json_encode($_SESSION['leaderboard']);
?>
