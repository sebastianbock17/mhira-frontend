import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TabInterface } from '@app/@layout/vertical/header/tabs/tab.interface';
import { UpdateService } from '@shared/services/update.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  tabs: TabInterface[] = [];
  selectedIndex = -1;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private updateService: UpdateService) {}

  ngOnInit(): void {
    this.openTabs();
    this.urlChange();
  }

  openTabs() {
    const tabs = JSON.parse(localStorage.getItem('tabs'));
    const selectedIndex = JSON.parse(localStorage.getItem('activeTabIndex'));
    if (tabs) {
      if (tabs.length > 0) {
        this.tabs = tabs;
        if (selectedIndex !== -1) {
          this.selectedIndex = selectedIndex;
        } else {
          this.selectedIndex = 0;
        }
        this.router.navigateByUrl(this.tabs[this.selectedIndex].path);
        return;
      } else {
        this.router.navigateByUrl('mhira/miscellaneous/home');
        return;
      }
    }

    const currentRoute = this.activatedRoute.snapshot.firstChild;
    if (currentRoute.firstChild.children.length > 0) {
      this.generateTab(currentRoute.firstChild.children[0].data.title, currentRoute.firstChild.children[0].data.title);
    } else if (currentRoute.firstChild.data) {
      this.generateTab(currentRoute.firstChild.data.title, currentRoute.firstChild.data.title);
    } else {
      this.generateTab('Untitled');
    }
    this.selectedIndex = 0;
  }

  closeTab(tab: TabInterface): void {
    const closedTabIndex = this.tabs.indexOf(tab);
    this.tabs.splice(closedTabIndex, 1);
    localStorage.setItem('tabs', JSON.stringify(this.tabs));
    localStorage.setItem('activeTabIndex', JSON.stringify(this.selectedIndex));

    if (this.tabs.length > 0) {
      if (closedTabIndex === this.selectedIndex) {
        if (closedTabIndex < this.tabs.length - 1) {
          this.navigateToTab(this.tabs[closedTabIndex + 1]);
        } else {
          this.navigateToTab(this.tabs[closedTabIndex - 1]);
        }
      } else if (closedTabIndex < this.tabs.length - 1) {
        this.navigateToTab(this.tabs[closedTabIndex + 1]);
      } else {
        this.navigateToTab(this.tabs[this.tabs.length - 1]);
      }
    } else {
      this.router.navigateByUrl('mhira/miscellaneous/home');
    }
  }

  navigateToTab(tab: TabInterface) {
    this.router.navigateByUrl(tab.path).then((e) => {
      if (e) {
        this.selectedIndex = this.tabs.indexOf(tab);
        localStorage.setItem('activeTabIndex', JSON.stringify(this.selectedIndex));
      }
    });
  }

  urlChange() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.updateService.checkForUpdates();
        if (event.url !== '/mhira/not-found' && event.url !== '/') {
          const pathFound = this.tabs.some((tab) => tab.path === event.url.slice(1));
          if (!pathFound) {
            const currentChild = this.activatedRoute.snapshot.firstChild;
            if (this.router.getCurrentNavigation().extras.state) {
              this.generateTab(
                this.router.getCurrentNavigation().extras.state.title,
                this.router.getCurrentNavigation().extras.state.title
              );
            } else if (currentChild.firstChild.children.length > 0) {
              this.generateTab(
                currentChild.firstChild.children[0].data.title,
                currentChild.firstChild.children[0].data.title
              );
            } else if (currentChild.firstChild.data) {
              this.generateTab(currentChild.firstChild.data.title, currentChild.firstChild.data.title);
            } else {
              this.generateTab('Untitled');
            }

            this.tabs.filter((_tab) => {
              if (_tab.path === this.router.url) {
                this.selectedIndex = this.tabs.indexOf(_tab);
                return;
              }
            });
          } else {
            const activeTab = this.tabs.filter((_tab) => {
              return _tab.path === this.router.url;
            })[0];
            this.selectedIndex = this.tabs.indexOf(activeTab);
            this.navigateToTab(activeTab);
          }
        }
      }
    });
  }

  generateUUID() {
    /* tslint:disable:no-bitwise */
    let d = new Date().getTime();
    let d2 = (performance && performance.now && performance.now() * 1000) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    /* tslint:enable:no-bitwise */
  }

  generateTab(title: string, id: string = '') {
    if (title === 'No Tabs' || title === 'Not Found') {
      return;
    }
    const tab = {
      id: id !== '' ? id : this.generateUUID(),
      path: this.router.url,
      title,
    };
    const isInArray =
      this.tabs.find((_tab) => {
        return _tab.id === tab.id || _tab.path === this.router.url;
      }) !== undefined;

    if (!isInArray) {
      this.tabs.push(tab);
      localStorage.setItem('tabs', JSON.stringify(this.tabs));
      localStorage.setItem('activeTabIndex', JSON.stringify(this.selectedIndex));
    }
  }
}
