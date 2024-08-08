import Link from 'next/link';
import styled from 'styled-components';

interface TaskItemProps {
  id: number;
  title: string;
  onRemove: (id: number) => void;
}

const TaskItemWrapper = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const TaskTitle = styled.span`
  flex: 1;
`;

const RemoveButton = styled.button`
  padding: 5px 10px;
  font-size: 0.9em;
  background-color: #ff5c5c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e60000;
  }
`;

const TaskItem: React.FC<TaskItemProps> = ({ id, title, onRemove }) => {
  return (
    <TaskItemWrapper href={`/tasks/${id}`}>
      <TaskTitle>{title}</TaskTitle>
      <RemoveButton
        onClick={(e) => {
          e.stopPropagation(); // Prevent the link from being followed
          e.preventDefault(); // Prevent the default link behavior
          onRemove(id);
        }}
      >
        Remove
      </RemoveButton>
    </TaskItemWrapper>
  );
};

export default TaskItem;
