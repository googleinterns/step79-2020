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
})