import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useTasks } from '../../contexts/TaskContext';
import { fetchTasks, fetchTaskById } from '../../services/todoService';

interface Task {
  userId: number;
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

interface TaskDetailProps {
  task: Task;
}

const TaskDetailContainer = styled.div`
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

const Label = styled.p`
  font-size: 1.2em;
  color: #333;
  margin-bottom: 1vh; /* Space between label and description */
  text-decoration: underline;
`;

const Description = styled.p`
  font-size: 1.2em;
  color: #666;
`;

const RemoveButton = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  background-color: #ff5c5c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #e60000;
  }
`;

const HomeButton = styled.button`
  padding: 5px 10px;
  font-size: 1em;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 1vh;
  margin-right: 10px;

  &:hover {
    background-color: #005bb5;
  }
`;

const ArrowBack = styled.span`
  margin-right: 5px;
  font-size: 1.2em;
`;

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  const router = useRouter();
  const { tasks, removeTask } = useTasks();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const currentTask = tasks.find(t => t.id === task.id);

  if (!currentTask) {
    // Redirect to homepage if the task doesn't exist
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  const handleRemoveTask = () => {
    removeTask(task.id);
    router.push('/'); // Redirect to homepage
  };

  const handleBackToHome = () => {
    router.push('/'); // Redirect to homepage
  };

  return (
    <TaskDetailContainer>
      <HomeButton onClick={handleBackToHome}>
        <ArrowBack>&larr;</ArrowBack>
      </HomeButton>
      <Title>{currentTask.title}</Title>
      <Label>Description:</Label>
      {currentTask.description && <Description>{currentTask.description}</Description>}
      <RemoveButton onClick={handleRemoveTask}>Remove Task</RemoveButton>
    </TaskDetailContainer>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const tasks: Task[] = await fetchTasks();
  const limitedTasks = tasks.slice(0, 10);

  const paths = limitedTasks.map((task: Task) => ({
    params: { id: task.id.toString() },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const { id } = context.params as { id: string };
  const task = await fetchTaskById(Number(id));

  return {
    props: {
      task,
    },
  };
};

export default TaskDetail;
