import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Task, TaskStatus, TaskStatusFilter } from '../models/task.model';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss'
})
export class TaskModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input({ required: true }) statusOptions: TaskStatus[] = [];
  @Input({ required: true }) statusLabels: Record<TaskStatusFilter, string> = {} as Record<TaskStatusFilter, string>;

  @Output() cancel = new EventEmitter<void>();
  @Output() create = new EventEmitter<Task>();

  protected readonly form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(120)]],
      date: ['', [Validators.required, this.futureDateValidator]],
      status: ['Planned'],
      description: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.resetForm();
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const task: Task = {
      name: (value.name ?? '').trim(),
      date: value.date,
      status: (value.status ?? 'Planned') as TaskStatus,
      description: (value.description ?? '').trim(),
      isExpanded: false
    };

    this.create.emit(task);
  }

  protected onCancel(): void {
    this.cancel.emit();
  }

  protected onBackdropClick(): void {
    this.cancel.emit();
  }

  protected isControlInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  protected labelForStatus(status: TaskStatus): string {
    return this.statusLabels[status] ?? status;
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      date: '',
      status: 'Planned',
      description: ''
    });
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private readonly futureDateValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const selected = new Date(value);
    if (Number.isNaN(selected.getTime())) {
      return { pastDate: true };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);

    return selected < today ? { pastDate: true } : null;
  };
}
