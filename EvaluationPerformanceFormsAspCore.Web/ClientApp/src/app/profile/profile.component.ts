import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { IUser } from '../interfaces/user';
import { AuthService } from '../services/auth.service';
import { error } from 'util';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
/** sign-up component*/
export class ProfileComponent implements OnInit{
    /** sign-up ctor */
  profile: any;
  user: IUser;
  passThis: string;


  constructor(private ProfileService: ProfileService, public auth: AuthService) {

  }

  ngOnInit(): void {
    this.loadProfileDetails();
  }

  errorMessage: string;
  profileForm = new FormGroup({
    level: new FormControl(''),
    name: new FormControl(''),
    title: new FormControl(''),
    sap: new FormControl(''),
    division: new FormControl(''),
    email: new FormControl(''),
  });
  
  onSubmit() {
    // Copy the form values over the basic object values
    let p = Object.assign({}, this.user, this.profileForm.value);

    this.ProfileService.signUpUser(p).subscribe(
      () => this.onSaveComplete(),
      (error: any) => this.errorMessage = <any>error
    );
  }

  loadProfileDetails() {
      this.auth.getProfile((err, profile) => {
        this.profile = profile;
        console.log("THIS IS MY PROFILE" + this.profile);
        this.passThis = this.profile.email;
        console.log("THIS IS MY PARAMETER" + this.passThis);
        this.getSavedProfile(this.passThis);
      });
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    console.log("PROFILE DETAILS SAVED");
  }

  getSavedProfile(passThis: string) {
    this.ProfileService.getUserDetails(passThis)
      .subscribe(
      (profileData: IUser) => this.onRetrieved(profileData),
      (error: any) => this.errorMessage = <any>error);
  }

  onRetrieved(prof: IUser) {
    this.user = prof;
    console.log(prof);
    this.profileForm.patchValue({
      level: this.user.level,
      name: this.user.name,
      title: this.user.title,
      sap: this.user.sap,
      division: this.user.division,
      email: this.profile.email,
    });
  }
}
