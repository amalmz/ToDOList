import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.page.html',
  styleUrls: ['./todolist.page.scss'],
})
export class TodolistPage implements OnInit {

  currentDate: string;
  myTask1 : string;
  addTask1: boolean;
  tasksyear = [];
  constructor(public afDB: AngularFireDatabase,public alertController: AlertController) { 
    const date = new Date();
    const options = { year: 'numeric'};
    this.currentDate = date.toLocaleDateString('en-EN', options);
    this.getTasks();
  }

  ngOnInit() {
  }
 
  addTaskToFirebase() {
    this.afDB.list('Tasks1/').push({     //puch to add an element 
      text: this.myTask1,
      date: new Date().toISOString(),
      checked: false 
    });
    this.showForm();
  }

  showForm() {
    this.addTask1 = !this.addTask1;
    this.myTask1 = '';
  }

  getTasks() {
    this.afDB.list('Tasks1/').snapshotChanges(['child_added', 'child_removed']).subscribe(actions => {
      this.tasksyear = [];
      actions.forEach(action => {
        this.tasksyear.push({
          key: action.key,
          text: action.payload.exportVal().text,
          hour: action.payload.exportVal().date.substring(11, 16),
          checked: action.payload.exportVal().checked
        });
      });
    });
  }
  changeCheckState(ev: any) {
    console.log('checked: ' + ev.checked);
    this.afDB.object('Tasks1/' + ev.key + '/checked/').set(ev.checked);
  }
  deleteTask(task: any) {
    this.afDB.list('Tasks1/').remove(task.key);
  }
  deleteAll() {
    this.afDB.list('Tasks1/').remove() ;
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to delete all the list',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.deleteAll();
          
          }
        }
      ]
    });
    await alert.present();

  }
}



