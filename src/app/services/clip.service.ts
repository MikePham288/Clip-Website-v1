import { Injectable } from '@angular/core';
import Clip from '../models/clip.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  private clipCollection: AngularFirestoreCollection<Clip>;

  constructor(private db: AngularFirestore) {
    this.clipCollection = db.collection('clip');
  }

  addClip(data: Clip): Promise<DocumentReference<Clip>> {
    return this.clipCollection.add(data);
  }
}
