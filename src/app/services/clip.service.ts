import { Injectable } from '@angular/core';
import Clip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  switchMap,
  of,
  map,
  BehaviorSubject,
  combineLatest,
  lastValueFrom,
  Observable,
} from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService implements Resolve<Clip | null> {
  private clipCollection: AngularFirestoreCollection<Clip>;
  pageClips: Clip[] = [];
  pendingRequest = false;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipCollection = db.collection('clips');
  }

  addClip(data: Clip): Promise<DocumentReference<Clip>> {
    return this.clipCollection.add(data);
  }

  getUserClip(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap((values) => {
        const [user, sort] = values;
        if (!user) {
          return of([]);
        }
        const clipQuery = this.clipCollection.ref
          .where('uid', '==', user.uid)
          .orderBy('timeStamp', sort === '1' ? 'asc' : 'desc');
        return clipQuery.get();
      }),
      map((snapshot) => {
        return (snapshot as QuerySnapshot<Clip>).docs;
      })
    );
  }

  updateClip(id: string, title: string) {
    return this.clipCollection.doc(id).update({ clipTitle: title });
  }

  async deleteClip(clip: Clip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    );
    await screenshotRef.delete();
    await clipRef.delete();
    await this.clipCollection.doc(clip.documentId).delete();
  }

  async getClips() {
    if (this.pendingRequest) {
      return;
    }

    this.pendingRequest = true;
    let query = this.clipCollection.ref.orderBy('timeStamp', 'desc').limit(6);

    const { length } = this.pageClips;
    if (length) {
      const lastDocumentId = this.pageClips[length - 1].documentId;
      const lastDoc = await lastValueFrom(
        this.clipCollection.doc(lastDocumentId).get()
      );

      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    snapshot.forEach((document) =>
      this.pageClips.push({ ...document.data(), documentId: document.id })
    );

    this.pendingRequest = false;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.clipCollection
      .doc(route.params.id)
      .get()
      .pipe(
        map((snapshot) => {
          const data = snapshot.data();
          if (!data) {
            this.router.navigate(['/']);
            return null;
          }
          return data;
        })
      );
  }
}
