// Copyright 2020 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const assert = require('assert');
const firebase = require("@firebase/testing");
var expect = require('chai').expect;

const MY_PROJECT_ID = "boq-devex-step-2020";


describe("Rules Auth", () => {
    
    it("Understands addition", () => {
        assert.equal(2+1,3);
    });

// -----------------------------------------------
    
    describe("Basic read & write rules", () => {
        let db;

        beforeEach(function(){
            db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
            db.settings({
                host: "localhost:8000",
                ssl: false
            });
        })

        it("Can get item from users", async () => {
            const ref = db.collection("users").doc('brownies');
            await firebase.assertSucceeds(ref.get());
        })

        it("Can query all items from users", async () => {
            const ref = db.collection("users");
            await firebase.assertSucceeds(ref.get());
        })
    
        it("Can't write items to users", async () => {
            const ref = db.collection("users");
            await firebase.assertFails(ref.add({}));
        })

        it("Can read item from usernames", async () => {
            const ref = db.collection("usernames").doc('brownies');
            await firebase.assertSucceeds(ref.get());
        })

        it("Can't query all items from usernames", async () => {
            const ref = db.collection("usernames");
            await firebase.assertFails(ref.get());
        })
    
        it("Can't write items to usernames w/o auth", async () => {
            const ref = db.collection("users");
            await firebase.assertFails(ref.add({}));
        })
    })

// -----------------------------------------------

    describe("Read & write rules for users with auth", () => {
        let db;
        let myAuth;
        let admin;

        let data = {username: "oliver",
                    uid: "",
                    displayName: "Oliver Lance",
                    email: "olly.lance15@gmail.com",
                    picUrl: "",
                    following: [],
                    time: 1,
                    recipes: "",
                    wishlist: "",
                    shoppingList: {}}

        async function setUpDatabase(myAuth){
            if(myAuth) {
                db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuth}).firestore();
            } else {
                db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
            }
            db.settings({
                host: "localhost:8000",
                ssl: false
            });
        }

        //sets up database
        before(async function(){
            admin = firebase.initializeAdminApp({projectId: MY_PROJECT_ID}).firestore();
            admin.settings({
                host: "localhost:8000",
                ssl: false
            });
            await admin.collection("usernames")
                        .doc("test")
                        .set({username: "test", uid: "oliver5"})
        })

        it("Can make a user with specific fields", async () => {
            data.uid = "oliver1";
            myAuth = {uid: data.uid};
            setUpDatabase(myAuth);
            const ref = db.collection("users");
            await firebase.assertSucceeds(ref.doc(myAuth.uid)
                .set(data));
        })

        it("Can't make user without auth", async () => {
            data.uid = "oliver2";
            setUpDatabase(null);
            const ref = db.collection("users");
            await firebase.assertFails(ref.doc(myAuth.uid)
                .set(data));
        })

        it("Can't make user with different input uid", async () => {
            data.uid = "oliver3";
            myAuth = {uid: data.uid};
            setUpDatabase(myAuth);
            data.uid = "oliver4";
            const ref = db.collection("users");
            await firebase.assertFails(ref.doc(myAuth.uid)
                .set(data));
        })

        it("Can't make user if username is taken", async () => {
            data.uid = "oliver5";
            data.username = "test";
            myAuth = {uid: data.uid};
            setUpDatabase(myAuth);
            const ref = db.collection("users");
            await firebase.assertFails(ref.doc(myAuth.uid)
                .set(data));
        })

        it("Can't make user if username has capital letters", async () => {
            data.uid = "oliver6";
            data.username = "ODOG";
            myAuth = {uid: data.uid};
            setUpDatabase(myAuth);
            const ref = db.collection("users");
            await firebase.assertFails(ref.doc(myAuth.uid)
                .set(data));
        })

        it("Can't update user if username changes", async () => {
            data.uid = "oliver1";
            myAuth = {uid: data.uid};
            setUpDatabase(myAuth);
            const ref = db.collection("users");
            await firebase.assertFails(ref.doc(myAuth.uid)
                .update({username: "bob"}));
        })

        it("Can't update user if timestamp changes", async () => {
            data.uid = "oliver1";
            myAuth = {uid: data.uid};
            setUpDatabase(myAuth);
            const ref = db.collection("users");
            await firebase.assertFails(ref.doc(myAuth.uid)
                .update({time: 34}));
        })

        it("Can update user", async () => {
            data.uid = "oliver1";
            myAuth = {uid: data.uid};
            setUpDatabase(myAuth);
            const ref = db.collection("users");
            await firebase.assertSucceeds(ref.doc(myAuth.uid)
                .update({displayName: "Bobby",
                        picUrl: "test.png",
                        wishlist: ["hello"],
                        following: ["julia"]}));
        })

        it("Can't delete user without auth", async () => {
            data.uid = "oliver1";
            setUpDatabase(null);
            const ref = db.collection("users");
            await firebase.assertFails(ref.doc(myAuth.uid)
                .delete());
        })

        it("Can delete user with auth", async () => {
            data.uid = "oliver1";
            myAuth = {uid: data.uid};
            setUpDatabase(myAuth);
            const ref = db.collection("users");
            await firebase.assertSucceeds(ref.doc(myAuth.uid)
                .delete());
        })
    })

