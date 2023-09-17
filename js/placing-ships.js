// Глобальная переменная, для определения ориентации расставляемого корабля
let orientation = 'horizontal';

// Выбор корабля для установки на поле
function selectShipToPlace(event) {
    let shipRow = $(this);
    let amountLeft = shipRow.data('amount');
    let shipLength = shipRow.data('length');
    let fieldCells = $('#starting-screen .field-cell');

    if (amountLeft) {
        $('.ship-row.selected').removeClass('selected');
        shipRow.addClass('selected');
        setDraggableRow(event, shipLength);

        $('body').on('mousemove', followMouse);
        $('body').on('keyup', changeOrientation);
        fieldCells.on('click', fieldCellClicked);
    }
}

// Создание перетягиваемого визуально корабля
function setDraggableRow(event, shipLength) {
    let draggableRow = $('.ship-row.to-move');
    draggableRow.html('');
    for (i = 1; i <= shipLength; i++) {
        draggableRow.append('<div class="ship ship-horizontal"></div>');
    }
    draggableRow.find('div:first-child').addClass('ship-left');
    draggableRow.find('div:last-child').addClass('ship-right');
    draggableRow
        .addClass('active')
        .css('top', event.clientY - 15 + 'px')
        .css('left', event.clientX - 15 + 'px');
}

// Удаление перетягиваемого визуально корабля
function clearDraggableRow() {
    let draggableRow = $('.ship-row.to-move');
    draggableRow.html('');
    draggableRow.removeClass('active');
    draggableRow.css('transform', '').css('left', '').css('top', '');
    orientation = 'horizontal';
}

// Движение перетягиваемого визуально корабля вслед за курсором
function followMouse(event) {
    $('.ship-row.to-move')
        .css('top', event.clientY - 15 + 'px')
        .css('left', event.clientX - 15 + 'px');
}

// Поворот перетягиваемого визуально корабля при нажатии на пробел
function changeOrientation(event) {
    let draggableRow = $('.ship-row.to-move');
    if (event.key == ' ' || event.code == 'Space' || event.keyCode == 32) {
        if (orientation === 'horizontal') {
            orientation = 'vertical';
            draggableRow.css('transform', 'rotate(90deg)');
        } else {
            orientation = 'horizontal';
            draggableRow.css('transform', '');
        }
    }
}

// Попытка установить корабль на поле
function fieldCellClicked() {
    let cell = $(this);
    let cellRow = cell.data('row');
    let cellColumn = cell.data('column');
    let shipRow = $('.ship-row.selected');
    let amountLeft = shipRow.data('amount');
    let shipLength = shipRow.data('length');
    let fieldCells = $('#starting-screen .field-cell');
    if (
        checkAvailability(
            cellRow,
            cellColumn,
            orientation,
            shipLength,
            playerShips
        )
    ) {
        createShip(
            cellRow,
            cellColumn,
            orientation,
            shipLength,
            playerShips,
            true,
            $('#starting-screen .field-cell, #gamer-field .field-cell')
        );

        shipRow
            .data('amount', amountLeft - 1)
            .find('.counter')
            .text(amountLeft - 1);
        if (amountLeft - 1 === 0) {
            shipRow.removeClass('clickable');
        }

        fieldCells.off('click', fieldCellClicked);
        $('body').off('mousemove', followMouse);
        $('body').off('keyup', changeOrientation);

        clearDraggableRow();
    }
}

// Заполнение массива кораблей игрока, оставшимися значениями
function generatePlayerShips() {
    let shipRows = $('#starting-screen .ship-row.clickable');
    if (shipRows.length) {
        shipRows.each(function () {
            let shipRow = $(this);
            let shipLength = shipRow.data('length');
            let amountLeft = shipRow.data('amount');
            generateShip(
                playerShips,
                shipLength,
                amountLeft,
                true,
                $('#starting-screen .field-cell, #gamer-field .field-cell')
            );

            shipRow
                .data('amount', 0)
                .removeClass('clickable')
                .find('.counter')
                .text(0);
        });
    }
}

// Инициализация расстановки кораблей
$('#starting-screen .ships-field').on(
    'click',
    '.ship-row.clickable',
    selectShipToPlace
);

// Инициализация случайной расстановки кораблей
$('#place-random').on('click', generatePlayerShips);
