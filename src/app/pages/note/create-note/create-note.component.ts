import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, NgModel, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ColorNote, colors, NotesResponse } from 'src/app/models/note.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotesService } from '../notes.service';
import { take } from 'rxjs/operators';

enum Action {
  NEW = 'new',
  EDIT = 'edit'
}

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss']
})



export class CreateNoteComponent implements OnInit, AfterViewInit {

  @HostListener('window:resize', ['$event']) onResize(event) {
    const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 662px)');
    // console.log(isSmallScreen)
  }
  @ViewChild('title') public title: ElementRef
  @ViewChildren('tag') tag: QueryList<NgModel>
  @ViewChild('tags') tags: ElementRef
  @ViewChild('save') save: ElementRef

  noteForm = this.fb.group({
    id: [
      0
    ],
    title: [
      ''
    ],
    description: [
      ''
    ],
    color: [
      ''
    ]
  })

  actionTODO = Action.NEW

  errorTitle = false

  changeColor = false
  
  tagsCopy = this.data.tags?.slice(0, this.data.tags.length)

  dialog = document.querySelector('.mat-dialog-container');
  constructor(
    public dialogRef: MatDialogRef<CreateNoteComponent>,
    private fb: FormBuilder,
    private renderer: Renderer2, 
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: NotesResponse,
    private notesSvc: NotesService,
    
  ) {
    

  }

  


  ngAfterViewInit(): void {

    if (this.data?.id) {
      this.noteForm.patchValue({
        title: this.data?.title,
        description: this.data?.description,
        color: this.data?.color
      })
      this.changeSizeHeader(this.data?.title)
    }

    this.noteForm.get('title').valueChanges.subscribe((value: string) => {
      this.changeSizeHeader(value)
    })


    if (this.data?.id) {
      this.background(this.data.color)
      this.actionTODO = Action.EDIT

    } else {
      this.background('grey')
    }


  }

  changeSizeHeader(value: string) {

    this.renderer.setStyle(this.title.nativeElement, 'border', '0px')
    const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 662px)');
    // console.log(isSmallScreen)
    let width = 200
    let lengthTitle = 15
    // if (isSmallScreen) {
    //   lengthTitle = 5
    // }

    this.errorTitle = false
    this.renderer.setAttribute(this.title.nativeElement, 'rows', `1`)

    let _baseScrollHeight = this.title.nativeElement['scrollHeight']
    let rows


    console.log(_baseScrollHeight, 'scroll')
    if (_baseScrollHeight > 80) {
      rows = Math.ceil((_baseScrollHeight / 25))
    } else {
      rows = Math.ceil((_baseScrollHeight / 25) - 1)
    }
    if(rows <= 3){
      this.renderer.setAttribute(this.title.nativeElement, 'rows', `${rows}`)
    }else{
      this.renderer.setAttribute(this.title.nativeElement, 'rows', '3')
    }

    if (value.length > lengthTitle) {
      width = value.length * 10 + 20
      this.renderer.setStyle(this.title.nativeElement, 'width', `${width}px`)
      // previousValue = value.length
    }
    
    else {
      width = 200

      this.renderer.setStyle(this.title.nativeElement, 'width', `${width}px`)
    }

    if (value.length >= 110) {
      this.errorTitle = true
      this.renderer.setStyle(this.title.nativeElement, 'border', '2px solid white')
    }
  }

  background(colorName: string) {
    // console.log(this.dialog.childNodes)
    this.noteForm.patchValue({color: colorName})
    const rgb = colors.find(rgbColor => rgbColor.name === colorName)
    this.renderer.setStyle(this.dialog.childNodes[0]['parentElement'], 'backgroundColor', rgb.primaryColor)
    this.renderer.setStyle(this.title.nativeElement, 'backgroundColor', rgb.accentColor)
    const button = this.save['_elementRef']['nativeElement']
    this.renderer.setStyle(button, 'color', 'white')
    this.renderer.setStyle(button, 'backgroundColor', rgb.accentColor)

    this.tag.forEach((child, index) => {
      this.changeTagColor(rgb, child)
    })
    // console.log(this.save['_elementRef']['nativeElement'])


  }

  changeTagColor(rgb, child){
    const tag = child['nativeElement']
    const buttonDeleteTag = child['nativeElement'].childNodes[1]
    this.renderer.setStyle(tag, 'borderColor', rgb.accentColor)
    this.renderer.setStyle(buttonDeleteTag, 'backgroundColor', rgb.accentColor)
  }

  onSave() {
    const formValue = this.noteForm.value
    
    if (this.actionTODO === Action.NEW) {
      formValue.edit = false
      // let note = {}
      console.log(formValue, 'Data que se envía')
      this.dialogRef.close(formValue)

    } else {
      formValue.id = this.data?.id
      console.log(formValue)
      formValue.edit = true
      this.dialogRef.close(formValue)
    }
  }

  // i = 0
  addTag(){
    
    // this.data.tags.push(`${this.i++}`)
    this.tagsCopy.push('')
    const rgb = colors.find(rgbColor => rgbColor.name === this.data.color)
    setTimeout(() => {
      this.tag.forEach((child, index) => {
        this.changeTagColor(rgb, child)
        // console.log(child, 'child')
      })
      this.tag.last['nativeElement'].children[0].focus()

    }, 5);

    // console.log(this.tag.last)


    
  }

  deleteTag(index: number){
    console.log(index)
    this.tagsCopy.splice(index, 1)
  }

  ngOnInit(): void {
    // console.log(this.data) 

  }

  print() {
    console.log(this.title.nativeElement)
  }

}


//TODO al momento se agregan los elementos como cadena vacía, cambiar eso, o sea detectar los cambios y guardar
//Como posibilidad, agregar un formbuilder para cada elemento del array de tags y detectar los cambios desde ahí