import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import algoliasearch from 'algoliasearch'

admin.initializeApp();
const env = functions.config();

const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const index = client.initIndex("user_search");

exports.indexUser = functions.firestore.document('users/{userId}').onCreate((snap, context) => {
    const user = snap.data();
    user.objectID = context.params.userId;
    return index.saveObject(user);
});

exports.updateUser = functions.firestore.document('users/{userId}').onUpdate((snap, context) => {
    const user = snap.after.data();
    const object = Object.assign({ objectID: context.params.userId }, user);
    return index.partialUpdateObject(object);
});

exports.unindexUser = functions.firestore
    .document('users/{userId}')
    .onDelete((snap, context) => {
    const objectId = snap.id;
    return index.deleteObject(objectId);
});
