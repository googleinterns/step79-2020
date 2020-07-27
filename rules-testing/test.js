const assert = require('assert');
const firebase = require("@firebase/testing");
var expect = require('chai').expect;

const MY_PROJECT_ID = "boq-devex-step-2020";

describe("My Recipe app", () => {
    
    it("Understands addition", () => {
        assert.equal(2+1,3);
    })
    
    it("Can read items", async () => {
        const db = firebase.initializeTestApp({projectId: MY_PROJECT_ID}).firestore();
        db.settings({
            host: "localhost:8000",
            ssl: false
        });
        const ref = db.collection("users").doc('brownies');
        await firebase.assertSucceeds(ref.get());
    })
})