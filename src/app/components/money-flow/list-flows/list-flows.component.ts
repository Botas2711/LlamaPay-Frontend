import { Component } from '@angular/core';
import { MoneyFlowService } from '../../../services/money-flow.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MoneyFlowResponseDTO } from '../../../models/moneyFlowResponseDTO';
import { ConfirmationDeleteComponent } from '../../confirmations/confirmation-delete/confirmation-delete.component';
import { Router } from '@angular/router';
import { AddEditFlowComponent } from '../add-edit-flow/add-edit-flow.component';
import { Chart, registerables} from 'chart.js';
import { MoneyFlowSummaryDTO } from '../../../models/moneyFlowSummaryDTO';
import { MoneyFlowTypeDTO } from '../../../models/moneyFlowTypeDTO';
import { MoneyFlowCategoryDTO } from '../../../models/moneyFlowCategoryDTO';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

Chart.register(...registerables);
@Component({
  selector: 'app-list-flows',
  templateUrl: './list-flows.component.html',
  styleUrl: './list-flows.component.css'
})
export class ListFlowsComponent {
  dsMoneyFlows = new MatTableDataSource<MoneyFlowResponseDTO>();
  moneyFlowSummary!: MoneyFlowSummaryDTO;
  moneyFlowExpensesAndMonth!: MoneyFlowTypeDTO;
  moneyFlowIncomesAndMonth!: MoneyFlowTypeDTO;
  formFiltro!: FormGroup;

  currentIndex: number = new Date().getMonth(); 
  currentYear: number = new Date().getFullYear();

  months: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  monthsPicker = [
      { value: '01', viewValue: 'Enero' },
      { value: '02', viewValue: 'Febrero' },
      { value: '03', viewValue: 'Marzo' },
      { value: '04', viewValue: 'Abril' },
      { value: '05', viewValue: 'Mayo' },
      { value: '06', viewValue: 'Junio' },
      { value: '07', viewValue: 'Julio' },
      { value: '08', viewValue: 'Agosto' },
      { value: '09', viewValue: 'Septiembre' },
      { value: '10', viewValue: 'Octubre' },
      { value: '11', viewValue: 'Noviembre' },
      { value: '12', viewValue: 'Diciembre' }
  ];

  years = Array.from({ length: 10 }, (v, i) => ({ value: (2023 + i).toString() }));

  chart: Chart | null = null;
  labels: String [] = [];
  data1: number[] = [];
  data2: number[] = [];

  mesInicio: String | null = null;
  mesFin: String | null = null;
  anio: String | null = null;

  displayedColumns: string[] = ['name', 'type', 'amount','date','category_name', 'acciones'];

  constructor(private moneyFlowService: MoneyFlowService, private dialog: MatDialog,
    private router: Router, private snackbar: MatSnackBar,private formBuilder: FormBuilder ){}

  ngOnInit(){
    this.CargarFormFiltro();
    this.CargaFlujos();
    this.cargarGraficoPrincipal();
    this.cargarSaldoNeto();
  }

  CargarFormFiltro(){
    this.formFiltro = this.formBuilder.group({
      startMonth:[""],
      endMonth:[""],
      year:[""]
    });
  }

  CargaFlujos(){
    const mes = (this.currentIndex + 1).toString().padStart(2, '0');
    const fechaActual = `${this.currentYear}-${mes}-00`;
    this.moneyFlowService.getMoneyFlowByClientId(fechaActual).subscribe({
      next: (data:MoneyFlowResponseDTO[]) => {
        this.dsMoneyFlows = new MatTableDataSource(data);
      },      
      error: (err) => {
        console.log(err);
      }
    });
  }

