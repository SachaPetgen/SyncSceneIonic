import { Component, OnInit } from '@angular/core';
import {IonAvatar, IonItem, IonLabel} from "@ionic/angular/standalone";

@Component({
  selector: 'app-feed-card',
  templateUrl: './feed-card.component.html',
  styleUrls: ['./feed-card.component.scss'],
  imports: [
    IonLabel,
    IonAvatar,
    IonItem
  ]
})
export class FeedCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
