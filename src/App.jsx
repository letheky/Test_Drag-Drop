import React, { Fragment, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDragAndDropWithStrictMode } from './hooks/useDragAndDrop';
import { v4 as uuid } from "uuid"

// Fake data generator
const getItems = (count) =>
    Array.from({ length: count }, () => ({
        id: `item-${uuid()}`,
        content: `item ${uuid()}`
    }));

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const copy = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const item = sourceClone[droppableSource.index];

    destClone.splice(droppableDestination.index, 0, { ...item, id: uuid() });
    return destClone;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // Some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // Change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // Styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

const App = () => {
    const ITEMS = [
        {
            id: uuid(),
            content: 'Headline'
        },
        {
            id: uuid(),
            content: 'Copy'
        },
        {
            id: uuid(),
            content: 'Image'
        },
        {
            id: uuid(),
            content: 'Slideshow'
        },
        {
            id: uuid(),
            content: 'Quote'
        }
    ];

    const [selected, setSelected] = useState(getItems(5));

    // Using your custom hook
    const { isDragAndDropEnabled } = useDragAndDropWithStrictMode();


    const onDragEnd = result => {
        const { source, destination } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        switch (source.droppableId) {
            case destination.droppableId:
                if (source.droppableId === 'ITEMS') return
                else {
                    const reorderedItems =
                        reorder(selected, source.index, destination.index);
                    setSelected(reorderedItems);
                    break;
                }
            case 'ITEMS':
                setSelected(copy(
                    ITEMS,
                    selected,
                    source,
                    destination
                ));
                break;
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '10px' }}>
                {isDragAndDropEnabled ? (
                    <Droppable
                        droppableId="ITEMS"
                        isDropDisabled={true}
                    >
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}>
                                {ITEMS.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <Fragment>
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}>
                                                    {item.content}
                                                </div>
                                                {snapshot.isDragging && (
                                                    <div style={{
                                                        userSelect: 'none',
                                                        padding: grid * 2,
                                                        margin: `0 0 ${grid}px 0`,
                                                        background: 'grey',
                                                    }}>{item.content}</div>
                                                )}
                                            </Fragment>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ) : null}
                {isDragAndDropEnabled ? (<Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {selected.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>) : null}
            </div>
        </DragDropContext>
    );
};

export default App