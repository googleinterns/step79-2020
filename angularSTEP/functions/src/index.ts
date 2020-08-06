// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
import algoliasearch from 'algoliasearch'

admin.initializeApp();
const env = functions.config();

const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const userIndex = client.initIndex("user_search");
const recipeIndex = client.initIndex("recipe_search");

exports.indexUser = functions.firestore.document('users/{userId}').onCreate((snap, context) => {
    const user = snap.data();
    user.objectID = context.params.userId;
    return userIndex.saveObject(user);
});

exports.updateUser = functions.firestore.document('users/{userId}').onUpdate((snap, context) => {
    const user = snap.after.data();
    const object = Object.assign({ objectID: context.params.userId }, user);
    return userIndex.partialUpdateObject(object);
});

exports.unindexUser = functions.firestore
    .document('users/{userId}')
    .onDelete((snap, context) => {
    const objectId = snap.id;
    return userIndex.deleteObject(objectId);
});

exports.indexRecipe = functions.firestore.document('recipes/{recipeId}').onCreate((snap, context) => {
    const recipe = snap.data();
    recipe.objectID = context.params.recipeId;
    return recipeIndex.saveObject(recipe);
});

exports.updateRecipe = functions.firestore.document('recipes/{recipeId}').onUpdate((snap, context) => {
    const recipe = snap.after.data();
    const object = Object.assign({ objectID: context.params.recipeId }, recipe);
    return recipeIndex.partialUpdateObject(object);
});

exports.unindexRecipe = functions.firestore
    .document('recipes/{recipeId}')
    .onDelete((snap, context) => {
    const objectId = snap.id;
    return recipeIndex.deleteObject(objectId);
});
