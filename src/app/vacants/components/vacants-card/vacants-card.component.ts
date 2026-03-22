import { Component, input, OnInit } from '@angular/core';
import { Card } from '@vacants/interfaces/card.interface';

@Component({
    selector: 'vacants-card',
    templateUrl: 'vacants-card.component.html',
})

export class VacantsCard implements OnInit {
    public positions = input.required<Card[]>()
    constructor() { }

    ngOnInit() { }
}