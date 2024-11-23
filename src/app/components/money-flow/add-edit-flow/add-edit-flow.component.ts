import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MoneyFlow } from '../../../models/moneyFlow';
import { MoneyFlowService } from '../../../services/money-flow.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MoneyFlowResponseDTO } from '../../../models/moneyFlowResponseDTO';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-edit-flow',
  templateUrl: './add-edit-flow.component.html',
  styleUrl: './add-edit-flow.component.css'
})
export class AddEditFlowComponent {
  formFlujo!: FormGroup;
  type!: string;

  selectedCategory= null;
  selectedType = null;
  isEditing = false;

  categories!: Category[];
  fechaString!:string;
  fechaDate!:Date;
  categoryId: number=0;
  moneyFlowId: number=0;

  constructor(private formBuilder: FormBuilder, private categoryService: CategoryService,
    private snackbar: MatSnackBar, private moneyFlowService: MoneyFlowService, private router: Router,
    private activatedRoute: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialogRef: MatDialogRef<AddEditFlowComponent>){}

  ngOnInit(){
    this.cargarFormulario()
  }

  cargarFormulario(){
    this.formFlujo = this.formBuilder.group({
      name:["", [Validators.required, Validators.minLength(3)]],
      type:["", [Validators.required]],
      category:["", [Validators.required]],
      amount:["", [Validators.required,Validators.min(0)]],
      date:["", [Validators.required]],
    });

    this.moneyFlowId = this.data.id;
    if (this.moneyFlowId!=0 && this.moneyFlowId!=undefined) {
      //Cuando queremos actualizar
      this.moneyFlowService.getMoneyFlowById(this.moneyFlowId).subscribe({
        next: (data:MoneyFlowResponseDTO)=>{   
          this.isEditing = true;  
          this.formFlujo.get("name")?.setValue(data.name),
          this.formFlujo.get("type")?.setValue(data.type),
          this.cargarCategorias({ value: data.type });
          setTimeout(() => {
            // Buscar la categoría por su nombre y establecer el ID correspondiente
            const category = this.categories.find(cat => cat.nameCategory === data.category);
            if (category) {
              this.formFlujo.get("category")?.setValue(category.id);
            }
          }, 100); 
          
          this.formFlujo.get("amount")?.setValue(data.amount);
          const fechaDate: Date = new Date(data.date + 'T00:00:00');
          this.formFlujo.get("date")?.setValue(fechaDate);
        },
        error: (err)=>{
          console.log(err);
        }
      })

    } else{
      //Cuando queremos insertar
      this.moneyFlowId =0;
    }
  }

  cargarCategorias(event: any){
    this.selectedType = event.value;
    this.type = event.value;
    this.categoryService.getCategories(this.type).subscribe({
      next:(data:Category[]) => {
        this.categories = data;
      }
    });

  }

  seleccionarCategoria(event: any){
    this.selectedCategory = event.value;
    this.categoryId = event.value;
    console.log("Categoria seleccionada: "+ this.categoryId);
  }

  convertirFechaToString(event: any){
    let fechaDate:Date=event.value;
    this.fechaString = fechaDate.getFullYear() + "-" + (fechaDate.getMonth() + 1) + "-" + fechaDate.getDate();
  }

  convertirDateToString(fechaDate: Date): string {
    const year = fechaDate.getFullYear();
    const month = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

  grabarMoneyFlow(){
    let dateToday: Date = new Date();

    let date = this.formFlujo.get("date")?.value;
    if(date > dateToday){
      this.snackbar.open("La fecha debe ser igual o menor a la actual","OK",{duration:2000});
      return;
    }

    const fechaDesdeFormulario = this.formFlujo.get("date")?.value;
    if (fechaDesdeFormulario instanceof Date) {
      this.fechaString = this.convertirDateToString(fechaDesdeFormulario);
    } else {
      this.fechaString = fechaDesdeFormulario;
    }

    console.log(this.fechaString);
    const flow: MoneyFlow = {
      id: this.moneyFlowId,
      name: this.formFlujo.get("name")?.value,
      type: this.type,
      amount: parseFloat(this.formFlujo.get("amount")?.value),
      date: this.fechaString
    }

    if (this.moneyFlowId==0){
      this.moneyFlowService.newMoneyFlow(flow,this.formFlujo.get("category")?.value ).subscribe({
        next:(data)=>{
          this.dialogRef.close(true);       
          this.snackbar.open("El flujo fue registrado correctamente","OK",{duration:2000})
        },
        error: (err)=>{
          console.log(err);
          this.snackbar.open("Hubo un error en el registro del flujo","OK",{duration:2000})
        }
      })
    }
    else{
      this.moneyFlowService.editMoneyFlow(flow,this.moneyFlowId, this.formFlujo.get("category")?.value).subscribe({
        next:(data)=>{
          this.dialogRef.close(true);
          console.log(flow);  
          this.snackbar.open("El flujo fue actualizado correctamente","OK",{duration:2000})        
        },
        error: (err)=>{
          console.log(err);
          console.log(flow);
          this.snackbar.open("Hubo un error en la actualización del flujo","OK",{duration:2000})
        }
      })
    }
  }

  cerrar(){
    this.dialogRef.close();
  }
}
