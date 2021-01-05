export interface NotesResponse {
    id: number
    title: string
    titleReduced?: string
    description: string
    descriptionReduced?: string
    formatted_datecreated: string
    formatted_datemodified: string
    tags: string[]
    color: string
}
export interface StatusMessage{
    status: number
    message: string
}

export interface ColorNote{
    name: string,
    primaryColor: string //header text
    accentColor: string //description text
  }
  
export var 
    colors: ColorNote[] = [
        {name:"red", primaryColor: "#c62828", accentColor: '#ab000d'},
        {name:"blue", primaryColor: "#1976d2", accentColor: '#005cb2'},
        {name:"green", primaryColor: "#388e3c", accentColor: '#00701a'},
        {name:"brown", primaryColor: "#6d4c41", accentColor: '#4b2c20'},
        {name:"grey", primaryColor: "#546e7a", accentColor: '#34515e' },
        {name:"purple", primaryColor: "#7b1fa2", accentColor: '#5c007a'}
      ] 