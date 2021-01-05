import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { NotesResponse, StatusMessage } from 'src/app/models/note.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}` 
  })

  options = {
    headers: this.headers
  }


  getAllNotes(): Observable<NotesResponse[] | void> {
    return this.http.get<NotesResponse[]>(environment.API_URL+'/notes/getNotes', this.options)
    .pipe(
      map((res:NotesResponse[]) =>{
        // console.log('Res->', res);
        // this.saveToken(res.token);
        // this.loggedIn.next(true
        // console.log('respuesta',res)
        return res;
      }),
      catchError((err) => {
        console.log(err, 'Error en getAllNotes()')
        return this.handleError(err)
      })
    )
  }

  deleteTag(id:number, tags:string): Observable<{}>{
    console.log(JSON.stringify({id: id, tags:tags}))
    return this.http.request<JSON>(
      'delete',
      environment.API_URL+'/notes/removeTagById', 
      {
        body: {id,tags},
        headers: this.headers
      }
    ).pipe(
      catchError((err) => {
        console.log(err, 'Error en deleteTag()')
        return this.handleError(err)
      })
    )
  }

  deleteNote(id:number): Observable<{}>{
    console.log(JSON.stringify({id: id}))
    return this.http.request<JSON>(
      'patch',
      environment.API_URL+'/notes/sendToTrash', 
      {
        body: {id},
        headers: this.headers
      }
    ).pipe(
      catchError((err) => {
        console.log(err, 'Error en deleteNote()')
        return this.handleError(err)
      })
    )
  }

  createNote(user: any): Observable<any>{
    return this.http.post<any>(`${environment.API_URL}/notes/createNote`, user, this.options = {
      headers: this.headers
    }).pipe(
      map(
        (res) =>{
          // console.log(res)
          return res.body
        }
      ),
      catchError( (err) => {
        console.log('Error on createNote()')
        return this.handleError(err)
      })
    )
  }

  updateNote(user: any): Observable<any>{
    return this.http.patch<any>(`${environment.API_URL}/notes/updateNote`, user, this.options = {
      headers: this.headers
    }).pipe(
      map(
        (res) =>{
          // console.log(res)
          return res.body
        }
      ),
      catchError( (err) => {
        console.log('Error on updateNote()')
        return this.handleError(err)
      })
      )
  }

  private handleError(err): Observable<never>{
    console.log('Errorrrr',err)
    let errorMessage: StatusMessage;
    if(err){
    
      if (!err.error.auth){
        errorMessage = {
          message: err.error.message,
          status: err.status
          
        }
        console.log('Respuesta---', errorMessage)
      }
      else{
        errorMessage = {
          message: 'Service unavaliable',
          status: 503
        }
        
      }
    }
    // window.alert(errorMessage);
    return throwError(errorMessage);

  }
}
