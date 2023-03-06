import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CambioPasswdService {

  private subject = new Subject<boolean>();
  // private subject = new BehaviorSubject<boolean>(false);
  private onSubmitSubject = new Subject<any>();

  setVisible(visible: boolean) {
    debugger
    this.subject.next(visible);
  }

  onSubmit(resp: any) {
    this.onSubmitSubject.next(resp);
  }

  clear() {
    this.subject.next(false);
    this.onSubmitSubject.next('');
  }

  getObservable(): Observable<boolean> {
    debugger
    return this.subject.asObservable();
  }

  getSubmitObservable(): Observable<any> {
    return this.onSubmitSubject.asObservable();
  }

}
