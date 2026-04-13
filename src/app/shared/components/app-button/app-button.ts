import { Component, computed, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';
type NativeButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './app-button.html',
})
export class AppButton {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  type = input<NativeButtonType>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  fullWidth = input<boolean>(false);

  pressed = output<void>();

  buttonClass = computed(() => {
    const variantClassMap: Record<ButtonVariant, string> = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      danger: 'btn-error',
      ghost: 'btn-ghost',
      outline: 'btn-outline',
    };

    const sizeClassMap: Record<ButtonSize, string> = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    };

    const widthClass = this.fullWidth() ? 'w-full' : '';

    return `btn ${variantClassMap[this.variant()]} ${sizeClassMap[this.size()]} ${widthClass}`.trim();
  });

  onClick() {
    if (this.disabled() || this.loading()) {
      return;
    }

    this.pressed.emit();
  }
}
