import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Masonry, MasonryInstance, MasonryOptions } from '@thisissoon/angular-masonry';
import { Subscription } from 'rxjs';
import { ColorNote, colors, NotesResponse } from 'src/app/models/note.interface';
import { UtilsService } from 'src/app/services/utils.service';
import { NotesService } from './notes.service';
import { MatDialog } from "@angular/material/dialog";
import { CreateNoteComponent } from "./create-note/create-note.component";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})

export class NoteComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild('grid') public grid: ElementRef;
  @ViewChildren('notesContainer') public notesContainer: QueryList<NgModel>   //notes selector, get all notes at document HTML

  //Variables
  public masonryInstance: MasonryInstance;

  private subscriptionNotes = new Subscription()

  finished = false

  public notes: NotesResponse[] = []

  delete = false;   //Aux variable to prevent open ModalComponent

  constructor(@Inject(Masonry) public masonry,
    private utilsSvc: UtilsService,
    private notesSvc: NotesService,
    private renderer: Renderer2,
    private dialog: MatDialog) {

  }

  ngAfterViewInit() {

    const options: MasonryOptions = {
      itemSelector: '.note',
      gutter: 20,
      fitWidth: true,
      stagger: 4,

    };

    this.masonryInstance = new this.masonry(this.grid.nativeElement, options);


    this.subscriptionNotes.add(this.notesSvc.getAllNotes().subscribe(
      (res: NotesResponse[]) => {
        this.finished = true

        //executing function-> reduceText() to reduce title text and description text of note  
        for (let i = 0; i < res.length; i++) {
          this.reduceText(res[i])
          this.notes.push(res[i])
        }

        setTimeout(
          () => this.appendNote(), 5
        )

      }))


  }

  ngOnInit() {

  }


  ngOnDestroy() {
    this.masonryInstance.destroy();
    this.subscriptionNotes.unsubscribe()
  }


  removeTag(tag, id) {
    this.delete = true //Aux variable to know if createOrEditNote  -> if false == no open : open
    // console.log(tag, id)
    this.subscriptionNotes.add(this.notesSvc.deleteTag(id, tag).subscribe(
      (res) => {
        console.log(res)
        this.delete = false   //restore previous value
        for (let i = 0; i < this.notes.length; i++) {
          if (this.notes[i].id == id) {
            for (let j = 0; j < this.notes[i].tags.length; j++) {
              if (this.notes[i].tags[j] == tag) {
                console.log(this.notes[i].tags[j])
                this.notes[i].tags.splice(j, 1)
                console.log(this.notes[i].tags['length'])
                if (this.notes[i].tags['length'] == 0) {  //Interval to wait tag deleted
                  setInterval(() => this.masonryInstance.layout(), 50)
                  console.log('layout')
                }
              }
            }
          }

        }
      }
    )
    )
  }

  deleteNote(id: number) {
    // console.log(id)
    this.delete = true
    this.subscriptionNotes.add(this.notesSvc.deleteNote(id)
      .subscribe(
        (res) => {
          console.log(res)
          this.delete = false
          for (let i = 0; i < this.notes.length; i++) {
            if (this.notes[i].id == id) {
              for (let j = 0; j < this.masonryInstance.getItemElements()['length']; j++) {
                if (this.masonryInstance.getItemElements()[j].id == `${this.notes[i].id}`) {

                  this.notes.splice(i, 1)
                  this.masonryInstance.remove(this.masonryInstance.getItemElements()[j])
                  this.layout()
                  break
                }

              }

              setTimeout(() => {
                this.notesContainer.forEach((child, index) => {
                })
                this.layout()
              }, 200)


              break
            }

          }
        }
      )
    )
  }



  layout() {
    this.masonryInstance.layout();
  }


  //Methods
  getNote(note: JSON) {
    console.log(note)
  }

  private appendNote() {
    this.notesContainer.forEach((child, index) => {
      // console.log(child, 'child')
      this.changeColorNote(child['nativeElement'].children[0], index)      //Before add note, changes color note
      this.masonryInstance.addItems(child['nativeElement'].children[0]) //Add child to Masonry layout
    })

    //Ecery element of arrays, have an id
    //at start notes = getItem
    for (let i = 0; i < this.notes.length; i++) {
      this.renderer.setAttribute(this.masonryInstance.getItemElements()[i], 'id', `${this.notes[i].id}`)
      // console.log(this.masonryInstance.getItemElements()[i]['id'])
    }

    // Laid out items after load items
    this.layout()
  }


  changeColorNote(child, index) {
    // console.log(child)
    const note = child.children[0]
    const headerNote = note.children[1]
    const contentNote = note.children[2]
    const tagsNote = contentNote.children[1]
    const rgb = colors.find(rgbColor => rgbColor.name === this.notes[index].color)

    this.renderer.setStyle(note, 'visibility', 'visible')
    if (rgb) {      //If note has a different color that grey
      note.style['backgroundColor'] = rgb.primaryColor
      headerNote.style['backgroundColor'] = rgb.accentColor

      if (tagsNote.childNodes['length'] > 1) {

        for (let j = 0; j < tagsNote.childNodes['length'] - 1; j++) {
          this.changeTagColor(tagsNote.childNodes[j], rgb)
        }

      }
    }
  }

  changeTagColor(child, color: ColorNote) {
    child.style['borderColor'] = color.accentColor
    child.style['backgroundColor'] = color.primaryColor
    // console.log(child.childNodes)
    child.childNodes[1].style['backgroundColor'] = color.accentColor
  }

  preppendNote() {

  }

  async createOrEditNote(note: any = {}) {
    console.log(note)

    if (!this.delete) {

      const dialogRef = this.dialog.open(CreateNoteComponent, {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '80%',
        width: '80%',
        panelClass: 'full-screen-modal',
        data: note
      }
      )

      dialogRef.afterClosed().subscribe(
        (result) => {
          if (result) {
            console.log(result, 'result')
            if (!result.edit) {
              this.notesSvc.createNote(result).subscribe(
                (data) => {
                  console.log(data, 'Nota creada')
                  if (data) {
                    this.reduceText(data)
                    this.notes.push(data)
                    this.addNoteToMasorny(data)
                  }
                }
              )


            }
            else {
              this.notesSvc.updateNote(result).subscribe(
                (data) => {
                  // console.log('entra aqui')
                  if (data) {
                    console.log(data, 'data modificada')
                    this.reduceText(data)

                    for (let i = 0; i < this.notes.length; i++) {
                      
                      if (this.notes[i].id == data.id) {
                        console.log(this.notes[i].id, 'id')
                        for (let j = 0; j < this.masonryInstance.getItemElements()['length']; j++) {
                          // console.log(this.notes[i].id, 'id 2')
                          if (this.masonryInstance.getItemElements()[j].id == `${this.notes[i].id}`) {
                            this.notes.splice(i, 1)
                            this.masonryInstance.remove(this.masonryInstance.getItemElements()[j])

                            this.notes.push(data)
                            this.addNoteToMasorny(data)
                            this.layout()
                            break
                          }
                        }

                      }
                    }
                  }
                }
              )
            }
          }
        }
      )

    }

  }


  addNoteToMasorny(data) {
    setTimeout(
      () => {
        this.changeColorNote(this.notesContainer.last['nativeElement'].children[0], this.notes.length - 1)
        this.renderer.setStyle(this.notesContainer.last['nativeElement'].lastChild, 'visibility', 'visible')
        this.masonryInstance.prepended(this.notesContainer.last['nativeElement'].lastChild)
        this.renderer.setAttribute(this.masonryInstance.getItemElements()[0], 'id', `${data.id}`)

      },
      10
    )
  }

  openDialog(): NotesResponse {
    const dialogRef = this.dialog.open(CreateNoteComponent, {})

    console.log('se abre el modal')
    // console.log(dialogRef.getState(), '1')
    let note: NotesResponse
    dialogRef.afterClosed().subscribe(
      (result: NotesResponse) => {
        console.log("Nota que se va a agregar al array", result)
        note = result
      }
    )

    return note

  }

  reduceText(data) {   //Reduce text length to best experience

    if (data.title.length > 50)
      data.titleReduced = data.title.substring(0, 50)
    if (data.description.length > 450)
      data.descriptionReduced = data.description.substring(0, 450) + '...'
  }

  closeSidebar() {
    this.utilsSvc.openSidebar(false);
  }

  openSidebar() {
    this.utilsSvc.openSidebar(true);
  }

}



