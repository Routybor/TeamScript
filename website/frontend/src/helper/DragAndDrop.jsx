import React, { useEffect, useRef, useState, memo } from 'react';


function throttle(func, limit) {
    let inThrottle
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => (inThrottle = false), limit)
        }
    }
}


const DragAndDrop = (tasks, changeStateFunc, changePriorityFunc, setUpdateTasksFunc) => {
    const [currentCard, setCurrentCard] = useState();
    const [currentColumn, setCurrentColumn] = useState();
    const [activeCard, setActiveCard] = useState();
    const [cards, setCards] = useState();
    let s1;
    let s2;
    let isEnd;
    let crossedCeneter;
    const currentCardRef = useRef(currentCard);
    const currentColumnRef = useRef(currentColumn);
    const activeCardRef = useRef(activeCard);
    const cardsRef = useRef(cards);
    let tasksListElement = document.querySelector('.tasklist');
    const blankCanvas = document.createElement('canvas');
    const projectToken = localStorage.getItem('project');


    const handleDragStart = (evt) => {
        evt.target.classList.add(`selected`);
        evt.dataTransfer.setDragImage(blankCanvas, 0, 0);
    }

    const handleDragStop = (evt) => {
        if (s1) {
            console.log("s1");
            changeCardPlace(isEnd);
        }
        if (s2) {
            console.log("s2");
            const currentState = currentColumn.childNodes[0].childNodes[0].childNodes[0].innerText;
            const activeElementId = activeCard.getAttribute('id');
            changeStateFunc(activeElementId, currentState);
            changePriorityFunc(activeElementId, 1000, projectToken);
        }

        evt.target.classList.remove(`selected`);
    }


    const handleDragOver = (evt) => {
        evt.preventDefault();

        const activeElement = tasksListElement.querySelector(`.selected`);
        activeCardRef.current = activeElement;
        setActiveCard(activeElement);
        // console.log(activeCard);
        s1 = false;
        s2 = false;
        isEnd = false;
        crossedCeneter = false;

        if (activeCard === undefined) {
            return;
        }

        let curEl = evt.target;
        let flCard = false;
        let flColumn = false;
        const ans1 = defineElemByName(curEl, 'card');
        const ans2 = defineElemByName(curEl, 'column');
        flCard = ans1[0];
        flColumn = ans2[0];
        const card = ans1[1];
        const column = ans2[1];

        if (!((flCard && flColumn) || (!flCard && flColumn))) {
            return;
        }
        const activeState = activeCard.getAttribute('curstate');

        const currentState = column.childNodes[0].childNodes[0].childNodes[0].innerText;

        currentColumnRef.current = column;
        setCurrentColumn(column);
        // console.log(column);

        if (!(cardsInColumn(column) && card === undefined)) {
            console.log("1");
            currentCardRef.current = card;
            setCurrentCard(card);
        }
        else {
            console.log("2");
            console.log(lastCardInColumn(column));
            const lastCard = defineElemByName(lastCardInColumn(column), "card")[1];
            console.log(lastCard);
            currentCardRef.current = lastCard;
            setCurrentCard(lastCard);
        }
        // console.log(currentCardRef.current);

        if (activeState == currentState) {
            const isMoveable = activeCard !== currentCardRef.current;

            if (!isMoveable) {
                return;
            }

            crossedCeneter = crossedCenterFunc(evt.clientY);
            if (crossedCeneter) {
                isEnd = defineCard();
                s1 = true;
            }

        }
        else {
            if (!flCard && flColumn) {
                console.log("123");
                s2 = true;
            }
            else if (flCard && flColumn) {
                console.log("456");
            }
        }


    }

    const setDDEvents = () => {

        if (!tasksListElement) {
            return;
        }

        tasksListElement.addEventListener(`dragstart`, handleDragStart);
        tasksListElement.addEventListener(`dragend`, handleDragStop);
        tasksListElement.addEventListener(`dragover`, throttle(handleDragOver, 300));

    }

    const defineElemByName = (curEl, name) => {
        let fl = true;
        let k = 0;
        let tmpElement = curEl;
        let elem;
        // console.log(tmpElement.classList);
        while (tmpElement.classList) {
            // console.log(tmpElement.classList);
            if (tmpElement.classList.contains(name)) {
                elem = tmpElement;
                break;
            }
            tmpElement = tmpElement.parentNode;
            k++;
        }

        if (elem === undefined) {
            fl = false;
        }
        return [fl, elem];
    }

    const defineCard = () => {
        let nextElement;
        let isEnd = !currentCardRef.current.parentNode.nextElementSibling;
        if (isEnd || currentCardRef.current.parentNode.nextElementSibling.childNodes[0] === activeCard) {
            nextElement = currentCardRef.current;
            // console.log("1");
        }
        else {
            nextElement = currentCardRef.current.parentNode.nextElementSibling.childNodes[0];
            // console.log("2");
        }
        currentCardRef.current = nextElement;
        setCurrentCard(nextElement);

        return isEnd;
    }

    const cardsInColumn = (column) => {
        try {
            const childsCards = column.childNodes;
            return true;
        }
        catch {
            return false;
        }
    }

    const lastCardInColumn = (column) => {
        const tasksInColumn = column.childNodes[column.childNodes.length - 1].childNodes;
        // console.log(tasksInColumn);
        // console.log(tasksInColumn[tasksInColumn.length - 1]);
        return tasksInColumn[tasksInColumn.length - 1].childNodes[0];
    }

    const changeCardPlace = (isEnd) => {
        const activeElementId = activeCard.getAttribute('id');
        let activeTaskElem = tasks.filter(task => task.id == activeElementId)[0];
        let taskCopy = [...tasks];
        taskCopy = taskCopy.filter(task => task.id != activeElementId);
        console.log("taskCopy");
        console.log(taskCopy);
        if (isEnd) {
            taskCopy.push(activeTaskElem);
            changePriorityFunc(activeElementId, taskCopy.length, projectToken);
            setUpdateTasksFunc(false);
            // setTasks(taskCopy);
            // cardsRef.current = taskCopy;
            // setCards(taskCopy);
            // console.log("tasks");
            // console.log(tasks);
            // console.log("cards");
            // console.log(cardsRef.current);
            return;
        }

        const currentElementId = currentCardRef.current.getAttribute('id');

        let currentTaskElemInd = taskCopy.indexOf(taskCopy.filter(task => task.id == currentElementId)[0]);

        currentTaskElemInd == 0 ? taskCopy.splice(0, 0, activeTaskElem) : taskCopy.splice(currentTaskElemInd, 0, activeTaskElem);
        for (let i = 0; i < taskCopy.length; i++) {
            changePriorityFunc(taskCopy[i].id, i + 1, projectToken);
        }
        setUpdateTasksFunc(false);
        // setTasks(taskCopy);
        // cardsRef.current = taskCopy;
        // setCards(taskCopy);

    }

    const crossedCenterFunc = (cursorPosition) => {
        // console.log(currentCardRef.current);
        const currentElementCoord = currentCardRef.current.getBoundingClientRect();
        const activeElementCoord = activeCard.getBoundingClientRect();
        const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;


        if (activeElementCoord.y < currentElementCoord.y && cursorPosition >= currentElementCenter) {
            return true;
        }
        if (activeElementCoord.y >= currentElementCoord.y && cursorPosition <= currentElementCenter) {
            return true;
        }
        return false;
    }

    setDDEvents();
}

export default DragAndDrop;
