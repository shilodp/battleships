let isEnemyTurn = false;

function hitHandler(event) {
    if (!isEnemyTurn) {
        let cell = $(this);
        let row = cell.data('row');
        let column = cell.data('column');
        hitCell(row, column, enemyShips);
    }
}

function hitCell(row, column, targetArray) {
    switch (targetArray[row][column]) {
        case 0:
            targetArray[row][column] = 2;
            updateField();
            isEnemyTurn = !isEnemyTurn;
            $('body').toggleClass('enemy-turn');
            break;
        case 1:
            targetArray[row][column] = 3;
            if (targetArray[row - 1]) {
                if (targetArray[row - 1][column - 1] === 0) {
                    targetArray[row - 1][column - 1] = 2;
                }
                if (targetArray[row - 1][column + 1] === 0) {
                    targetArray[row - 1][column + 1] = 2;
                }
            }
            if (targetArray[row + 1]) {
                if (targetArray[row + 1][column - 1] === 0) {
                    targetArray[row + 1][column - 1] = 2;
                }
                if (targetArray[row + 1][column + 1] === 0) {
                    targetArray[row + 1][column + 1] = 2;
                }
            }
            checkAround(row, column, targetArray);
            updateField();
            checkResults();
            break;
    }
    enemyTurn();
}

function enemyTurn() {
    if (isEnemyTurn) {
        row = random(0, 9);
        column = random(0, 9);
        if (playerShips[row][column] === 0 || playerShips[row][column] === 1) {
            setTimeout(() => {
                hitCell(row, column, playerShips);
            }, 1000);
        } else {
            enemyTurn();
        }
    }
}

function checkAround(row, column, targetArray) {
    let result = checkSides(row, column, targetArray);
    if (result === 'dead') {
        let shipLength = markDeadArea(row, column, targetArray);
        decreaseShipsAmount(shipLength);
    }
}

function checkSides(row, column, targetArray, direction = null) {
    let result = 'dead';
    if (direction === 'top' || direction === null) {
        if (targetArray[row - 1] && targetArray[row - 1][column]) {
            if (targetArray[row - 1][column] === 3) {
                result =
                    result === 'hit'
                        ? 'hit'
                        : checkSides(row - 1, column, targetArray, 'top');
            } else if (targetArray[row - 1][column] === 1) {
                result = 'hit';
            }
        }
    }
    if (direction === 'right' || direction === null) {
        if (targetArray[row][column + 1]) {
            if (targetArray[row][column + 1] === 3) {
                result =
                    result === 'hit'
                        ? 'hit'
                        : checkSides(row, column + 1, targetArray, 'right');
            } else if (targetArray[row][column + 1] === 1) {
                result = 'hit';
            }
        }
    }
    if (direction === 'bottom' || direction === null) {
        if (targetArray[row + 1] && targetArray[row + 1][column]) {
            if (targetArray[row + 1][column] === 3) {
                result =
                    result === 'hit'
                        ? 'hit'
                        : checkSides(row + 1, column, targetArray, 'bottom');
            } else if (targetArray[row + 1][column] === 1) {
                result = 'hit';
            }
        }
    }
    if (direction === 'left' || direction === null) {
        if (targetArray[row][column - 1]) {
            if (targetArray[row][column - 1] === 3) {
                result =
                    result === 'hit'
                        ? 'hit'
                        : checkSides(row, column - 1, targetArray, 'left');
            } else if (targetArray[row][column - 1] === 1) {
                result = 'hit';
            }
        }
    }
    return result;
}

function markDeadArea(row, column, targetArray, direction = null) {
    let shipLength = 1;
    targetArray[row][column] = 4;
    if (targetArray[row - 1] && targetArray[row - 1][column - 1] === 0) {
        targetArray[row - 1][column - 1] = 2;
    }
    if (targetArray[row - 1] && targetArray[row - 1][column] === 0) {
        targetArray[row - 1][column] = 2;
    }
    if (
        targetArray[row - 1] &&
        targetArray[row - 1][column] === 3 &&
        direction !== 'bottom'
    ) {
        shipLength += markDeadArea(row - 1, column, targetArray, 'top');
    }
    if (targetArray[row - 1] && targetArray[row - 1][column + 1] === 0) {
        targetArray[row - 1][column + 1] = 2;
    }
    if (targetArray[row][column - 1] === 0) {
        targetArray[row][column - 1] = 2;
    }
    if (targetArray[row][column - 1] === 3 && direction !== 'right') {
        shipLength += markDeadArea(row, column - 1, targetArray, 'left');
    }
    if (targetArray[row][column + 1] === 0) {
        targetArray[row][column + 1] = 2;
    }
    if (targetArray[row][column + 1] === 3 && direction !== 'left') {
        shipLength += markDeadArea(row, column + 1, targetArray, 'right');
    }
    if (targetArray[row + 1] && targetArray[row + 1][column - 1] === 0) {
        targetArray[row + 1][column - 1] = 2;
    }
    if (targetArray[row + 1] && targetArray[row + 1][column] === 0) {
        targetArray[row + 1][column] = 2;
    }
    if (
        targetArray[row + 1] &&
        targetArray[row + 1][column] === 3 &&
        direction !== 'top'
    ) {
        shipLength += markDeadArea(row + 1, column, targetArray, 'bottom');
    }
    if (targetArray[row + 1] && targetArray[row + 1][column + 1] === 0) {
        targetArray[row + 1][column + 1] = 2;
    }
    return shipLength;
}

