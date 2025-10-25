import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { Subscription } from 'rxjs';
import { TaskFilters, TaskStatusFilter } from '../models/task.model';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.scss'
})
export class TaskFiltersComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) filters!: TaskFilters;
  @Input({ required: true }) statusOptions: TaskStatusFilter[] = [];
  @Input({ required: true }) statusLabels: Record<TaskStatusFilter, string> = {} as Record<TaskStatusFilter, string>;

  @Output() filtersChange = new EventEmitter<TaskFilters>();
  @Output() clearRequested = new EventEmitter<void>();

  protected readonly form: FormGroup;

  private subscription?: Subscription;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      date: [''],
      status: ['all' as TaskStatusFilter]
    });
  }

  ngOnInit(): void {
    this.subscription = this.form.valueChanges.subscribe((value) => {
      const nextFilters: TaskFilters = {
        name: (value.name ?? '').trim(),
        date: value.date ?? '',
        status: (value.status ?? 'all') as TaskStatusFilter
      };
      this.filtersChange.emit(nextFilters);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters'] && this.filters) {
      this.form.patchValue(
        {
          name: this.filters.name ?? '',
          date: this.filters.date ?? '',
          status: this.filters.status ?? 'all'
        },
        { emitEvent: false }
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected clearFilters(): void {
    const cleared: TaskFilters = { name: '', date: '', status: 'all' };
    this.form.setValue(cleared, { emitEvent: false });
    this.filtersChange.emit(cleared);
    this.clearRequested.emit();
  }
}
