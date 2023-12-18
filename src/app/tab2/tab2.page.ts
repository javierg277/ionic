import { Component,inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NoteService } from '../services/note.service';
import { Note } from '../model/note';
import { CommonModule } from '@angular/common';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2', // Selector del componente
  templateUrl: 'tab2.page.html', // Plantilla HTML del componente
  styleUrls: ['tab2.page.scss'], // Estilos del componente
  standalone: true, // Propiedad desconocida (posiblemente un error)
  imports: [IonicModule, CommonModule] // Importación de módulos
})
export class Tab2Page {
  public noteS = inject(NoteService); // Instancia de NoteService para manejar notas
  public _deleteNote!: Note; // Variable para almacenar la nota a eliminar
  constructor(private alertController: AlertController) {} // Inyección del AlertController

  ionViewDidEnter() {
    // Método que se ejecuta al entrar a la vista (actualmente está comentado)
    // Podría haber sido utilizado para cargar las notas al ingresar a esta vista
  }

  async editNote($event: Note) {
    // Método para editar una nota
    const confirmAlert = await this.alertController.create({
      message: 'Introduce el nuevo título de la nota', // Mensaje del cuadro de alerta
      inputs: [
        { name: 'title', type: 'text', placeholder: 'Título' }, // Campo para el nuevo título
        { name: 'description', type: 'text', placeholder: 'Descripción' } // Campo para la nueva descripción
      ],
      buttons: [
        {
          text: 'Cancelar', // Opción para cancelar la edición
          handler: () => {
            console.log('Cancelar'); // Acción al cancelar
          }
        },
        {
          text: 'Guardar', // Opción para guardar los cambios
          handler: (data) => {
            $event.title = data.title; // Actualiza el título de la nota
            $event.description = data.description; // Actualiza la descripción de la nota
            this.noteS.updateNote($event); // Llama al método para actualizar la nota
          }
        }
      ]
    });
    await confirmAlert.present(); // Muestra la alerta para editar la nota
  }

  async deleteNote($event: Note) {
    // Método para eliminar una nota
    const confirmAlert = await this.alertController.create({
      header: 'Confirmacion', // Encabezado del cuadro de alerta
      message: '¿Deseas eliminar esta lista?', // Mensaje de confirmación
      buttons: [
        {
          text: 'Cancelar', // Opción para cancelar la eliminación
          role: 'cancel', // Establece el rol como cancelación
          cssClass: 'secondary' // Clase de estilo secundario
        },
        {
          text: 'Eliminar', // Opción para confirmar la eliminación
          handler: () => {
            this._deleteNote = $event; // Almacena la nota a eliminar
            if (this.noteS && typeof this.noteS.deleteNote === 'function') {
              // Verifica si existe el método deleteNote en noteS
              this.noteS.deleteNote($event).then(() => {
                console.log('Nota eliminada exitosamente'); // Mensaje de éxito
              }).catch((error) => {
                console.error('Error al eliminar la nota:', error); // Mensaje de error al eliminar
              });
            } else {
              console.error('noteS.deleteNote no es una función'); // Manejo de error si deleteNote no es una función
            }
          },
        },
      ],
    });
    await confirmAlert.present(); // Muestra la alerta para confirmar la eliminación
  }
}