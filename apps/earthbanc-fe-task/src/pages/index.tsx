// apps/todo-app/pages/index.tsx
import { useState } from 'react';
import styled from 'styled-components';
import TaskModal from '../components/TaskModal';
import TaskItem from '../components/TaskItem';
import { useTasks } from '../contexts/TaskContext';

const StyledPage = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 2.5em;
  color: #333;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

const TaskList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export default function Index() {
  const { tasks, addTask, removeTask } = useTasks();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSaveTask = (name: string, description: string) => {
    const newTaskObject = {
      userId: 1,
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1, // Ensure unique ID
      title: name,
      description,
      completed: false,
    };
    addTask(newTaskObject);
    setModalOpen(false); // Close the modal after saving the task
  };

  return (
    <StyledPage>
      <Title>To-Do List</Title>
      <InputContainer>
        <Button onClick={() => setModalOpen(true)}>Add Task</Button>
      </InputContainer>
      <TaskList>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            id={task.id}
            title={task.title}
            onRemove={removeTask}
          />
        ))}
      </TaskList>
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
      />
    </StyledPage>
  );
}
