import { expect, describe, it, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { TaskType } from '@prisma/client';
import TaskTypeTable from '~/app/_components/taskType/table';

// Пример данных для теста
const mockTasks: TaskType[] = [
    { id: '1', name: 'Задача 1' },
    { id: '2', name: 'Задача 2' },
    { id: '3', name: 'Задача 3' },
    { id: '4', name: 'Задача 4' },
    { id: '5', name: 'Задача 5' },
    { id: '6', name: 'Задача 6' },
  ];

describe('TaskTypeTable', () => {
  beforeEach(() => {
    render(<TaskTypeTable tasks={mockTasks} />);
  });

  it('должен рендерить таблицу с задачами', () => {
    // Проверяем, что заголовок таблицы отображается
    expect(screen.getByText('Название')).toBeTruthy();
    // Проверяем, что каждая задача отображается в таблице
    mockTasks.forEach(task => {
      expect(screen.getByText(task.name)).toBeTruthy();
    });
    // Проверяем, что таблица присутствует
    const table = screen.getByRole('table');
    expect(table).toBeTruthy();
  });

  it('должен содержать ссылки на редактирование задач', () => {
    // Получаем все ссылки в таблице
    const links = screen.getAllByRole('link');
    mockTasks.forEach(task => {
      const link = links.find(l => l.getAttribute('href') === `/taskType/${task.id}`);
      // Проверяем, что ссылка для редактирования задачи присутствует
      expect(link).toBeDefined(); 
      if (link) {
        expect(link.getAttribute('href')).toBe(`/taskType/${task.id}`);
        expect(link.querySelector('svg')).toBeTruthy(); 
      }
    });
  });


  // it('должен переходить на страницу задачи 2 при нажатии на ссылку', () => {
  //   // Находим элемент с текстом "Задача 2"
  //   const task2Element = screen.getByText('Задача 2');
  //   expect(task2Element).toBeTruthy(); 
  //   const closestTd = task2Element.closest('td');
  //   if (closestTd) {
  //       const link = closestTd.querySelector('a');
  //       if (link) {
  //           expect(link.getAttribute('href')).toBe('/taskType/2');
  //           fireEvent.click(link);
  //           // Проверяем, что происходит при переходе на страницу 2
  //           expect(screen.getByText('Задача 5')).toBeTruthy(); // Проверяем, что задача 5 отображается
  //           expect(screen.queryByText('Задача 1')).toBeNull(); // Проверяем, что задача 1 не отображается
  //       }
    
  //   }
  //   });

});
