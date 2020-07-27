const assert = require('assert');
const firebase = require("@firebase/testing");
var expect = require('chai').expect;
// const Converter = require('../angularSTEP/src/app/converter')
// const User = require('../angularSTEP/src/app/user')
// import {Converter} from '../angularSTEP/src/app/converter.ts';
// import {User} from '../angularSTEP/src/app/user.ts';

const MY_PROJECT_ID = "boq-devex-step-2020";


describe("Rules Auth", () => {
    
    it("Understands addition", () => {
        assert.equal(2+1,3);
    });
    
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

    describe("Read & write rules for users with auth", () => {
        let db;

        beforeEach(function(){
            myAuth = {uid: 'odog-123456789', email: 'odog@gmail.com'};
            db = firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: myAuth}).firestore();
            db.settings({
                host: "localhost:8000",
                ssl: false
            });
        })

        it("Can't write items w/ just auth", async () => {
            const ref = db.collection("users");
            await firebase.assertFails(ref.add({username: 'olly'}));
        })
    })

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

        it("Won't make username with capitol letters", async () => {
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
    })

})