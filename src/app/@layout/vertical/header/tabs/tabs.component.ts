import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute, ActivationEnd } from '@angular/router';
import { TabInterface } from '@app/@layout/vertical/header/tabs/tab.interface';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  tabs: TabInterface[] = [];
  selectedIndex = -1;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.urlChange();
  }

  closeTab(tab: TabInterface): void {
    const closedTabIndex = this.tabs.indexOf(tab);
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    if (closedTabIndex === this.selectedIndex) {
      if (closedTabIndex < this.tabs.length - 1) {
        this.navigateToTab(this.tabs[closedTabIndex - 1]);
      }
      if (closedTabIndex >= this.tabs.length - 1 && this.tabs.length > 0) {
        this.navigateToTab(this.tabs[closedTabIndex + 1]);
      }
    }
  }

  navigateToTab(tab: TabInterface) {
    this.router.navigateByUrl(tab.path).then((e) => {
      if (e) {
        this.selectedIndex = this.tabs.indexOf(tab);
      }
    });
  }

  urlChange() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (event.url !== '/mhira/not-found' && event.url !== '/') {
          const pathFound = this.tabs.some((tab) => tab.path === event.url.slice(1));
          if (!pathFound) {
            const currentChild = this.activatedRoute.snapshot.firstChild;
            const tab = {
              path: event.url.slice(1),
              title: 'To Be Parsed', // currentChild.data['title'],
            };
            this.tabs.push(tab);
            this.selectedIndex = this.tabs.indexOf(tab);
          } else {
            const tab = this.tabs.filter((tab) => {
              return tab.path === event.url.slice(1);
            })[0];
            this.selectedIndex = this.tabs.indexOf(tab);
            this.navigateToTab(tab);
          }
        }
      }
    });
  }
}