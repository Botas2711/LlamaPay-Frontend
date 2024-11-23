import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './modules/material/material.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AddEditFlowComponent } from './components/money-flow/add-edit-flow/add-edit-flow.component';
import { ListFlowsComponent } from './components/money-flow/list-flows/list-flows.component';
import { ConfirmationDeleteComponent } from './components/confirmations/confirmation-delete/confirmation-delete.component';
import { AddEditGoalComponent } from './components/goal/add-edit-goal/add-edit-goal.component';
import { ListGoalsComponent } from './components/goal/list-goals/list-goals.component';
import { HeaderComponent } from './components/header/header.component';
import { AddEditReminderComponent } from './components/reminder/add-edit-reminder/add-edit-reminder.component';
import { ListRemindersComponent } from './components/reminder/list-reminders/list-reminders.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ClientDetailsComponent } from './components/profile/client-details/client-details.component';
import { ConfigurationComponent } from './components/profile/configuration/configuration.component';
import { PaymentMethodsComponent } from './components/profile/payment-methods/payment-methods.component';
import { ConfirmationActionComponent } from './components/confirmations/confirmation-action/confirmation-action.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { DailyBitComponent } from './components/daily-bit/daily-bit.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AutorizacionInterceptor } from './interceptors/autorizacion.interceptor';
import { AutorizarClienteGuard } from './guards/autorizar-cliente.guard';
import { AutorizarLogeadoGuard } from './guards/autorizar-logueado.guard';
import { ReminderDetailsComponent } from './components/reminder/reminder-details/reminder-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    AddEditFlowComponent,
    ListFlowsComponent,
    ConfirmationDeleteComponent,
    AddEditGoalComponent,
    ListGoalsComponent,
    HeaderComponent,
    AddEditReminderComponent,
    ListRemindersComponent,
    ProfileComponent,
    ClientDetailsComponent,
    ConfigurationComponent,
    PaymentMethodsComponent,
    ConfirmationActionComponent,
    SubscriptionComponent,
    DailyBitComponent,
    ReminderDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    FullCalendarModule,
    MaterialModule
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS, useClass: AutorizacionInterceptor, multi:true
    },
    AutorizarClienteGuard,
    AutorizarLogeadoGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
