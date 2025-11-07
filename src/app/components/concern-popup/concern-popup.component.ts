import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, IonicModule, IonContent } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-concern-popup',
  templateUrl: './concern-popup.component.html',
  styleUrls: ['./concern-popup.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ConcernPopupComponent {
  hasAgreed = false;

  @ViewChild(IonContent, { static: false }) ionContent?: IonContent;

  constructor(private modalCtrl: ModalController, private elRef: ElementRef) {
    console.log('ConcernPopupComponent initialized');
  }

  ngAfterViewInit(): void {
    // small async probe to inspect whether ion-content and its children are rendered
    setTimeout(async () => {
      try {
        const hostRect = this.elRef.nativeElement.getBoundingClientRect();
        console.log('ConcernPopup host rect:', hostRect);

        if (this.ionContent) {
          const scrollEl = await this.ionContent.getScrollElement();
          console.log('ionContent scroll element:', scrollEl, 'clientHeight=', scrollEl.clientHeight, 'scrollHeight=', scrollEl.scrollHeight);
        } else {
          console.log('ionContent ViewChild not found');
        }
      } catch (e) {
        console.error('Error probing modal content:', e);
      }
    }, 50);
  }

  agree() {
    this.modalCtrl.dismiss(true);
  }

  cancel() {
    this.modalCtrl.dismiss(false);
  }
}