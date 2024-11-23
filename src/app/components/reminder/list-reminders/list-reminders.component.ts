import { Component } from '@angular/core';
import { Reminder } from '../../../models/reminder';
import { ReminderService } from '../../../services/reminder.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditReminderComponent } from '../add-edit-reminder/add-edit-reminder.component';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ReminderDetailsComponent } from '../reminder-details/reminder-details.component';

@Component({
  selector: 'app-list-reminders',
  templateUrl: './list-reminders.component.html',
  styleUrl: './list-reminders.component.css'
})
export class ListRemindersComponent {
  dsReminders!: Reminder [];
  calendarOptions: any;
  selectedDate: any = null;
  constructor(private reminderService: ReminderService, private dialog: MatDialog){}

  ngOnInit() {
    this.cargarRecordatorios();
  }

  cargarRecordatorios() {
    this.reminderService.getRemindersClientId().subscribe({
      next: (data: Reminder[]) => {
        this.dsReminders = data;
        this.cargarCalendario();
      }
    });
  }

  cargarCalendario() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locale: 'es',
      events: this.ReminderToEvent(this.dsReminders),
      eventClick: (info:any) => this.verDetalle(info),
    };
  }

  ReminderToEvent(reminders: Reminder[]) {
    return reminders.map(reminder => ({
      title: reminder.title,
      date: reminder.expirationDate,
      color: this.getExpirationStatus(reminder.expirationDate),
      extendedProps: {
        id: reminder.id,
        description: reminder.details,
        amount: reminder.amount
      }
    }));
  }

  getExpirationStatus(expirationDate: string): string {
    const today = new Date();
    const expiration = new Date(expirationDate);
    
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return 'red';
    } else if (diffDays < 30) {
        return 'orange';
    } else {
        return 'green';
    }
  }

  AbrirAddEditReminder(reminderId?: number){
    const dialogRef = this.dialog.open(AddEditReminderComponent, {
      width: '500px',
      height:'760px',
      disableClose: true,
      data: { id: reminderId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarRecordatorios();
      }
    });
  }

  verDetalle(eventInfo: any) {
    const event = eventInfo.event;
    const reminderId = event.extendedProps.id;
    const dialogRef =this.dialog.open(ReminderDetailsComponent, {
      width: '520px',
      height:'auto',
      disableClose: true,
      data: { id: reminderId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarRecordatorios();
        this.cargarCalendario();
      }
    });
  }
}
