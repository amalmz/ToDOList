import { Component, OnInit } from '@angular/core';
import {FormGroup ,FormBuilder,Validators} from "@angular/forms"
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  groupform :FormGroup ;
  isSubmitted ;
  
    constructor(public formBuilder :FormBuilder) {}
  
    ngOnInit() {
    this.initForm();
    }
    initForm(){
       this.groupform = this.formBuilder.group ({
           name:['',[Validators.required , Validators.minLength(2)]],
           last:['',[Validators.required , Validators.minLength(2)]],
           user:['',[Validators.required ,Validators.pattern('[a-z0-9._%+-]+$')]],
           password:['',[Validators.required ,Validators.pattern('[a-z0-9._%+-]+$')]],
       });
    }
    get errorControl(){
      return this.groupform.controls ;
    }
    onSubmitForm(){
      this.isSubmitted=true ;
      if (!this.groupform.valid){
        console.log('Please provide all the required values ');
        return false ;
      }else {
        console.log(this.groupform.value)
      }
    }
  
  

}
