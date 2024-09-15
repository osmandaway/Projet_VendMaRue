import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from '../../classes/Card';

@Component({
  selector: 'app-annonces-filtre',
  templateUrl: './annonces-filtre.component.html',
  styleUrls: ['./annonces-filtre.component.css']
})
export class AnnoncesFiltreComponent implements OnInit {
  info: boolean = false;
  cardlist: Card[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.info = params['info'] === 'true';
      this.cardlist = JSON.parse(params['cardlist']);
    });
  }
}
