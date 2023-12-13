import { Component,inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule]
})
export class Tab2Page {
  //public misnotas:Note[]=[];
  public noteS = inject(NoteService);  //noteS.notes$
  public _deleteNote!:Note;
  constructor( private alertController: AlertController) {}

  ionViewDidEnter(){
    /*this.misnotas=[];
    this.noteS.readAll().subscribe(d=>{
      console.log(d)
      d.docs.forEach((el:any) => {
        this.misnotas.push({'key':el.id,...el.data()});
      });
    })*/
  }

   async editNote($event: Note){
    const confirmAlert = await this.alertController.create({
    message: 'Introduce el nuevo título de la nota',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Título'
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Descripción'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Cancelar');
          }
        },
        {
          text: 'Guardar',
          handler: (data) => { 
            $event.title = data.title;
            $event.description = data.description;
            this.noteS.updateNote($event);
          }
        }
      ]
    });
    await confirmAlert.present();
}


  
   async deleteNote($event: Note){
    const confirmAlert = await this.alertController.create({
      header: 'Confirmacion',
      message: '¿Deseas eliminar esta lista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this._deleteNote = $event;
            if (this.noteS && typeof this.noteS.deleteNote === 'function') {
              this.noteS.deleteNote($event).then(() => {
                console.log('Nota eliminada exitosamente');
              }).catch((error) => {
                console.error('Error al eliminar la nota:', error);
              });
            } else {
              console.error('noteS.deleteNote no es una función');
            }
          },
        },
      ],
    });
  
    await confirmAlert.present();
  }
}


