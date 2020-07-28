import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {User} from '../user';
import {Converter} from '../converter';
import {toBase64String} from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  user!: User;
  secondTestMap: Map<string, [number, string, string, number]> = new Map();

  constructor(
    private db: AngularFirestore,
    private fAuth: AngularFireAuth,
  ) {
    this.fAuth.currentUser.then(user => {
      if (user) {
        // console.log(user.uid);
        this.setUserData(user.uid);
        // console.log(user);
      }
    });
    // this.secondTestMap = 
    // let secondTestTuple: [number, string, string, number] = this.secondTestMap.get(item);
    // console.log(this.user.shoppingList);
  }

  ngOnInit(): void {
  }
  // OK SO ITS BACKUP PLAN TIME youre gonna have to remove this from the routing module but since nothings loading on the profile and that might be bc of olivers server validation or some dummy thing you did then youre goonnna have to try routing ot it like its a serpeate page

  // ok so this is more or less what needs to happen here
  // 1. get the data of the current user
  // 2. display the shopping list of the current user
  // 3. Layout idea: 
  //   two halves to the tab (ingredients and tools)
  //   header for each always present 
  //   if no items say somehting like "there are no ingredients/tools on your shopping list"
  //   then just like more centered lists like the recipe page
  // 4. also a remove button for each item (so again like the recipe page)

  async setUserData(uid: string) {
    const postUser = await this.db.doc('/users/' + uid + '/')
      .ref.withConverter(new Converter().userConverter).get();
    if (postUser.data()) {
      this.user = postUser.data()!;
      console.log(this.user);
      console.log(this.xah_obj_to_map(this.user.shoppingList));
      this.secondTestMap = this.xah_obj_to_map(this.user.shoppingList);
    } 
  }

  xah_obj_to_map(obj: any): Map<string, [number, string, string, number]> {
    const mp = new Map;
    Object.keys ( obj ). forEach (k => { mp.set(k, obj[k]) });
    return mp;
  }

  check() {
    console.log(this.user);
  }

}


