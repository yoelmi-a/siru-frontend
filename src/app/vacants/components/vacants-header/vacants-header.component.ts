import { Component, input, OnInit } from '@angular/core';
import { Header } from '@vacants/interfaces/header.interface';

@Component({
    selector: 'vacants-header',
    templateUrl: 'vacants-header.component.html'
})

export class VacantsHeaderComponent implements OnInit {

    public header = input.required<Header>();

    constructor() { }

    ngOnInit() { }
}