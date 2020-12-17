import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './pages/auth/auth.service';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  
  title = 'notes-app';
  opened = false
  isLogged = false
  private subscription = new Subscription()
  constructor(private utilsSvc: UtilsService, private authSvc: AuthService){

  }
  ngOnInit(): void {
    this.subscription.add(this.utilsSvc.sidebarOpened$.subscribe((res: boolean) => this.opened = res))
    this.subscription.add(this.authSvc.isLogged.subscribe((res) => {
      this.isLogged = res;
      // console.log(this.isLogged)
    }) )
  }
  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
  openSidebar(){
    this.utilsSvc.openSidebar(true);
  }
}
