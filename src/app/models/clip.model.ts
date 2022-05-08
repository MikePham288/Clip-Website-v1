import firebase from 'firebase/compat/app';
export default interface Clip {
  uid: string;
  displayName: string;
  clipTitle: string;
  fileName: string;
  url: string;
  timeStamp: firebase.firestore.FieldValue;
}
