import firebase from 'firebase/compat/app';
export default interface Clip {
  uid: string;
  displayName: string;
  clipTitle: string;
  fileName: string;
  clipUrl: string;
  screenshotURL: string;
  timeStamp: firebase.firestore.FieldValue;
  documentId?: string;
}
