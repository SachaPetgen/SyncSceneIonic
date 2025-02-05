import {Component, ViewChild} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonAvatar,
  IonItem,
  IonInfiniteScroll, IonInfiniteScrollContent, IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-feed',
  templateUrl: 'feed.page.html',
  styleUrls: ['feed.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonAvatar, IonItem, IonInfiniteScroll, IonInfiniteScrollContent, IonLabel],
})

export class FeedPage {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  private maxItems = 100;
  items: string[] = [];

  constructor() {

    this.items = Array.from({length: 20}, (v, k) => `Item ${k}`);
  }

  onIonInfinite($event: CustomEvent<void>) {

    if (this.items.length >= this.maxItems) {
      ($event.target as HTMLIonInfiniteScrollElement).complete();
      ($event.target as HTMLIonInfiniteScrollElement).disabled = true;
      return;
    }

    setTimeout(() => {
      this.items = Array.from({length: 20}, (v, k) => `Item ` + Math.floor(Math.random() * 10));
      ($event.target as HTMLIonInfiniteScrollElement).complete();

    }, 1000);
  }
}