function updateField() {
    let fieldCells, targetArray;
    if (!isEnemyTurn) {
        fieldCells = $('#enemy-field .field-cell');
        targetArray = enemyShips;
    } else {
        fieldCells = $('#gamer-field .field-cell');
        targetArray = playerShips;
    }
    for (let x = 0; x < targetArray.length; x++) {
        for (let y = 0; y < targetArray[x].length; y++) {
            let cell;
            switch (targetArray[x][y]) {
                case 2:
                    cell = fieldCells.filter(
                        '[data-row="' + x + '"][data-column="' + y + '"]'
                    );
                    cell.addClass('blocked');
                    break;
                case 3:
                    cell = fieldCells.filter(
                        '[data-row="' + x + '"][data-column="' + y + '"]'
                    );
                    cell.addClass(' ship blocked hit');
                    break;
                case 4:
                    cell = fieldCells.filter(
                        '[data-row="' + x + '"][data-column="' + y + '"]'
                    );
                    cell.addClass('ship blocked dead');

                    if (
                        ((targetArray[x - 1] && targetArray[x - 1][y] === 2) ||
                            !targetArray[x - 1]) &&
                        targetArray[x][y - 1] !== 4 &&
                        targetArray[x][y + 1] !== 4
                    ) {
                        cell.addClass('ship-top');
                    }

                    if (
                        targetArray[x][y + 1] !== 4 &&
                        (targetArray[x - 1]
                            ? targetArray[x - 1][y] !== 4
                            : true) &&
                        (targetArray[x + 1]
                            ? targetArray[x + 1][y] !== 4
                            : true)
                    ) {
                        cell.addClass('ship-right');
                    }

                    if (
                        ((targetArray[x + 1] && targetArray[x + 1][y] !== 4) ||
                            !targetArray[x + 1]) &&
                        targetArray[x][y - 1] !== 4 &&
                        targetArray[x][y + 1] !== 4
                    ) {
                        cell.addClass('ship-bottom');
                    }

                    if (
                        targetArray[x][y - 1] !== 4 &&
                        (targetArray[x - 1]
                            ? targetArray[x - 1][y] !== 4
                            : true) &&
                        (targetArray[x + 1]
                            ? targetArray[x + 1][y] !== 4
                            : true)
                    ) {
                        cell.addClass('ship-left');
                    }
                    break;
            }
        }
    }
}

function decreaseShipsAmount(length) {
    let counter = $(
        '#game-screen .ship-row[data-length=' + length + '] .counter'
    );
    if (!isEnemyTurn) {
        counter.text(counter.text() - 1);
    }
}

function checkResults() {
    let result;
    if (!isEnemyTurn) {
        for (let i = 0; i < enemyShips.length; i++) {
            if (enemyShips[i].includes(1)) {
                result = 'continue';
            }
        }
        if (!result) {
            setTimeout(() => {
                alert('Победа!');
            }, 1000);
            $('#enemy-field').off(
                'click',
                '.field-cell:not(.blocked)',
                hitHandler
            );
        }
    } else {
        for (let i = 0; i < playerShips.length; i++) {
            if (playerShips[i].includes(1)) {
                result = 'continue';
            }
        }
        if (!result) {
            setTimeout(() => {
                alert('Поражение!');
            }, 1000);
            isEnemyTurn = !isEnemyTurn;
            $('#enemy-field').off(
                'click',
                '.field-cell:not(.blocked)',
                hitHandler
            );
        }
    }
}

$('#enemy-field').on('click', '.field-cell:not(.blocked)', hitHandler);
