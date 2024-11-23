import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ListFlowsComponent } from './components/money-flow/list-flows/list-flows.component';
import { ListGoalsComponent } from './components/goal/list-goals/list-goals.component';
import { AddEditGoalComponent } from './components/goal/add-edit-goal/add-edit-goal.component';
import { ListRemindersComponent } from './components/reminder/list-reminders/list-reminders.component';
import { AddEditReminderComponent } from './components/reminder/add-edit-reminder/add-edit-reminder.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { DailyBitComponent } from './components/daily-bit/daily-bit.component';
import { AutorizarLogeadoGuard } from './guards/autorizar-logueado.guard';
import { AutorizarClienteGuard } from './guards/autorizar-cliente.guard';

const routes: Routes = [
  {path:"", component: LoginComponent},
  {path:"login", component: LoginComponent},
  {path:"sign-up", component: SignUpComponent},
  {path:"list-flows", component: ListFlowsComponent, canActivate:[AutorizarLogeadoGuard, AutorizarClienteGuard]},
  {path:"list-goals", component: ListGoalsComponent, canActivate:[AutorizarLogeadoGuard, AutorizarClienteGuard]},
  {path:"add-edit-goal", component: AddEditGoalComponent, canActivate:[AutorizarLogeadoGuard, AutorizarClienteGuard]},
  {path:"list-reminders", component: ListRemindersComponent, canActivate:[AutorizarLogeadoGuard, AutorizarClienteGuard]},
  {path:"add-edit-reminder", component: AddEditReminderComponent, canActivate:[AutorizarLogeadoGuard, AutorizarClienteGuard]},
  {path:"profile", component: ProfileComponent, canActivate:[AutorizarLogeadoGuard, AutorizarClienteGuard]},
  {path:"subscription", component:SubscriptionComponent, canActivate:[AutorizarLogeadoGuard, AutorizarClienteGuard]},
  {path:"daily-bit", component:DailyBitComponent, canActivate:[AutorizarLogeadoGuard, AutorizarClienteGuard]},
  {path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
