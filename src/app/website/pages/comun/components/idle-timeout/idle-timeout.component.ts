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
    this.timeoutID = window.setTimeout(() => { this.goInactive() }, this.timeOut);
  }

  goInactive() {
    this.expired = true;
    this.intervalID = setInterval(() => this.countInterval(), 300);
  }

  async countInterval() {
    this.countDown = this.countDown + 1;
    // this.divBar['nativeElement'].style.width = this.countDown + '%';
    
    if (this.countDown >= 100) {
      
      this.countDown = 100;
      this.visibleBtn = true;

      clearInterval(this.intervalID);
      await this.authService.logout().then(
        resp => {
          this.visibleBtn = true;
        }
      );
      this.redireccionar()
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

  redireccionar(){
    this.navService.redirect('/login');
  }

}
