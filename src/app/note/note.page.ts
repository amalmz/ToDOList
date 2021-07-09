import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-note',
  templateUrl: './note.page.html',
  styleUrls: ['./note.page.scss'],
})
export class NotePage implements OnInit {
  title: string = "";
  desc: string = "";
  notes = [];
  note : string="";
  addnote:boolean;


  constructor( private db: AngularFireDatabase, private afAuth: AngularFireAuth,public alertController: AlertController) {
    this. getNotes();
   }

  ngOnInit() {
  }

  addNoteToFirebase() {
    this.db.list('Notes/').push({     //puch to add an element 
      title: this.title,
      desc:this.desc,
    });

  }
  getNotes() {
   return this.db.list('Notes/').snapshotChanges().subscribe(actions => {
    this.notes = [];
    actions.forEach(action => {
      this.notes.push({
        key: action.key,
        title: action.payload.exportVal().title,
        desc: action.payload.exportVal().desc ,
       
      });
    });
  });
  }

 
  deletenote(note: any) {
    this.db.list('Notes/').remove(note.key);
  }
  deleteAll() {
    this.db.list('Notes/').remove() ;
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
