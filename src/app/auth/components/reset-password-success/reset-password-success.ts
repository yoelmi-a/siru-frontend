import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'reset-password-success',
  imports: [RouterLink],
  templateUrl: './reset-password-success.html',
})
export class ResetPasswordSuccess implements OnDestroy, OnInit {
  ngOnInit(): void {
    this.startCountdown();
  }
  countdown = signal<number>(30);
  router = inject(Router);
  private interval: any;

  startCountdown() {
    this.interval = setInterval(() => {
      if (this.countdown() > 0) {
        this.countdown.update(value => value - 1);
      } else {
        clearInterval(this.interval);
        this.router.navigateByUrl('/auth/login');
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }}
