import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import User from '../models/user.model';
import { delay, filter, map, Observable, of, switchMap } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userCollection: AngularFirestoreCollection<User>;
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  public redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userCollection = db.collection('users');
    auth.user.subscribe(console.log);
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1000));
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => this.activatedRoute.firstChild),
        switchMap((route) => route?.data ?? of({}))
      )
      .subscribe((data) => {
        this.redirect = data.authenticatedOnly ?? false;
      });
  }

  public async createUser(userData: User) {
    if (!userData.password) {
      throw new Error('password is required');
    }
    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email,
      userData.password
    );
    if (!userCred.user) {
      throw new Error('User cannot be found');
    }
    console.log('user cred: ', userCred);
    await this.userCollection.doc(userCred.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber,
    });

    await userCred.user.updateProfile({ displayName: userData.name });
  }
  public logout = async (event?: Event) => {
    if (event) {
      event.preventDefault();
    }
    await this.auth.signOut();
    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  };
}
