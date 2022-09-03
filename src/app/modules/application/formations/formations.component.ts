import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.css']
})
export class FormationsComponent implements OnInit {

  name = environment.application.name;
  angular = environment.application.angular;
  bootstrap = environment.application.bootstrap;
  fontawesome = environment.application.fontawesome;

  features: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object) {

    this.features =
      [
        {
          type: 'CRUD',
          description: '.',
          image: 'websiteplanet-dummy-278X110 (0).png',
          link: 'crud'
        },
        {
          type: 'Services',
          description: '.',
          image: 'websiteplanet-dummy-278X110 (1).png',
          link: 'services'
        },
        {
          type: 'Components',
          description: '.',
          image: 'websiteplanet-dummy-278X110 (2).png',
          link: 'components'
        },
        {
          type: 'HttpClient',
          description: '.',
          image: 'websiteplanet-dummy-278X110 (3).png',
          link: 'httpclient'
        },
        {
          type: 'Reactive Form',
          description: '.',
          image: 'websiteplanet-dummy-278X110 (4).png',
          link: 'forms'
        },
        {
          type: 'Template Driven Forms',
          description: '.',
          image: 'websiteplanet-dummy-278X110 (5).png',
          link: 'forms'
        },
        {
          type: 'Modal',
          description: '.',
          image: 'websiteplanet-dummy-278X110 (6).png',
          link: 'modal'
        },
        {
          type: 'Prism',
          description: '.',
          image: 'websiteplanet-dummy-278X110 (7).png',
          link: 'prism'
        },
      ];

  }

  ngOnInit(): void {

    const content = '';

    const title = 'Les Formations';

  }

  loadScript(name: string): void {

    if (isPlatformBrowser(this.platformId)) {
      const src = document.createElement('script');
      src.type = 'text/javascript';
      src.src = name;
      src.async = false;
      document.getElementsByTagName('head')[0].appendChild(src);
    }
  }

}

