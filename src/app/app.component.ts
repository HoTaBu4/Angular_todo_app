import { Component } from '@angular/core';
import { DatePipe, NgClass, NgIf, NgFor } from '@angular/common';

type TaskStatus = 'Completed' | 'Pending' | 'Planned';

interface Task {
  name: string;
  status: TaskStatus;
  date: string;
  description: string;
  isExpanded?: boolean;
}

@Component({
  selector: 'app-root',
  imports: [NgClass, NgIf, NgFor, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent {
  protected readonly tasks: Task[] = [
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

  private readonly statusToBadgeClass: Record<TaskStatus, string> = {
    Completed: 'bg-success',
    Pending: 'bg-warning text-dark',
    Planned: 'bg-secondary'
  };

  protected toggleCompleted(task: Task): void {
    task.status = task.status === 'Completed' ? 'Planned' : 'Completed';
  }

  protected toggleDescription(task: Task): void {
    task.isExpanded = !task.isExpanded;
  }

  protected getBadgeClass(status: TaskStatus): string {
    return this.statusToBadgeClass[status] ?? 'bg-secondary';
  }
}
