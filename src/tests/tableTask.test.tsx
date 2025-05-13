import { expect, describe, it, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { Task } from '@prisma/client';
import { TaskTable } from '~/app/_components/task/table';

// Пример данных для теста
const mockTasks: Task[] = [
    { id: '1', name: 'Задача 1', value: 10, taskTypeId: 'type1' },
    { id: '2', name: 'Задача 2', value: 20, taskTypeId: 'type2' },
    { id: '3', name: 'Задача 3', value: 30, taskTypeId: 'type3' },
    { id: '4', name: 'Задача 4', value: 40, taskTypeId: 'type4' },
    { id: '5', name: 'Задача 5', value: 50, taskTypeId: 'type5' },
];

describe('TaskTable', () => {
    beforeEach(() => {
        render(<TaskTable tasks={mockTasks} />);
    });

    it('должен рендерить таблицу с задачами', () => {
        // Проверяем, что заголовок таблицы отображается
        expect(screen.getByText('Название')).toBeTruthy();
        expect(screen.getByText('Макс.')).toBeTruthy();
        // Проверяем, что каждая задача отображается в таблице
        mockTasks.forEach(task => {
            expect(screen.getByText(task.name)).toBeTruthy();
            expect(screen.getByText(task.value.toString())).toBeTruthy();
        });
        // Проверяем, что таблица присутствует
        const table = screen.getByRole('table');
        expect(table).toBeTruthy();
    });

    it('должен содержать ссылки на редактирование задач', () => {
        // Получаем все ссылки в таблице
        const links = screen.getAllByRole('link');
        mockTasks.forEach(task => {
            const link = links.find(l => l.getAttribute('href') === `/task/${task.id}`);
            // Проверяем, что ссылка для редактирования задачи присутствует
            expect(link).toBeDefined(); 
            if (link) {
                expect(link.getAttribute('href')).toBe(`/task/${task.id}`);

                // Проверяем, что иконка отображается
                expect(link.querySelector('svg')).toBeTruthy(); 
            }
        });
    });

    it('должен переходить на страницу задачи 2 при нажатии на ссылку', () => {
        // Находим элемент с текстом "Задача 2"
        const task2Element = screen.getByText('Задача 2');
        expect(task2Element).toBeTruthy(); 

        const closestTd = task2Element.closest('td');
        if (closestTd) {
            const link = closestTd.querySelector('a'); 
            if (link) {
                expect(link.getAttribute('href')).toBe('/task/2');
                fireEvent.click(link);
            }
        }
    });
});
