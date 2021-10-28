import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Estado, Ticket } from './interfaces/estado.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent{

  listadoTickets: Ticket[] = [];
  comboEstados: Estado[] = [];
  private baseurl: string = "http://127.0.0.1:8000";
  public is_admin: boolean = false;
  public constante: string = "";

  closeResult = '';
  form: FormGroup;
  page = 1;
  pageSize = 10;
  p = 1;
  pageSizeOptions = [5, 10, 20, 50, 100]
  nitemsPerPage = this.pageSizeOptions[0]

  selectedEstado: string = "";
  
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(1)]],
      descripcion: ['', [Validators.required, Validators.maxLength(2048), Validators.minLength(1)]],
      estado: ['', [Validators.required, Validators.maxLength(1), Validators.minLength(1)]]
    })
  }

  ngOnInit(): void {
    this.http.get(`${this.baseurl}/tickets/listado/`).subscribe(data => {
      let response = JSON.parse(JSON.stringify(data))
      this.is_admin = response.is_admin;
      this.listadoTickets = response.data;
      this.comboEstados = response.estados;
      this.selectedEstado = this.comboEstados[0].id;
    });
  }

  crearTicket(){
    const ticket: any = {
      titulo: this.form.get('titulo')?.value,
      descripcion: this.form.get('descripcion')?.value,
      estado: this.form.get('estado')?.value
    }
    console.log(ticket);
    this.http.post(`${this.baseurl}/tickets/listado/`, ticket)
    .subscribe(
      (val) => {
          console.log("[POST] Ticket creado: ", val);
          this.ngOnInit();
      },
      response => {
          console.log("[POST] Ocurrio un error: ", response);
      },
      () => {
          console.log("El ticket fue creado con exito.");
      }
    );
    this.form.reset();
    this.modalService.dismissAll();
  }

  open(content: any)
  {
    this.modalService.open(
      content,
      {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
        backdropClass: 'light-blue-backdrop'
      }
    ).result.then(
      (result) => { this.closeResult = `Closed with: ${result}`; },
      (reason) => { this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; }
    );
  }

  openUpdateForm(content: any, index: number)
  {
    console.log(index);
    this.modalService.open(
      content, { size: 'lg' }
    );
  }

  private getDismissReason(reason: any): string
  {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onChangePageSizeConfig(newPageSizeOption: any) {
    this.nitemsPerPage = newPageSizeOption.value;
  }

  consoleLog(estado: any){
    console.log(estado);
  }

}
