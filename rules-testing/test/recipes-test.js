const assert = require('assert');
const firebase = require("@firebase/testing");
// var expect = require('chai').expect;

const MY_PROJECT_ID = "boq-devex-step-2020";

const currentUser = {
  uid: "user_erica",
};

const otherUser = {
  uid: "user_not_erica",
};

const myAuth = {uid: currentUser.uid};

let validRecipe = {
  recipeName: "Vanilla Cake",
  uploaderUid: currentUser.uid,
  difficulty: "Beginner",
  description: "This is a cake. I really want to eat it.",
  ingredients: ["cake", "frosting", "sprinkles"],
  tools: ["fork", "knife"],
  images: ["default image"],
  instructions: ["eat cake"],
  extraInfo: "",
  timestamp: 2,
  ratings: [],
  tags: ["dessert"],
};

const invalidRecipe = {
  recipeName: "Unicorn Cake",
};

const invalidDataRecipe = {
  recipeName: 4,
  uploaderUid: currentUser.uid,
  difficulty: "Beginner",
  description: "This is a cake. I really want to eat it.",
  ingredients: ["cake", "frosting", "sprinkles"],
  tools: ["fork", "knife"],
  images: ["default image"],
  instructions: ["eat cake"],
  extraInfo: "",
  timestamp: 2,
  ratings: [],
  tags: ["dessert"],  
};

const noIngredientsRecipe = {
  recipeName: "Galaxy Cake",
  uploaderUid: currentUser.uid,
  difficulty: "Beginner",
  description: "This is a cake. I really want to eat it.",
  ingredients: [],
  tools: ["fork", "knife"],
  images: ["default image"],
  instructions: ["eat cake"],
  extraInfo: "",
  timestamp: 2,
  ratings: [],
  tags: ["dessert"],  
};

const otherUserRecipe = {
  recipeName: "Vanilla Cake",
  uploaderUid: otherUser.uid,
  difficulty: "Beginner",
  description: "This is a cake. I really want to eat it.",
  ingredients: ["cake", "frosting", "sprinkles"],
  tools: ["fork", "knife"],
  images: ["default image"],
  instructions: ["eat cake"],
  extraInfo: "",
  timestamp: 2,
  ratings: [],
  tags: ["dessert"],
};

const admin = getAdminFirestore();
admin.settings({
  host: "localhost:8000",
  ssl: false,
});


function getFirestore(auth) {
  return firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore();
}

function getAdminFirestore() {
  return firebase.initializeAdminApp({projectId: MY_PROJECT_ID}).firestore();
}

describe("Recipe Rules", () => {

  it("Understands basic addition", () => {
    assert.equal(2+2, 4);
  });

  describe("No auth read & write rules", () => {
    let db;
  
    beforeEach(function() {
      db = getFirestore(null);
      db.settings({
        host: "localhost:8000",
        ssl: false,
      });
    });
  
    it("Can read items in recipes", async() => {
      const ref = db.collection("recipes").doc("anyRecipeId");
      await firebase.assertSucceeds(ref.get());
    });

    it("Can't write to items in recipes", async() => {
      const ref = db.collection("recipes").doc("anyRecipeId");
      await firebase.assertFails(ref.set({aNewField: "Nothing here"}));
    });

    it("Can query all recipes", async() => {
      const ref = db.collection("recipes");
      await firebase.assertSucceeds(ref.get());
    });

    it("Can't add Recipe to recipes", async() => {
      const ref = db.collection("recipes");
      await firebase.assertFails(ref.add(validRecipe));
    });
    
    it("Can't delete a Recipe", async() => {
      const ref = db.collection("recipes").doc("anyRecipeId");
      await firebase.assertFails(ref.delete());
    });

    it("Can't update a Recipe's ratings", async() => {
      admin.collection("recipes").doc("initialRecipe").set(validRecipe);

      const ref = db.collection("recipes").doc("initialRecipe");
      await firebase.assertFails(ref.update({ratings: [1, 1, 1, 1]}));
    });

    it("Can't update a Recipe's field, not ratings", async() => {
      admin.collection("recipes").doc("initialRecipe").set(validRecipe);

      const ref = db.collection("recipes").doc("initialRecipe");
      await firebase.assertFails(ref.update({recipeName: "brownies"}));
    });    
  });



  describe("Auth read and write rules", () => {
    let db;
    let admin;

    beforeEach(function(){
      db = getFirestore(myAuth);
      db.settings({
        host: "localhost:8000",
        ssl: false,
      });
      admin = getAdminFirestore();
      admin.settings({
        host: "localhost:8000",
        ssl: false,
      });
    });

    it("Can't create a Recipe if missing Recipe fields", async() => {
      const ref = db.collection("recipes");
      await firebase.assertFails(ref.add(invalidRecipe));
    });

    it("Can't create a Recipe if invalid data type in field", async() => {
      const ref = db.collection("recipes");
      await firebase.assertFails(ref.add(invalidDataRecipe))
    });

    it("Can't create a Recipe if length 0 ingredients", async() => {
      const ref = db.collection("recipes");
      await firebase.assertFails(ref.add(noIngredientsRecipe))
    });

    it("Can create a valid Recipe", async() => {
      const ref = db.collection("recipes");
      await firebase.assertSucceeds(ref.add(validRecipe));
    });

    it("Can't create a Recipe with an uploaderUid that is not yours", async() => {
      const ref = db.collection("recipes");
      await firebase.assertFails(ref.add(otherUserRecipe));
    });

    it("Can't write to items in recipes", async() => {
      const ref = db.collection("recipes").doc("anyReicpeId");
      await firebase.assertFails(ref.set({aNewField: "Nothing here"}));
    });

    it("Can't delete a recipe", async() => {
      const ref = db.collection("recipes").doc("anyRecipeId");
      await firebase.assertFails(ref.delete());
    });

    it("Can update another user's recipe's ratings", async() => {
      const ref = admin.collection("recipes").doc("otherRecipeId")
      ref.set(otherUserRecipe);

      await firebase.assertSucceeds(ref.update({ratings: [4]}));
    });

    it("Can update your recipe's ratings", async() => {
      const ref = admin.collection("recipes").doc("yourRecipeId");
      ref.set(validRecipe);

      await firebase.assertSucceeds(ref.update({ratings: [4, 2]}));
    });

    it("Can't edit any field that is not ratings for another user's recipe", async() => {
      const ref = db.collection("recipes").doc("otherRecipeId");
      await firebase.assertFails(ref.update({recipeName: "Chocolate Cake"}));
    });

    it("Can't edit any field that is not ratings for your recipe", async() => {
      const ref = db.collection("recipes").doc("yourRecipeId");
      await firebase.assertFails(ref.update({recipeName: "Chocolate Cake"}));
    });

    it("Can read items in recipes", async() => {
      const ref = db.collection("recipes").doc("anyRecipeId");
      await firebase.assertSucceeds(ref.get());
    });
  });
});
