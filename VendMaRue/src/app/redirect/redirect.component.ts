import { Component,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {
  constructor(private router : Router, private route : ActivatedRoute) {}
  // renvoie sur l'url spécifiée dans le paramètre info de l'url
  ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const url = params['info'];
        this.router.navigateByUrl(url);
      });
  }
}
