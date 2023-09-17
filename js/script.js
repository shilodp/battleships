// Перезапуск игры
function startNewGame() {
    location.reload();
}

// Запуск игры, когда корабли расставлены
function startGame() {
    if ($('#starting-screen .ship-row.clickable').length) {
        alert('Не все корабли было размещены на поле');
    } else {
        $('body').addClass('game');
        generateEnemyShips();
    }
}

// Инициализация игры (Добавление обработчиков событий)
$('#new-game').on('click', startNewGame);
$('#start-game').on('click', startGame);
