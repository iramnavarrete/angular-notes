import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class UtilsService {
    private sideBarOpened = new BehaviorSubject<boolean>(false)
    sidebarOpened$ = this.sideBarOpened.asObservable()

    openSidebar(value: boolean): void {
        this.sideBarOpened.next(value)
    }
}