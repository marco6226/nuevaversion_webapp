import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CambioPasswdService {

  private subject = new Subject<boolean>();
  private onSubmitSubject = new Subject<any>();
  
  setVisible(visible: boolean) {
    this.subject.next(visible);
  }

  onSubmit(resp: any) {
    this.onSubmitSubject.next(resp);
  }

  clear() {
    this.subject.next(false);
    this.onSubmitSubject.next(null);
  }
  getObservable(): Observable<boolean> {
    return this.subject.asObservable();
  }
  getSubmitObservable(): Observable<any> {
    return this.onSubmitSubject.asObservable();
  }
}