// -----------------------------------------------

    describe("Read & write rules for usernames with auth", () => {
        let db;
        let myAuth;
        let admin;

        async function setUpDatabase(myAuth){
            if(myAuth) {
                db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuth}).firestore();
            } else {
                db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
            }
            db.settings({
                host: "localhost:8000",
                ssl: false
            });
        }

        //sets up database
        before(async function(){
            admin = firebase.initializeAdminApp({projectId: MY_PROJECT_ID}).firestore();
            admin.settings({
                host: "localhost:8000",
                ssl: false
            });
            users = [{username: 'olly', uid: 'odog1'},
                    {username: 'olance', uid: 'odog2'},
                    {username: 'ol', uid: 'odog3'},
                    {username: 'olsdafdsfdsafdsfsdafdsafdsafdsfasfdsa', uid: 'odog4'},
                    {username: 'AAAAAA', uid: 'odog5'},
                    {username: 'ofrog', uid: 'odog6'}];
            for (let i = 0; i < users.length; i++){
                await admin.collection("users")
                .doc(users[i].uid)
                .set({username: users[i].username, uid: users[i].uid})
            }
            usernames = [{username: 'olly', uid: 'odog1'}];
            for(let i = 0; i < usernames.length; i++){
                await admin.collection("usernames")
                .doc(usernames[i].username)
                .set({username: usernames[i].username, uid: usernames[i].uid})
            }
        })

        it("Can't make username that is already used", async () => {
            myAuth = {uid: 'odog1'};
            setUpDatabase(myAuth);
            const ref = db.collection("usernames");
            await firebase.assertFails(ref.doc('olly')
                .set({username: 'olly', uid: myAuth.uid}));
        })

        it("Can't make username where uid does not exist in users", async () => {
            myAuth = {uid: 'odog7'};
            setUpDatabase(myAuth);
            const ref = db.collection("usernames");
            await firebase.assertFails(ref.doc('olance')
                .set({username: 'olance', uid: myAuth.uid}));
        })

        it("Can make username that isn't already used", async () => {
            myAuth = {uid: 'odog2'};
            setUpDatabase(myAuth);
            const ref = db.collection("usernames");
            await firebase.assertSucceeds(ref.doc('olance')
                .set({username: 'olance', uid: myAuth.uid}));
        })

        //adds this to an actual user (even though that wouldn't be the case)
        //to make sure it wouldn't add a username with too few characters
        it("Won't make username with too few characters", async () => {
            myAuth = {uid: 'odog3'};
            setUpDatabase(myAuth);
            const ref = db.collection("usernames");
            await firebase.assertFails(ref.doc('ol')
                .set({username: 'ol', uid: myAuth.uid}));
        })

        it("Won't make username with too many characters", async () => {
            myAuth = {uid: 'odog4'};
            setUpDatabase(myAuth);
            const ref = db.collection("usernames");
            await firebase.assertFails(ref.doc('olsdafdsfdsafdsfsdafdsafdsafdsfasfdsa')
                .set({username: 'olsdafdsfdsafdsfsdafdsafdsafdsfasfdsa', uid: myAuth.uid}));
        })

        it("Won't make username with capital letters", async () => {
            myAuth = {uid: 'odog5'};
            setUpDatabase(myAuth);
            const ref = db.collection("usernames");
            await firebase.assertFails(ref.doc('AAAAAA')
                .set({username: 'AAAAAA', uid: myAuth.uid}));
        })

        it("Can't make username without auth", async () => {
            setUpDatabase(null);
            const ref = db.collection("usernames");
            await firebase.assertFails(ref.doc('ofrog')
                .set({username: 'ofrog', uid: 'odog6'}));
        })

        it("Can't delete username without auth", async () => {
            myAuth = {uid: 'odog1'};
            setUpDatabase(null);
            const ref = db.collection("usernames");
            await firebase.assertFails(ref.doc('olly')
                .delete());
        })

        it("Can delete username with auth", async () => {
            myAuth = {uid: 'odog1'};
            setUpDatabase(myAuth);
            const ref = db.collection("usernames");
            await firebase.assertSucceeds(ref.doc('olly')
                .delete());
        })
    })
})