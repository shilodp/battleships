// Проверка, что корабль может быть установлен в выбранном месте
function checkAvailability(row, column, orientation, length, fieldArray) {
    switch (orientation) {
        case 'horizontal':
            if (column + length > 10) return false;
            for (i = -1; i <= length; i++) {
                if (fieldArray[row - 1] && fieldArray[row - 1][column + i])
                    return false;
                if (fieldArray[row][column + i]) return false;
                if (fieldArray[row + 1] && fieldArray[row + 1][column + i])
                    return false;
            }
            break;
        case 'vertical':
            if (row + length > 10) return false;
            for (i = -1; i <= length; i++) {
                if (fieldArray[row + i] && fieldArray[row + i][column - 1])
                    return false;
                if (fieldArray[row + i] && fieldArray[row + i][column])
                    return false;
                if (fieldArray[row + i] && fieldArray[row + i][column + 1])
                    return false;
            }
            break;
    }
    return true;
}

// Добавление корабля в соответствующий массив
// Отображение корабля на поле, при необходимости
function createShip(
    row,
    column,
    orientation,
    length,
    shipsArray,
    needToDraw = false,
    fieldCells
) {
    switch (orientation) {
        case 'horizontal':
            for (i = 0; i < length; i++) {
                shipsArray[row][column + i] = 1;
                if (needToDraw) {
                    let cell = fieldCells.filter(
                        '[data-row="' +
                            row +
                            '"][data-column="' +
                            (+column + i) +
                            '"]'
                    );
                    let additionalClass = ['ship', 'ship-horizontal'];
                    if (i === 0) {
                        additionalClass.push('ship-left');
                    }
                    if (i === length - 1) {
                        additionalClass.push('ship-right');
                    }
                    drawShipCell(cell, additionalClass);
                }
            }
            break;
        case 'vertical':
            for (i = 0; i < length; i++) {
                shipsArray[row + i][column] = 1;
                if (needToDraw) {
                    let cell = fieldCells.filter(
                        '[data-row="' +
                            (+row + i) +
                            '"][data-column="' +
                            column +
                            '"]'
                    );
                    let additionalClass = ['ship', 'ship-vertical'];
                    if (i === 0) {
                        additionalClass.push('ship-top');
                    }
                    if (i === length - 1) {
                        additionalClass.push('ship-bottom');
                    }
                    drawShipCell(cell, additionalClass);
                }
            }
            break;
    }
}

// Отображение корабля на поле
function drawShipCell(cell, additionalClass) {
    cell.addClass(additionalClass.join(' '));
}

// Получение случайного числа [min, max]
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Цикл с созданием кораблей нужной длинны в нужном количестве в случайных местах
function generateShip(array, length, amount, needToDraw, fieldCells) {
    let orientationArray = ['horizontal', 'vertical'];
    let needToPlace = true;
    let row, column, orientation;

    for (let i = 0; i < amount; i++) {
        needToPlace = true;
        do {
            row = random(0, 9);
            column = random(0, 9);
            orientation = orientationArray[random(0, 1)];
            if (checkAvailability(row, column, orientation, length, array)) {
                createShip(
                    row,
                    column,
                    orientation,
                    length,
                    array,
                    needToDraw,
                    fieldCells
                );
                needToPlace = false;
            }
        } while (needToPlace);
    }
}

// Заполнение массива вражеских кораблей
function generateEnemyShips() {
    // generateShip(enemyShips, 4, 1, true, $('#enemy-field .field-cell'));
    // generateShip(enemyShips, 3, 2, true, $('#enemy-field .field-cell'));
    // generateShip(enemyShips, 2, 3, true, $('#enemy-field .field-cell'));
    // generateShip(enemyShips, 1, 4, true, $('#enemy-field .field-cell'));
    generateShip(enemyShips, 4, 1, false);
    generateShip(enemyShips, 3, 2, false);
    generateShip(enemyShips, 2, 3, false);
    generateShip(enemyShips, 1, 4, false);
}
