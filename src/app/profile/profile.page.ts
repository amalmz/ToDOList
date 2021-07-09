import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  currentDate: string;
  myTask : string;
  addTask: boolean;
  tasks = [];
  constructor(public afDB: AngularFireDatabase,public alertController: AlertController) { 
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    this.currentDate = date.toLocaleDateString('en-EN', options);
    this.getTasks();
  }

  ngOnInit() {
  }
 
  addTaskToFirebase() {
    this.afDB.list('Tasks/').push({     //puch to add an element to firebase
      text: this.myTask,
      date: new Date().toISOString(),
      checked: false 
    });
    this.showForm();
  }

  showForm() {
    this.addTask = !this.addTask;
    this.myTask = '';
  }

  getTasks() {
    this.afDB.list('Tasks/').snapshotChanges(['child_added', 'child_removed']).subscribe(actions => {
      this.tasks = [];
      actions.forEach(action => {
        this.tasks.push({
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
    this.afDB.object('Tasks/' + ev.key + '/checked/').set(ev.checked);
  }
  deleteTask(task: any) {
    this.afDB.list('Tasks/').remove(task.key);
  }
  deleteAll() {
    this.afDB.list('Tasks/').remove() ;
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
