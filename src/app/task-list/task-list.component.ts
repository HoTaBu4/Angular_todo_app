import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, NgClass, NgFor } from '@angular/common';
import { Task, TaskStatus } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgClass, NgFor, DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent {
  @Input({ required: true }) tasks: Task[] = [];
  @Input({ required: true }) badgeClassMap!: Record<TaskStatus, string>;

  @Output() completedToggled = new EventEmitter<Task>();
  @Output() descriptionToggled = new EventEmitter<Task>();

  protected trackByTaskName(_: number, task: Task): string {
    return `${task.name}-${task.date}-${task.status}`;
  }

  protected onToggleCompleted(task: Task): void {
    this.completedToggled.emit(task);
  }

  protected onToggleDescription(task: Task): void {
    this.descriptionToggled.emit(task);
  }

  protected getBadgeClass(status: TaskStatus): string {
    return this.badgeClassMap[status] ?? 'bg-secondary';
  }
}
