import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-intro2',
  templateUrl: './intro2.page.html',
  styleUrls: ['./intro2.page.scss'],
})
export class Intro2Page implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToIntro2() {
    this.router.navigate(['/signup']);
  }

}
