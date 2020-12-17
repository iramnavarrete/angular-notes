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

// @Directive({
//   selector: 'note'
// })



export class NoteComponent implements AfterViewInit, OnDestroy, OnInit{

  



  
  @ViewChild('grid') public grid: ElementRef;
  @ViewChildren('notesContainer') public notesContainer: QueryList<NgModel>   //notes selector, get all notes at document HTML
  // @ViewChildren('tag') public tags: QueryList<NgModel>
//   @HostListener ('click', ['$event.target']) clickNote(target: any){
//     console.log(target)
// }


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
                private dialog: MatDialog,
                private el: ElementRef) {
    
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
      (res: NotesResponse[])=>{
        this.finished = true

        //executing function-> reduceText() to reduce title text and description text of note  
        for(let i = 0; i < res.length; i++){
          if(res[i].title.length > 50)
            res[i].titleReduced = this.reduceText(res[i].title, 'title')
          if(res[i].description.length > 450)
            res[i].descriptionReduced = this.reduceText(res[i].description, 'description')
          this.notes.push(res[i])
        }
        // this.notes = res;
        
        setTimeout(
          ()=>this.appendNote(), 5
        )
        // this.notesContainer.changes.subscribe( 
        //   () => this.appendNote()
        // )
        
      }))

        
  }

  ngOnInit(){
    
  }

  
  ngOnDestroy() {
    this.masonryInstance.destroy();
    this.subscriptionNotes.unsubscribe()
  }


  removeTag(tag, id){
    this.delete = true //Aux variable to know if createOrEditNote  -> if false == no open : open
    // console.log(tag, id)
    this.subscriptionNotes.add(this.notesSvc.deleteTag(id,tag).subscribe(
      (res) => {
        console.log(res)
        this.delete = false   //restore previous value
        for (let i = 0; i < this.notes.length; i++) {
          if(this.notes[i].id == id){
            for (let j = 0; j < this.notes[i].tags.length; j++) {
              if(this.notes[i].tags[j] == tag){
                console.log(this.notes[i].tags[j])
                this.notes[i].tags.splice(j,1)
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

  deleteNote(id: number){
    console.log(id)
    this.delete = true
    this.subscriptionNotes.add(this.notesSvc.deleteNote(id)
    .subscribe(
      (res) => {
        console.log(res)
        this.delete = false
        for (let i = 0; i < this.notes.length; i++) {
          if(this.notes[i].id == id){
            // console.log(this.notes[i])
            // console.log(this.masonryInstance.getItemElements()[i])
            console.log(this.notes[i].id, 'id 1')
            
            // this.notesContainer.notifyOnChanges()
            // console.log(this.notesContainer.toArray[i])
            for (let j = 0; j < this.masonryInstance.getItemElements()['length']; j++) {
              // const element = this.masonryInstance.getItemElements()['length']];
              console.log(this.masonryInstance.getItemElements())
              if (this.masonryInstance.getItemElements()[j].id == `${this.notes[i].id}`) {
                
                console.log(this.notes[i].id, 'id 2')
                this.notes.splice(i, 1)
                this.masonryInstance.remove(this.masonryInstance.getItemElements()[j])    
                this.layout()
                break 
              }
              
            }
            
            // console.log(this.masonryInstance.getItemElements(), 'elemtns')
            // this.notes[i] = null
            
            setTimeout( ()=>{
              this.notesContainer.forEach((child, index) =>{
                console.log(child, `child ${index}`)
              })  
              this.layout()
            }, 200)
            // this.masonryInstance.reloadItems()
            // this.masonryInstance.
            
            
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
  getNote(note: JSON){
    console.log(note)
  }

  private appendNote() {    
    this.notesContainer.forEach((child, index) =>{
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

  
  changeColorNote(child, index){
    // console.log(child)
    const note = child.children[0]
      const headerNote = note.children[1]
      const contentNote = note.children[2]
      const tagsNote = contentNote.children[1]
      const rgb = colors.find(rgbColor => rgbColor.name === this.notes[index].color)

      this.renderer.setStyle(note,'visibility', 'visible')
      if(rgb){      //If note has a different color that grey
        note.style['backgroundColor'] = rgb.primaryColor 
        headerNote.style['backgroundColor'] = rgb.accentColor

        if(tagsNote.childNodes['length'] > 1){

            for (let j = 0; j < tagsNote.childNodes['length'] -1; j++) {
              this.changeTagColor(tagsNote.childNodes[j], rgb)
            }
            
        }
      }
  }

  changeTagColor(child, color:ColorNote){
    child.style['borderColor'] = color.accentColor
    child.style['backgroundColor'] = color.primaryColor
    // console.log(child.childNodes)
    child.childNodes[1].style['backgroundColor'] = color.accentColor
  }

  preppendNote(){
    
  }

  async createOrEditNote(note?:NotesResponse){
    
    
    if(!this.delete){

      console.log(note)
      if(note?.id){
        console.log('edit')
        const newNote = await this.dialog.open(CreateNoteComponent, {data: note, })
      }
      else{
        console.log('si entra')
        // const newNote = await this.dialog.open(CreateNoteComponent)
        // this.subscriptionNotes.add(
          // const note = await newNote.
        // )
            // console.log(note, 'note')
            const result = await this.openDialog()
            setTimeout( // tiemout to safe server response
              () =>{

              }, 100
            )
            if(result){
              // console.log(this.notesContainer.last)
              this.notes.push(result)
              console.log(this.notes)
              // this.notesContainer.notifyOnChanges()
              // this.notesContainer.changes.subscribe(()=>{
                
              // })

              setTimeout(
                () => {
                  // console.log(this.notesContainer.last, 'last')
                  this.changeColorNote(this.notesContainer.last['nativeElement'].children[0], this.notes.length-1)
                  this.renderer.setStyle(this.notesContainer.last['nativeElement'].lastChild, 'visibility', 'visible')
                  this.masonryInstance.prepended(this.notesContainer.last['nativeElement'].lastChild)
                  console.log(this.masonryInstance.getItemElements())
                  this.renderer.setAttribute(this.masonryInstance.getItemElements()[0], 'id', `${result.id}`)
                  // this.layout()
                },
                10
              )
          }
      }
    }
    
  }
  

  async openDialog(): Promise<NotesResponse>{
    const dialogRef = this.dialog.open(CreateNoteComponent)

    return dialogRef.afterClosed()
      .toPromise()
      .then(
        result =>{
          console.log("Dialog was closed", result)
          return Promise.resolve(result)
        }
      )

  }

  reduceText(text: string, textType: string): string{   //Reduce text length to best experience

    let textAux = text
    
    if(textType == 'title'){
      // if(text.length > 50){
        textAux = text.substring(0, 50) + '...'
      // }
    } else if(textType == 'description'){
      // if(text.length > 450){
        textAux = text.substring(0, 450) + '...'
      // }
    }

    return textAux
  }

  closeSidebar(){
    this.utilsSvc.openSidebar(false);
  }
  
  openSidebar(){
    this.utilsSvc.openSidebar(true);
  }

}



