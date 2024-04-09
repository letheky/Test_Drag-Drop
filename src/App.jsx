import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDragAndDropWithStrictMode } from './hooks/useDragAndDrop';
import DataSample from "../public/vite.svg"

// Fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (_, index) => ({
        id: `item-${index + offset}`,
        content: `item ${index + offset}`
    }));

// A little function to help with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

// Moves an item from one list to another list
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
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
    const [items, setItems] = useState(getItems(10));
    const [selected, setSelected] = useState(getItems(5, 10));

    // Using your custom hook
    const { isDragAndDropEnabled } = useDragAndDropWithStrictMode();


    const onDragEnd = result => {
        const { source, destination } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const reorderedItems = reorder(
                source.droppableId === 'droppable' ? items : selected,
                source.index,
                destination.index
            );
            source.droppableId === 'droppable'
                ? setItems(reorderedItems)
                : setSelected(reorderedItems);
        } else {
            const result = move(
                source.droppableId === 'droppable' ? items : selected,
                source.droppableId === 'droppable' ? selected : items,
                source,
                destination
            );
            setItems(result.droppable);
            setSelected(result.droppable2);
        }
    };
    const Clone = () => {
        return (<img src={DataSample} alt="Cloned component" />)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '10px' }}>
                {isDragAndDropEnabled ? (
                    <Droppable
                        droppableId="droppable"
                        isDropDisabled={true}
                        renderClone={(provided, snapshot, rubric) => (
                            <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                            >
                                Item id: {items[rubric.source.index].id}
                            </div>
                        )}
                    >
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}>
                                {items.map((item, index) => (
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
