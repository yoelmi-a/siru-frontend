import { Component, inject, input, output } from '@angular/core';
import { Card } from '@vacants/interfaces/card.interface';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-vacants-card',
    imports: [RouterLink],
    templateUrl: 'vacants-card.component.html',
    host: {
        class: 'block w-full'
    }
})

export class VacantsCard {
    private router = inject(Router);
    public positions = input.required<Card[]>();
    public isAdminModule = input<boolean>(false);
    public detailRoute = input<string>('/admin/vacants');
    public applyPressed = output<string>();

    onCardClick(id?: string) {
        if (!this.isAdminModule() || !id) {
            return;
        }

        this.router.navigate([this.detailRoute(), id]);
    }

    onApplyClick(id?: string) {
        if (!id) {
            return;
        }

        this.applyPressed.emit(id);
    }
}