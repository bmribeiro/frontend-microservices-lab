import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { User } from '../../../core/auth/auth.models';
import { UsersService } from '../../../core/users/users.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent implements OnInit {
  private readonly usersService = inject(UsersService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.usersService
      .findAll()
      .pipe(
        finalize(() => {
          this.loading.set(false);
        }),
      )
      .subscribe({
        next: (users) => {
          this.users.set(users);
        },
        error: () => {
          this.error.set('Não foi possível carregar os utilizadores.');
        },
      });
  }
}
