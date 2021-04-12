import { Component, OnInit } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';
import { NotesService } from '../note/notes.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  tags = []

  constructor(private notesSvc: NotesService, private utilsSvc: UtilsService) { }

  ngOnInit(): void {
    this.notesSvc.getTags().subscribe(tags =>{
      this.tags = tags
    })
  }

  closeSidebar() {
    this.utilsSvc.openSidebar(false);
  }

}
