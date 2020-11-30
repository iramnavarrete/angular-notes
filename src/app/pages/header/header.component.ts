import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private subscription = new Subscription()
  isLogged = false;
  @Output() toggleSidenav = new EventEmitter<void>();
  constructor(private authSvc: AuthService) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  ngOnInit(): void {
    this.subscription.add(this.authSvc.isLogged.subscribe((res) => {
      this.isLogged = res;
    }) )
  }

  onToggleSidenav(){
    this.toggleSidenav.emit()
  }

  onLogout(){
    this.authSvc.logout();
  }
}
