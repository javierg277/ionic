import { Component,Renderer2,ViewChild,inject } from '@angular/core';
import {IonicModule, LoadingController} from '@ionic/angular'
  import {FormBuilder,FormGroup,FormsModule,
  ReactiveFormsModule,Validators} from '@angular/forms';
import { LatLng, latLng, map, Marker, tileLayer } from 'leaflet';
import { Note } from '../model/note';
import { NoteService } from '../services/note.service';
import { UIService } from '../services/ui.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { image } from 'ionicons/icons';
import { Geolocation} from '@capacitor/geolocation';
import { ElementRef, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true, // Propiedad no reconocida en un componente Ionic, puede ser un error
  imports: [IonicModule, FormsModule, ReactiveFormsModule], // Importación de módulos (incorrecto en este contexto)
})
export class Tab1Page {
  @ViewChild('map') mapContainer: any; // Referencia al contenedor del mapa

  public form!: FormGroup; // Formulario reactivo del Angular
  private formB = inject(FormBuilder); // Inyección del constructor del formulario
  private noteS = inject(NoteService); // Inyección del servicio de notas
  private UIS = inject(UIService); // Inyección del servicio de interfaz de usuario
  public loadingS = inject(LoadingController); // Inyección del controlador de carga
  private myLoading!: HTMLIonLoadingElement; // Elemento de carga

  private Myphoto: string | undefined; // Variable para almacenar la foto
  private position: any; // Variable para almacenar la posición
  private marker: Marker | undefined; // Variable para el marcador en el mapa
  private map!: any; // Variable para el mapa

  Geolocation: any; // Variable para geolocalización (no se utiliza)

  constructor() {
    // Inicialización del formulario con FormBuilder
    this.form = this.formB.group({
      title: ['', [Validators.required, Validators.minLength(4)]], // Campo título del formulario
      description: [''] // Campo descripción del formulario
    });
  }

  // Método para guardar la nota
  public async saveNote(): Promise<void> {
    if (!this.form.valid || !this.Myphoto) return; // Verificación de validez del formulario y existencia de foto
    const image = await this.convertImageToBase64(this.Myphoto); // Conversión de la foto a base64
    const currentPosition = await this.getMyPosition(); // Obtención de la posición actual
    let note: Note = {
      title: this.form.get("title")?.value,
      description: this.form.get("description")?.value,
      date: Date.now().toLocaleString(),
      img: image,
      position: currentPosition ? currentPosition.toString() : undefined,
    };
    await this.UIS.showLoading(); // Mostrar mensaje de carga
    try {
      await this.noteS.addNote(note); // Añadir la nota al servicio de notas
      this.form.reset(); // Reiniciar el formulario
      await this.UIS.showToast("Nota introducida correctamente", "success"); // Mostrar mensaje de éxito
    } catch (error) {
      await this.UIS.showToast("Error al insertar la nota", "danger"); // Mostrar mensaje de error
    } finally {
      await this.UIS.hideLoading(); // Ocultar mensaje de carga
    }
  }

  // Método para capturar una foto
  public async takePic() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });
    this.Myphoto = image.webPath; // Almacenar la foto capturada
  }

  // Método para centrar el mapa en la posición del marcador
  public openMap(): void {
    if (this.marker) {
      this.map.setView(this.marker.getLatLng(), 13);
    }
  }

  // Método para obtener la posición actual
  public async getMyPosition(): Promise<LatLng | undefined> {
    try {
      const position = await Geolocation.getCurrentPosition(); // Obtener la posición actual
      return latLng(position.coords.latitude, position.coords.longitude); // Devolver la posición como LatLng
    } catch (error) {
      console.error('Error al obtener la posición actual:', error); // Manejar error de obtención de posición
      return undefined; // Devolver indefinido si hay un error
    }
  }

  // Método para convertir un blob a base64
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); // Inicializar un lector de archivos
      reader.onloadend = () => resolve(reader.result as string); // Resolver la promesa con el resultado (base64)
      reader.onerror = reject; // Manejar errores
      reader.readAsDataURL(blob); // Leer el blob como datos URL
    });
  }

  // Método para convertir una imagen a base64
  private async convertImageToBase64(imagePath: string): Promise<string> {
    try {
      const response = await fetch(imagePath); // Obtener la imagen
      const blob = await response.blob(); // Convertir la imagen a un blob
      const base64Data = await this.blobToBase64(blob); // Convertir el blob a base64
      return base64Data; // Devolver los datos en base64
    } catch (error) {
      console.error('Error al convertir la imagen a base64:', error); // Manejar error de conversión
      return ''; // Devolver cadena vacía si hay un error
    }
  }
}