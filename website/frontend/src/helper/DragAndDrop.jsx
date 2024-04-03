import React, { useEffect, useRef, useState } from 'react';


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


const DragAndDrop = (tasks) => {
    // const [currentElement, setCurrentElement] = useState();
    const [currentCard, setCurrentCard] = useState();
    const [currentColumn, setCurrentColumn] = useState();
    const [activeCard, setActiveCard] = useState();
    const [cards, setCards] = useState();
    // const [isDragging, setIsDragging] = useState(false);
    // const [moved, setMoved] = useState(false);
    let s1;
    let s2;
    let isEnd;
    let crossedCeneter;
    // const currentElementRef = useRef(currentElement);
    const currentCardRef = useRef(currentCard);
    const currentColumnRef = useRef(currentColumn);
    const activeCardRef = useRef(activeCard);
    const cardsRef = useRef(cards);
    let tasksListElement = document.querySelector('.tasklist');
    const blankCanvas = document.createElement('canvas');

    function debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            clearTimeout(timeout)
            timeout = setTimeout(() => { func(...args) }, wait)
        }
    }

    const handleDragStart = (evt) => {
        // setIsDragging(true);
        // console.log(tasks);
        evt.target.classList.add(`selected`);
        evt.dataTransfer.setDragImage(blankCanvas, 0, 0);
    }

    const handleDragStop = (evt) => {
        // setIsDragging(false);
        // setMoved(false);
        if (s1 && crossedCeneter) {
            console.log("s1");
            changeCardPlace(isEnd);
        }
        if (s2) {
            console.log("s2");
            const currentState = currentColumn.childNodes[0].childNodes[0].childNodes[0].innerText;
            const activeElementId = activeCard.getAttribute('id');
            // changeStateFunc(activeElementId, currentState);
        }
        evt.target.classList.remove(`selected`);
        // return cardsRef.current;
    }


    const handleDragOver = (evt) => {
        evt.preventDefault();

        const activeElement = tasksListElement.querySelector(`.selected`);
        activeCardRef.current = activeElement;
        setActiveCard(activeElement);
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


        // console.log(activeState);
        // console.log(currentState);

        if (!((flCard && flColumn) || (!flCard && flColumn))) {
            return;
        }
        const activeState = activeCard.getAttribute('curstate');

        const currentState = column.childNodes[0].childNodes[0].childNodes[0].innerText;

        currentColumnRef.current = column;
        setCurrentColumn(column);

        if (!(cardsInColumn(currentColumn) && card === undefined)) {
            currentCardRef.current = card;
            setCurrentCard(card);
        }
        else {
            const lastCard = defineElemByName(lastCardInColumn(currentColumn), "card");
            currentCardRef.current = lastCard;
            setCurrentCard(lastCard);
        }

        if (activeState == currentState) {
            s1 = true;

            const isMoveable = activeCard !== currentCardRef.current;

            if (!isMoveable) {
                return;
            }

            crossedCeneter = crossedCenterFunc(evt.clientY);
            if (crossedCeneter) {
                isEnd = defineCard();
            }

        }
        else {
            if (!flCard && flColumn) {
                console.log("123");
                s2 = true;
                // changeCardPlace(activeCard, true);
                // const activeElementId = activeCard.getAttribute('id');
                // changeStateFunc(activeElementId, currentState);

            }
            else if (flCard && flColumn) {
                console.log("456");
            }
        }
        // if (column === currentColumnRef.current) {
        //     if (flCard) {
        //         console.log("card");
        //         currentCardRef.current = card;
        //         setCurrentCard(card);
        //         console.log(currentCardRef.current);
        //         const isMoveable = activeElement !== currentCardRef.current;

        //         if (!isMoveable) {
        //             return;
        //         }

        //         const crossedCeneter = crossedCenterFunc(evt.clientY, activeElement);
        //         // console.log(crossedCeneter);
        //         if (crossedCeneter) {
        //             let isEnd = defineElement(evt.clientY, activeElement);
        //             changeCardPlace(activeElement, isEnd);
        //         }
        //     }
        // }
        // // if (flCard) {
        // //     console.log("card");
        // //     currentElementRef.current = elem;
        // //     setCurrentElement(elem);
        // //     console.log(currentElementRef.current);
        // //     const isMoveable = activeElement !== currentElementRef.current;

        // //     if (!isMoveable) {
        // //         return;
        // //     }

        // //     const crossedCeneter = crossedCenterFunc(evt.clientY, activeElement);
        // //     // console.log(crossedCeneter);
        // //     if (crossedCeneter) {
        // //         let isEnd = defineElement(evt.clientY, activeElement);
        // //         changeCardPlace(activeElement, isEnd);
        // //     }
        // // }
        // else if (!flCard && flColumn) {

        //     // console.log("column");
        //     // currentElementRef.current = elem;
        //     // setCurrentElement(elem);
        //     // console.log(currentElementRef.current);
        //     // const isMoveable = activeElement !== currentElementRef.current;

        //     // if (!isMoveable) {
        //     //     return;
        //     // }

        //     // const newState = currentElementRef.current.childNodes[0].childNodes[0].childNodes[0].innerText;
        //     // const activeElementId = activeElement.getAttribute('id');
        //     // // let activeTaskElem = tasks.filter(task => task.id == activeElementId)[0];
        //     // // console.log(activeTaskElem);
        //     // // activeTaskElem.curstate = newState;
        //     // // setTasks(tasks);
        //     // changeStateFunc(activeElementId, newState);

        // }

    }

    const setDDEvents = () => {

        if (!tasksListElement) {
            return;
        }

        tasksListElement.addEventListener(`dragstart`, handleDragStart);
        tasksListElement.addEventListener(`dragend`, handleDragStop);
        tasksListElement.addEventListener(`dragover`, throttle(handleDragOver, 300));

        // return cardsRef.current;

    }

    const defineElemByName = (curEl, name) => {
        let fl = true;
        let k = 0;
        let tmpElement = curEl;
        let elem;
        while (tmpElement.classList) {
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
        return column.childNodes.at(-1);
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
            cardsRef.current = taskCopy;
            setCards(taskCopy);
            console.log("tasks");
            console.log(tasks);
            console.log("cards");
            console.log(cardsRef.current);
            return;
        }

        const currentElementId = currentCardRef.current.getAttribute('id');

        let currentTaskElemInd = taskCopy.indexOf(taskCopy.filter(task => task.id == currentElementId)[0]);

        currentTaskElemInd == 0 ? taskCopy.splice(0, 0, activeTaskElem) : taskCopy.splice(currentTaskElemInd, 0, activeTaskElem);

        cardsRef.current = taskCopy;
        setCards(taskCopy);

    }

    const crossedCenterFunc = (cursorPosition) => {
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