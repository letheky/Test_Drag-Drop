import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

let style = {
  backgroundColor: "orange",
  height: "300px",
  width: "400px",
  margin: "100px"
};

function Column(props) {
  const { droppableId, list, type } = props;

  const [ enabled, setEnabled ] = React.useState(false);

  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
       cancelAnimationFrame(animation);
       setEnabled(false);
    };
  }, []);

  if (!enabled) {
      return null;
  }

  return (
    <Droppable droppableId={droppableId} type={type}>
      {provided => (
        <div {...provided.droppableProps} ref={provided.innerRef} style={style}>
          <h2>{droppableId}</h2>

          {list.map((val, index) => {
            return (
              <Task id={val.id} key={val.id} index={index} title={val.title} />
            );
          })}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default Column;
