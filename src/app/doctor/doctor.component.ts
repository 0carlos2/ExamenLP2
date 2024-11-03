import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { doctor } from './models/doctor';
import { especialidad } from '../especialidad/models/especialidad';
import { DoctorService } from './services/doctor.service';
import { EspecialidadService } from '../especialidad/services/especialidad.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [SidebarComponent,CardModule, TableModule, PanelModule, ToastModule, ConfirmDialogModule, DropdownModule, DialogModule, InputTextModule, FormsModule, CommonModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './doctor.component.html',
  styleUrl: './doctor.component.css'
})
export class DoctorComponent {
  totalRecords: number = 0;
  cargando: boolean = false;
  doctores: doctor[] = [];
  titulo: string = '';
  opc: string = '';
  doctor = new doctor(0, '', '', new especialidad());
  op = 0;
  visible: boolean = false;
  nombreTemp: string = '';
  apellidosTemp: string = '';
  isDeleteInProgress: boolean = false;
  filtroNombre: string = '';
  especialidadOptions: especialidad[] = [];
  especialidadOriginal: string = '';

  constructor(
    private doctorService: DoctorService,
    private especialidadService: EspecialidadService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.cargando = true;
    this.listarDoctores();
  }

  cargarEspecialidades() {
    this.especialidadService.getEspecialidades().subscribe({
      next: (data) => {
        this.especialidadOptions = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las especialidades'
        });
      }
    });
  }

  listarDoctores() {
    this.doctorService.getDoctores().subscribe({
      next: (data) => {
        this.doctores = data;
        this.totalRecords = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la lista de doctores',
        });
      },
    });
  }

  filtrarDoctores() {
    if (this.filtroNombre) {
      return this.doctores.filter(doctor =>
        doctor.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) ||
        doctor.apellidos.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }
    return this.doctores;
  }

  actualizarLista() {
    this.listarDoctores();
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Lista de doctores actualizada' });
  }

  showDialogCreate() {
    this.cargarEspecialidades();
    this.titulo = 'Crear Doctor';
    this.opc = 'Agregar';
    this.op = 0;
    this.nombreTemp = '';
    this.apellidosTemp = '';
    this.visible = true;
    this.doctor = new doctor(0, '', '', new especialidad());
  }

  showDialogEdit(id: number) {
    this.cargarEspecialidades();
    this.titulo = 'Editar Doctor';
    this.opc = 'Editar';
    this.doctorService.getDoctorById(id).subscribe((data) => {
      this.doctor = data;
      this.nombreTemp = this.doctor.nombre;
      this.apellidosTemp = this.doctor.apellidos;
      this.especialidadOriginal = this.doctor.especialidad.nombre;
      this.op = 1;
      this.visible = true;
    });
  }

  deleteDoctor(id: number) {

        this.doctorService.deleteDoctor(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Correcto',
              detail: 'Doctor eliminado',
            });
            this.isDeleteInProgress = false;
            this.listarDoctores();
          },
          error: () => {
            this.isDeleteInProgress = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el doctor',
            });
          },
        });
  
  }

  addDoctor(): void {
    if (!this.nombreTemp || this.nombreTemp.trim() === '' || 
        !this.apellidosTemp || this.apellidosTemp.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios',
      });
      return;
    }

    this.doctor.nombre = this.nombreTemp;
    this.doctor.apellidos = this.apellidosTemp;
    
    this.doctorService.createDoctor(this.doctor).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Doctor registrado',
        });
        this.listarDoctores();
        this.op = 0;
        this.visible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el doctor',
        });
      },
    });
  }

  editDoctor() {
    if (!this.nombreTemp || this.nombreTemp.trim() === '' || 
        !this.apellidosTemp || this.apellidosTemp.trim() === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos son obligatorios',
      });
      return;
    }

    if (!this.doctor.especialidad || !this.doctor.especialidad.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Debe seleccionar una especialidad',
      });
      return;
    }

    this.doctor.nombre = this.nombreTemp;
    this.doctor.apellidos = this.apellidosTemp;

    const doctorToUpdate = {
      id: this.doctor.id,
      nombre: this.doctor.nombre,
      apellidos: this.doctor.apellidos,
      especialidad: {
        id: this.doctor.especialidad.id,
        nombre: this.doctor.especialidad.nombre
      }
    };

    this.doctorService.updateDoctor(doctorToUpdate, this.doctor.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Doctor actualizado',
        });
        this.listarDoctores();
        this.op = 0;
        this.visible = false;
      },
      error: (error) => {
        console.error('Error al actualizar doctor:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar el doctor',
        });
      },
    });
  }

  opcion(): void {
    if (this.op == 0) {
      this.addDoctor();
      this.limpiar();
    } else if (this.op == 1) {
      this.editDoctor();
      this.limpiar();
    } else {
      this.limpiar();
    }
  }

  limpiar() {
    this.titulo = '';
    this.opc = '';
    this.op = 0;
    this.doctor = new doctor(0, '', '', new especialidad());
    this.nombreTemp = '';
    this.apellidosTemp = '';
  }

}