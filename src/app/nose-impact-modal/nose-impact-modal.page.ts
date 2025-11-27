import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-nose-impact-modal',
  templateUrl: './nose-impact-modal.page.html',
  styleUrls: ['./nose-impact-modal.page.scss'],
})
export class NoseImpactModalPage implements OnInit {

  @Input() impacts: string[] = [];
  selectedImpacts: string[] = [];

  constructor(private modalCtrl: ModalController, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.selectedImpacts = [...this.impacts];
  }

  onImpactChange(impact: string, checked: boolean) {
    if (checked) {
      if (impact === 'Nothing Above') {
        this.selectedImpacts = ['Nothing Above'];
      } else {
        this.selectedImpacts = this.selectedImpacts.filter(i => i !== 'Nothing Above');
        if (!this.selectedImpacts.includes(impact)) {
          this.selectedImpacts.push(impact);
        }
      }
    } else {
      this.selectedImpacts = this.selectedImpacts.filter(i => i !== impact);
    }
    // Force UI to refresh instantly
    this.cdr.detectChanges();
  }

  isNothingAboveSelected(): boolean {
    return this.selectedImpacts.includes('Nothing Above');
  }

  isOtherOptionSelected(): boolean {
    return this.selectedImpacts.length > 0 && !this.selectedImpacts.includes('Nothing Above');
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  confirmChanges() {
    this.modalCtrl.dismiss(this.selectedImpacts);
  }
}