  cargarSaldoNeto(){
    const mes = (this.currentIndex + 1).toString().padStart(2, '0');
    const fechaActual = `${this.currentYear}-${mes}-00`;
    this.moneyFlowService.getMoneyFlowSummaryMonth(fechaActual).subscribe({
      next: (data:MoneyFlowSummaryDTO) => {
        this.moneyFlowSummary = data;
      },      
      error: (err) => {
        console.log(err);
      }
    });

    //Total gastos
    this.moneyFlowService.getMoneyFlowTotalTypeAndMonth('Gasto',fechaActual).subscribe({
      next: (data:MoneyFlowTypeDTO) => {
        this.moneyFlowExpensesAndMonth = data;
      },      
      error: (err) => {
        console.log(err);
      }
    });
    
    //Total ingresos
    this.moneyFlowService.getMoneyFlowTotalTypeAndMonth('Ingreso',fechaActual).subscribe({
      next: (data:MoneyFlowTypeDTO) => {
        this.moneyFlowIncomesAndMonth = data;
        },      
        error: (err) => {
          console.log(err);
        }
    });
  }

  cargarMes(month: number) {
    this.currentIndex = month-1;
  }

  convertirDateToString(fechaDate: Date): string {
    const year = fechaDate.getFullYear();
    const month = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  AbrirAddEditFlow(flowId?: number){
    const dialogRef = this.dialog.open(AddEditFlowComponent, {
      width: '500px',
      height:'870px',
      disableClose: true,
      data: { id: flowId },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CargaFlujos();
        this.cargarGraficoPrincipal();
        this.cargarSaldoNeto();
      }
    });
    console.log(this.currentYear);
    console.log(this.currentIndex);
  }
  
  borrarFlujo(id: number){
    let dialogRef = this.dialog.open(ConfirmationDeleteComponent);
    dialogRef.afterClosed().subscribe(
      opcionSeleccionada => {
          if (opcionSeleccionada==true){

              this.moneyFlowService.deleteMoneyFlow(id).subscribe({
              next: (data)=> {
                  this.CargaFlujos();
                  this.cargarGraficoPrincipal();
                  this.cargarSaldoNeto();
              }
              ,      
              error: (err) => {
                console.log(err);
              }
            })

          }
      }
    )
  }

  seleccionarAnio(event: any){
    this.anio = event.value;
  }

  seleccionarMesInicio(event: any){
    this.mesInicio = event.value;
  }
  seleccionarMesFin(event: any){
    this.mesFin = event.value;
  }

  avanzarMes() {
    this.currentIndex++;
    if (this.currentIndex > 11) {
      this.currentIndex = 0;
      this.currentYear++;
    }
    this.cargarGraficoPrincipal();
    this.CargaFlujos();
    this.cargarSaldoNeto();
  }

