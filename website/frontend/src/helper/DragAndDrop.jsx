import React, { useEffect, useRef, useState } from 'react';



const DragAndDrop = (tasks, setTasks) => {
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
        const ans = isCard(curEl);
        const fl = ans[0];
        const card = ans[1];
        if (!fl) {
            return;
        }
        // if (card === currentElementRef.current) {
        //     return;
        // }
        currentElementRef.current = card;
        setCurrentElement(card);
        console.log(currentElementRef.current);
        const isMoveable = activeElement !== currentElementRef.current;

        if (!isMoveable) {
            return;
        }
        const crossedCeneter = crossedCenterFunc(evt.clientY, activeElement);
        console.log(crossedCeneter);
        if (crossedCeneter) {
            let isEnd = defineElement(evt.clientY, activeElement);
            changeCardPlace(activeElement, isEnd);
        }

    }

    const setDDEvents = () => {

        if (!tasksListElement) {
            return;
        }

        tasksListElement.addEventListener(`dragstart`, handleDragStart);
        tasksListElement.addEventListener(`dragend`, handleDragStop);
        tasksListElement.addEventListener(`dragover`, throttle(handleDragOver, 100));
    }

    const isCard = (curEl) => {
        let ans = true;
        let k = 0;
        let tmpElement = curEl;
        while (true) {
            if (tmpElement.classList.contains('card') || k > 10) {
                break;
            }
            tmpElement = tmpElement.parentNode;
            k++;
        }
        if (!(tmpElement.classList.contains('card'))) {
            ans = false;
        }

        return [ans, tmpElement];

    }

    const defineElement = (cursorPosition, activeElement) => {

        let nextElement;
        let isEnd = !currentElementRef.current.parentNode.nextElementSibling;
        if (isEnd || currentElementRef.current.parentNode.nextElementSibling.childNodes[0] === activeElement) {
            nextElement = currentElementRef.current;
            console.log("1");
        }
        else {
            nextElement = currentElementRef.current.parentNode.nextElementSibling.childNodes[0];
            console.log("2");
        }
        currentElementRef.current = nextElement;
        setCurrentElement(nextElement);

        return isEnd;
    }

    const crossedCenterFunc = (cursorPosition, activeElement) => {
        const currentElementCoord = currentElementRef.current.getBoundingClientRect();
        const activeElementCoord = activeElement.getBoundingClientRect();
        const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;
        console.log(activeElement);
        console.log(activeElementCoord.y);
        console.log(currentElementRef.current);
        console.log(currentElementCoord.y);
        console.log(cursorPosition);
        console.log(currentElementCenter);


        if (activeElementCoord.y < currentElementCoord.y && cursorPosition >= currentElementCenter) {
            return true;
        }
        if (activeElementCoord.y >= currentElementCoord.y && cursorPosition <= currentElementCenter) {
            return true;
        }
        return false;
    }

    const changeCardPlace = (activeElement, isEnd) => {
        console.log("change place");
        const activeElementId = activeElement.querySelector('.input').getElementsByTagName('input')[0].id;
        let activeTaskElem = tasks.filter(task => task.id == activeElementId)[0];
        let taskCopy = [...tasks];
        taskCopy = taskCopy.filter(task => task.id != activeElementId);

        if (isEnd) {
            taskCopy.push(activeTaskElem);
            setTasks(taskCopy);

            console.log(tasks);

            return;
        }

        const currentElementId = currentElementRef.current.querySelector('.input').getElementsByTagName('input')[0].id;

        let currentTaskElemInd = taskCopy.indexOf(taskCopy.filter(task => task.id == currentElementId)[0]);

        currentTaskElemInd == 0 ? taskCopy.splice(0, 0, activeTaskElem) : taskCopy.splice(currentTaskElemInd, 0, activeTaskElem);

        setTasks(taskCopy);
        console.log(tasks);
        setMoved(true);

    }

    setDDEvents();


}

export default DragAndDrop;