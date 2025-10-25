import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Task, TaskFilters, TaskStatus, TaskStatusFilter } from './models/task.model';
import { TaskFiltersComponent } from './task-filters/task-filters.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskModalComponent } from './task-modal/task-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, TaskFiltersComponent, TaskListComponent, TaskModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected tasks: Task[] = [
    {
      name: 'Zrobić zakupy spożywcze',
      status: 'Completed',
      date: '2025-05-01',
      description: 'Muszę kupić mleko, mąkę i jajka.'
    },
    {
      name: 'Opłacić rachunki',
      status: 'Pending',
      date: '2025-05-10',
      description: 'Tylko nie odkładaj tego na inny dzień!'
    },
    {
      name: 'Urodziny mamy',
      status: 'Planned',
      date: '2025-05-15',
      description: 'Kupić kwiaty i tort.'
    }
  ];

  protected readonly badgeClassMap: Record<TaskStatus, string> = {
    Completed: 'bg-success',
    Pending: 'bg-warning text-dark',
    Planned: 'bg-secondary'
  };

  protected readonly statusOptions: TaskStatusFilter[] = ['all', 'Completed', 'Pending', 'Planned'];

  protected readonly statusLabels: Record<TaskStatusFilter, string> = {
    all: 'Wszystkie',
    Completed: 'Zakończone',
    Pending: 'W toku',
    Planned: 'Zaplanowane'
  };

  protected filters: TaskFilters = {
    name: '',
    date: '',
    status: 'all'
  };

  protected readonly addTaskStatusOptions: TaskStatus[] = ['Planned', 'Pending', 'Completed'];

  protected isAddModalOpen = false;

  protected get filteredTasks(): Task[] {
    return this.tasks.filter((task) => {
      const matchesName = this.filters.name.trim().length === 0
        || task.name.toLowerCase().includes(this.filters.name.trim().toLowerCase());

      const matchesDate = this.filters.date === ''
        || task.date === this.filters.date;

      const matchesStatus = this.filters.status === 'all'
        || task.status === this.filters.status;

      return matchesName && matchesDate && matchesStatus;
    });
  }

  protected onFiltersChange(nextFilters: TaskFilters): void {
    this.filters = { ...nextFilters };
  }

  protected clearFilters(): void {
    this.filters = {
      name: '',
      date: '',
      status: 'all'
    };
  }

  protected toggleCompleted(task: Task): void {
    task.status = task.status === 'Completed' ? 'Planned' : 'Completed';
  }

  protected toggleDescription(task: Task): void {
    task.isExpanded = !task.isExpanded;
  }

  protected openAddModal(): void {
    this.isAddModalOpen = true;
  }

  protected closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  protected handleTaskCreated(task: Task): void {
    this.tasks = [...this.tasks, task];
    this.closeAddModal();
  }

  protected handleModalCancelled(): void {
    this.closeAddModal();
  }
}