  retrocederMes() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = 11;
      this.currentYear--;
    }
    this.cargarGraficoPrincipal();
    this.CargaFlujos();
    this.cargarSaldoNeto();
  }

  obtenerMesActual(): string {
    return this.months[this.currentIndex];
  }

  cargarGraficoPrincipal() {
    this.mesInicio = null;
    this.mesFin = null;
    this.anio = null;
    const mes = (this.currentIndex + 1).toString().padStart(2, '0');
    const fecha = `${this.currentYear}-${mes}-00`;
  
    // Variables para mantener las fechas y datos específicos de cada flujo
    let ingresosFechas: string[] = [];
    let gastosFechas: string[] = [];
    this.data1 = [];
    this.data2 = [];
  
    // Obtener ingresos
    this.moneyFlowService.getMoneyFlowsTypeAndMonth(fecha, "Ingreso").subscribe({
      next: (data: MoneyFlowTypeDTO[]) => {
        ingresosFechas = data.map(item => item.date.toString());
        this.data1 = data.map(item => item.total);
        this.setChartPrincipal(ingresosFechas, gastosFechas);
      },
      error: (error) => {
        console.error('No se pudo cargar los flujos de ingresos', error);
      }
    });
  
    // Obtener gastos
    this.moneyFlowService.getMoneyFlowsTypeAndMonth(fecha, "Gasto").subscribe({
      next: (data: MoneyFlowTypeDTO[]) => {
        gastosFechas = data.map(item => item.date.toString());
        this.data2 = data.map(item => item.total);
        this.setChartPrincipal(ingresosFechas, gastosFechas);
      },
      error: (error) => {
        console.error('No se pudo cargar los flujos de gastos', error);
      }
    });
  }
  
  setChartPrincipal(ingresosFechas: string[], gastosFechas: string[]) {
    if (this.chart) {
      this.chart.destroy();
    }
  
    // Combinar las fechas únicas y ordenarlas
    const uniqueDates = Array.from(new Set([...ingresosFechas, ...gastosFechas])).sort();
    
    // Crear arreglos para los datos, dejando en blanco cuando no hay valores
    const dataIngresos = uniqueDates.map(date => {
      const index = ingresosFechas.indexOf(date);
      return index >= 0 ? this.data1[index] : null;
    });
  
    const dataGastos = uniqueDates.map(date => {
      const index = gastosFechas.indexOf(date);
      return index >= 0 ? this.data2[index] : null;
    });
  
    const chartData = {
      labels: uniqueDates,
      datasets: [
        {
          data: dataIngresos,
          label: 'Ingresos',
          borderColor: 'green',
          backgroundColor: 'green',
          fill: false,
          tension: 0.1
        },
        {
          data: dataGastos,
          label: 'Gastos',
          borderColor: 'red',
          backgroundColor: 'red',
          fill: false,
          tension: 0.1
        }
      ]
    };
    
    this.chart = new Chart('chart', {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Monto'
            }
          }
        },
        spanGaps: true,
      }
    });
  }

  //Segundo grafico
  cargarGraficoTypeCategory(type: string){
    const mes = (this.currentIndex + 1).toString().padStart(2, '0');
    const fecha = `${this.currentYear}-${mes}-00`;
  
    // Variables para mantener las fechas y datos específicos de cada flujo
    let categories: string[] = [];
    this.data1 = [];
    this.moneyFlowService.getMoneyFlowsTypeCategory(fecha, type).subscribe({
      next: (data: MoneyFlowCategoryDTO[]) => {
        categories = data.map(item=> item.nameCategory.toString());
        this.data1 = data.map(item => item.total);
        this.setChartSecundario(categories, type);
      },
      error: (error) => {
        console.error('No se pudo cargar los flujos de gastos', error);
      }
    });
  }

  setChartSecundario(categories: string[], type :string){
    const color: string = type === 'Ingreso'? 'green' : 'red';

    if (this.chart) {
      this.chart.destroy();
    }
    const chartData = {
      labels: categories,
      datasets: [
        {
          data: this.data1,
          label: type+'s',
          backgroundColor: color,
          fill: false,
          tension: 0.1
        },

      ]
    };
    
    this.chart = new Chart('chart', {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Categorias'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Monto'
            }
          }
        }
      }
    });
  }

  //Tercer Grafico
  cargarGraficoComparacion() {
    if (this.mesInicio == null || this.mesFin == null || this.anio == null) {
        this.snackbar.open("Ingreso los datos requeridos", "OK", { duration: 2000 });
        return;
    }

    // Convertir a números
    const inicioMes = Number(this.mesInicio);
    const finalMes = Number(this.mesFin);
    const anio = Number(this.anio);

    // Validar que la fecha de inicio no sea mayor que la fecha de fin
    if (inicioMes > finalMes) {
        this.snackbar.open("El mes inicial no puede ser mayor que la mes final", "OK", { duration: 2000 });
        return;
    }
    let months: string[] = [];
    this.data1 = [];
    this.moneyFlowService.getMoneyFlowsRangeMonth(this.anio, this.mesInicio, this.mesFin).subscribe({
      next: (data: MoneyFlowSummaryDTO[]) => {
        let monthNames = data.map(item => {
          let monthIndex = item.monthName - 1; // Resta 1 para convertir a índice (0-11)
          return this.months[monthIndex]; // Accede al nombre del mes en el arreglo
        });
        this.data1 = data.map(item => item.netAmount);
        this.setChartPorRango(monthNames);
      },
      error: (error) => {
        console.error('No se pudo cargar los flujos de gastos', error);
      }
    });
  }

  setChartPorRango(monthNames: string[]){
    if (this.chart) {
      this.chart.destroy();
    }
    const chartData = {
      labels: monthNames,
      datasets: [
        {
          data: this.data1,
          label: 'Mes',
          backgroundColor: 'skyblue',
          fill: false,
          tension: 0.1
        },

      ]
    };
    
    this.chart = new Chart('chart', {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Mes'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Monto Neto'
            }
          }
        }
      }
    });
  }

}
