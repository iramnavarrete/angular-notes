import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, NgModel, Validators } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ColorNote, colors, NotesResponse } from 'src/app/models/note.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotesService } from '../notes.service';

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
  @ViewChild('save') save: ElementRef

  noteForm = this.fb.group({
    title: [
      '',
      [Validators.maxLength(150)]
    ],
    description: [
      '',
      [Validators.required, Validators.minLength(4),]
    ],
    color: [
      'grey',
      []
    ]
  })

  actionTODO = Action.NEW

  errorTitle = false

  dialog = document.querySelector('.mat-dialog-container');
  constructor(
    public dialogRef: MatDialogRef<CreateNoteComponent>,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver,
    @Inject(MAT_DIALOG_DATA) public data: NotesResponse,
    private notesSvc: NotesService
  ) { }



  ngAfterViewInit(): void {

    let previousValue = 0
    const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 662px)');
    // console.log(isSmallScreen)
    let width = 200
    let lengthTitle = 15
    if (isSmallScreen) {
      lengthTitle = 5
    }

    this.noteForm.get('title').valueChanges.subscribe((value: string) => {

      this.errorTitle = false
      this.renderer.setAttribute(this.title.nativeElement, 'rows', `1`)

      let _baseScrollHeight = this.title.nativeElement['scrollHeight']
      let rows


      if (_baseScrollHeight > 80) {
        rows = Math.ceil((_baseScrollHeight / 25))
      } else {
        rows = Math.ceil((_baseScrollHeight / 25) - 1)
      }
      this.renderer.setAttribute(this.title.nativeElement, 'rows', `${rows}`)

      if (value.length > lengthTitle) {
        if (previousValue >= value.length) {
          width = width - 15

        } else {
          width = width + 15
        }
        console.log(width)
        this.renderer.setStyle(this.title.nativeElement, 'width', `${width}px`)
        // rows = 1
        // this.renderer.setAttribute(this.title.nativeElement, 'rows', `${rows}`)
        previousValue = value.length
      } else {
        width = 200

        this.renderer.setStyle(this.title.nativeElement, 'width', `${width}px`)
      }

      if (value.length >= 110) {
        this.errorTitle = true
      }

    })

    if (this.data?.color) {
      this.background(this.data.color)
      this.actionTODO = Action.EDIT

    } else {
      this.background('grey')
    }


  }

  background(colorName: string) {
    // console.log(this.dialog.childNodes)

    const rgb = colors.find(rgbColor => rgbColor.name === colorName)
    this.renderer.setStyle(this.dialog.childNodes[0]['parentElement'], 'backgroundColor', rgb.primaryColor)
    this.renderer.setStyle(this.title.nativeElement, 'backgroundColor', rgb.accentColor)
    const button = this.save['_elementRef']['nativeElement']
    this.renderer.setStyle(button, 'color', 'white')
    this.renderer.setStyle(button, 'backgroundColor', rgb.accentColor)
    this.tag.forEach((child, index) => {
      const tag = child['nativeElement']
      const button = child['nativeElement'].childNodes[1]
      this.renderer.setStyle(tag, 'borderColor', rgb.accentColor)
      this.renderer.setStyle(button, 'backgroundColor', rgb.accentColor)

    })
    // console.log(this.save['_elementRef']['nativeElement'])


  }

  onSave() {

    if (this.actionTODO = Action.NEW) {
      const formValue = this.noteForm.value
      this.notesSvc.createNote(formValue).toPromise().then(
        (data: NotesResponse) => {
          if (data) {
            if (data.title.length > 50)
              data.titleReduced = data.title.substring(0, 50)
            if (data.description.length > 450)
              data.descriptionReduced = data.description.substring(0, 450) + '...'
            console.log(data)
            this.dialogRef.close(data)
          }
        }
      )
      // console.log(data, 'data antes del if')
      // setTimeout( //Timeout to safe server response
      //   () =>{

      //   }, 100
      // )

    }else {
      console.log('edit')
    }
  }

  ngOnInit(): void {
    // console.log(this.data)
    if (this.data?.id) {
      this.noteForm.patchValue({
        title: this.data?.title,
        description: this.data?.description
      })
    }
  }

  print() {
    console.log(this.title.nativeElement)
  }

}

