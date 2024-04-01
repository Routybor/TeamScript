import React, { useEffect, useRef, useState } from 'react';



const DragAndDrop = (tasks, setTasks, isLoaded, setIsLoaded, changeStateFunc) => {
    const [currentElement, setCurrentElement] = useState();
    const [isDragging, setIsDragging] = useState(false);
    const [moved, setMoved] = useState(false);
    const currentElementRef = useRef(currentElement);
    let tasksListElement = document.querySelector('.tasklist');
    const blankCanvas = document.createElement('canvas');



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

    function debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            clearTimeout(timeout)
            timeout = setTimeout(() => { func(...args) }, wait)
        }
    }

    const handleDragStart = (evt) => {
        setIsDragging(true);
        evt.target.classList.add(`selected`);
        evt.dataTransfer.setDragImage(blankCanvas, 0, 0);
    }

    const handleDragStop = (evt) => {
        setIsDragging(false);
        setMoved(false);
        evt.target.classList.remove(`selected`);
    }

    const handleDragOver = (evt) => {
        evt.preventDefault();

        const activeElement = tasksListElement.querySelector(`.selected`);
        if (activeElement === undefined) {
            return;
        }

        let curEl = evt.target;
        let flCard = false;
        let flColumn = false;
        const ans = isCardOrColumn(curEl);
        flCard = ans[0];
        flColumn = ans[1];
        const elem = ans[2];

        if (!flCard && !flColumn) {
            return;
        }
        // if (card === currentElementRef.current) {
        //     return;
        // }
        if (flCard) {
            console.log("card");
            currentElementRef.current = elem;
            setCurrentElement(elem);
            // console.log(currentElementRef.current);
            const isMoveable = activeElement !== currentElementRef.current;

            if (!isMoveable) {
                return;
            }

            const crossedCeneter = crossedCenterFunc(evt.clientY, activeElement);
            // console.log(crossedCeneter);
            if (crossedCeneter) {
                let isEnd = defineElement(evt.clientY, activeElement);
                changeCardPlace(activeElement, isEnd);
            }
        }
        if (flColumn) {
            console.log("column");
            currentElementRef.current = elem;
            setCurrentElement(elem);
            // console.log(currentElementRef.current);
            const isMoveable = activeElement !== currentElementRef.current;

            if (!isMoveable) {
                return;
            }

            const newState = currentElementRef.current.childNodes[0].childNodes[0].childNodes[0].innerText;
            console.log(activeElement);
            const activeElementId = activeElement.getAttribute('id');
            console.log(activeElementId);
            // let activeTaskElem = tasks.filter(task => task.id == activeElementId)[0];
            // console.log(activeTaskElem);
            // activeTaskElem.curstate = newState;
            // setTasks(tasks);
            changeStateFunc(activeElementId, newState);
            console.log(tasks);
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

    const isCardOrColumn = (curEl) => {
        let isCard = true;
        let isColumn = true;
        let k = 0;
        let tmpElement = curEl;
        while (true) {
            if (tmpElement.classList.contains('card') || tmpElement.classList.contains('column') || k > 10) {
                break;
            }
            tmpElement = tmpElement.parentNode;
            k++;
        }
        if (!(tmpElement.classList.contains('card'))) {
            isCard = false;
        }
        if (!(tmpElement.classList.contains('column'))) {
            isColumn = false;
        }
        return [isCard, isColumn, tmpElement];
    }

    const defineElement = (cursorPosition, activeElement) => {
        let nextElement;
        let isEnd = !currentElementRef.current.parentNode.nextElementSibling;
        if (isEnd || currentElementRef.current.parentNode.nextElementSibling.childNodes[0] === activeElement) {
            nextElement = currentElementRef.current;
            // console.log("1");
        }
        else {
            nextElement = currentElementRef.current.parentNode.nextElementSibling.childNodes[0];
            // console.log("2");
        }
        currentElementRef.current = nextElement;
        setCurrentElement(nextElement);

        return isEnd;
    }

    const crossedCenterFunc = (cursorPosition, activeElement) => {
        const currentElementCoord = currentElementRef.current.getBoundingClientRect();
        const activeElementCoord = activeElement.getBoundingClientRect();
        const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;


        if (activeElementCoord.y < currentElementCoord.y && cursorPosition >= currentElementCenter) {
            return true;
        }
        if (activeElementCoord.y >= currentElementCoord.y && cursorPosition <= currentElementCenter) {
            return true;
        }
        return false;
    }

    const changeCardPlace = (activeElement, isEnd) => {
        // console.log("change place");
        // const activeElementId = activeElement.querySelector('.input').getElementsByTagName('input')[0].id;
        const activeElementId = activeElement.getAttribute('id');
        let activeTaskElem = tasks.filter(task => task.id == activeElementId)[0];
        let taskCopy = [...tasks];
        taskCopy = taskCopy.filter(task => task.id != activeElementId);

        if (isEnd) {
            taskCopy.push(activeTaskElem);
            setTasks(taskCopy);

            // console.log(tasks);

            return;
        }

        const currentElementId = currentElementRef.current.querySelector('.input').getElementsByTagName('input')[0].id;

        let currentTaskElemInd = taskCopy.indexOf(taskCopy.filter(task => task.id == currentElementId)[0]);

        currentTaskElemInd == 0 ? taskCopy.splice(0, 0, activeTaskElem) : taskCopy.splice(currentTaskElemInd, 0, activeTaskElem);

        setTasks(taskCopy);
        setMoved(true);

    }

    setDDEvents();


}

export default DragAndDrop;