import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';

@Component({
  selector: 'app-idle-timeout',
  templateUrl: './idle-timeout.component.html',
  styleUrls: ['./idle-timeout.component.scss']
})
export class IdleTimeoutComponent implements OnInit {

 
  @ViewChild('divBar', { static: false }) divBar!: HTMLDivElement;

  timeoutID: any;
  intervalID: any;
  timeOut = 600_000;
  // timeOut = 10_000;

  countDown = 0;

  expired: boolean = false;
  visibleBtn: boolean = false;

  constructor(
    private authService: AuthService,
    private navService: ParametroNavegacionService
  ) { }

  ngOnInit() {
    
    window.addEventListener('mousemove', this.resetTimer.bind(this));
    window.addEventListener('keypress', this.resetTimer.bind(this));
    this.startTimer();
  }

  resetTimer() {
    
    if (!this.visibleBtn) {
      window.clearTimeout(this.timeoutID);
      this.goActive();
    }
  }

  startTimer() {
    
    localStorage.setItem('mouseMove','true')
    let hora=new Date()
    localStorage.setItem('time',hora.toString())
    this.timeoutID = window.setTimeout(() => { this.goInactive() }, this.timeOut);
  }

  goInactive() {

    localStorage.setItem('mouseMove','false')

    // this.intervalID = setInterval(() => this.countInterval(), 10);
    this.intervalID = setInterval(() => this.countInterval(), 300);
  }

  async countInterval() {
    
    let mouseMove:any
    mouseMove=localStorage.getItem('mouseMove')

    let hora: string=localStorage.getItem('time')!
    let horaD=(new Date()).getTime()-new Date(hora).getTime()

    if(mouseMove=='true'){
      this.resetTimer()
      this.startTimer()
      this.goActive()
    }else if(mouseMove=='false' && horaD>this.timeOut){
      this.expired = true;
      this.countDown = this.countDown + 1;
      // this.divBar['nativeElement'].style.width = this.countDown + '%';
      
      if (this.countDown >= 100) {
        
        this.countDown = 100;
        this.visibleBtn = true;

        clearInterval(this.intervalID);
        await this.authService.logout().then(
          async (resp: any) => {

            this.visibleBtn = true;
          }
        );
        localStorage.setItem('mouseMove','0')
        await this.redireccionar()
      }
    }else if(mouseMove=='0'){
    // else{
      await this.redireccionar()
    }
  }

  goActive() {
    
    if (this.expired == true) {
      this.expired = false;
      clearInterval(this.intervalID);
      this.countDown = 0;
    }
    this.startTimer();
  }

  async redireccionar(){
    
    await this.navService.redirect('/login');
    setTimeout(() => {
      localStorage.clear()
    }, 2000);
  }

}
