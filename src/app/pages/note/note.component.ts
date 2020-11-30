import { AfterViewInit, Component, Directive, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Masonry, MasonryInstance, MasonryOptions } from '@thisissoon/angular-masonry';



@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements AfterViewInit, OnDestroy{

  
  colors: ColorNote[] = [
    {name:"red", color: "#7f0000"},
    {name:"blue", color: "#003c8f"},
    {name:"green", color: "#003d33"},
    {name:"brown", color: "#260e04"},
    {name:"gray", color: "102027"},
    {name:"purple", color: "#38006b"}
  ] 
  
  @ViewChild('grid') public grid: ElementRef;

  public masonryInstance: MasonryInstance;

  notesToAdd = [
    {
      clip: "/assets/clip.png",
      id: 1,
      title: 'Hola que hace nota 1',
      description: 'Kioña kioña',
      tags: ['Comida', 'Tapado', 'Rapo'],
      color: 'blue'
    },
    {
      clip: "/assets/clip.png",
      id: 2,
      title: 'Hola que hace soy la nota 2',
      description: 'Los cotorros son los meros perrones',
      tags: ['Risa', 'Podcast', 'Youtube'],
      color: 'red'
    },
    {
      clip: "/assets/clip.png",
      id: 3,
      title: 'Mi nombre es Jacobo y soy el más rudo nota 3',
      description: 'Que ondaaaaaaaa, pero como soy el más perro me atrevo a confesar que a lo mejor no estoy disponible para la gisuiente semana cuando me bañe',
      tags: ['Noticias', 'Nuevo', 'Novedades'],
      color: 'brown'
    },
    {
      clip: "/assets/clip.png",
      id: 4,
      title: 'Soy Roberto Mtz y me gusta programar y escribir libros nota 4',
      description: 'También los leo a veces',
      tags: ['Podcast', 'Creativo', 'Libros'],
      color: 'purple'
    },
    {
      clip: "/assets/clip.png",
      id: 2,
      title: 'Hola que hace soy la nota 5',
      description: 'Los cotorros son los meros perrones',
      tags: ['Risa', 'Podcast', 'Youtube'],
      color: 'gray'
    },
    {
      clip: "/assets/clip.png",
      id: 2,
      title: 'Hola que hace soy la nota 6',
      description: 'Los cotorros son los meros perrones',
      tags: ['Risa', 'Podcast', 'Youtube'],
      color: 'green'
    },
    {
      clip: "/assets/clip.png",
      id: 2,
      title: 'Hola que hace soy la nota 7',
      description: 'Los cotorros son los meros perrones',
      tags: ['Risa', 'Podcast', 'Youtube'],
      color: 'red'
    },
  ]
  public notes = this.notesToAdd;

  cambiarColor(color: String, position: number){
    const noteContent = this.masonryInstance.getItemElements()[position].childNodes[1]
    const noteHeader = this.masonryInstance.getItemElements()[position].childNodes[1].childNodes[0]
    const noteDescription = this.masonryInstance.getItemElements()[position].childNodes[1].childNodes[1]
    const noteTags = this.masonryInstance.getItemElements()[position].childNodes[1].childNodes[2]
    const rgb = this.colors.find(rgbColor => rgbColor.name === color)
    // console.log(rgb)
    noteContent.style['borderColor'] = rgb.color
    noteHeader.style['backgroundColor'] = rgb.color
    

  }
  
  animarNota(position: number){
    const noteContent = this.masonryInstance.getItemElements()[position]
    noteContent.style['animationDuration'] = '0.5s';
    noteContent.style['animationTimingFunction'] = 'ease-out';
    noteContent.style['animationDelay'] = '0s';
    noteContent.style['animationIterationCount'] = '1';
    noteContent.style['animationName'] = 'slideInFromBottom';

  }

  
  constructor(@Inject(Masonry) public masonry) {}
  

  ngAfterViewInit() {
    // console.log(this.notes, 'cars}ds')
    // for (let i = 0; i < this.notes.length; i++) {
    //   if(this.notes[i].color){
        
    //   }
    // }

    const options: MasonryOptions = {
      itemSelector: '.note',
      // columnWidth: '.note',
      gutter: 20,
      fitWidth: true,
      stagger: 4
      
    };
    this.masonryInstance = new this.masonry(this.grid.nativeElement, options);

    // this.masonryInstance.getItemElements()[0].childNodes[1].childNodes[0].style['backgroundColor'] = '#000000';
    // console.log(this.masonryInstance.getItemElements()[0].childNodes[1].childNodes[0].style);

    
      // this.masonryInstance.getItemElements()[0].childNodes[1].childNodes[0].style['backgroundColor'] = '#AAAAAA'
      for (let i = 0; i < this.notes.length; i++) {
        this.cambiarColor(this.notes[i].color, i)
        this.animarNota(i);
      }
  
      
    
    // this.layout();
  }

  layout() {

    this.masonryInstance.layout();
  }

  ngOnDestroy() {
    this.masonryInstance.destroy();
  }


}


interface Note{
  id: number;
  title: string;
  description: string;
  tags: string[];
}
interface ColorNote{
  name: string,
  color: string
}