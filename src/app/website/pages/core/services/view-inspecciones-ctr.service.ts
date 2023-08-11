import { Injectable } from '@angular/core';
import { ViewInspeccionesCtr } from '../../comun/entities/ViewInspeccionesCtr';
import { CRUDService } from './crud.service';

@Injectable({providedIn: 'root'})
export class ViewInspeccionCtrService extends CRUDService<ViewInspeccionesCtr>{
    
    getClassName(): string {
        return 'ViewInspeccionCtr';
    }
    
}