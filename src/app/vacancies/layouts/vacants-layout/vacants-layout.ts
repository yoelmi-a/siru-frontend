import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VacantsNavbar } from '../../components/vacants-navbar/vacants-navbar';

@Component({
  selector: 'vacants-layout',
  imports: [VacantsNavbar, RouterOutlet],
  templateUrl: './vacants-layout.html'
})
export class VacantsLayout { }
