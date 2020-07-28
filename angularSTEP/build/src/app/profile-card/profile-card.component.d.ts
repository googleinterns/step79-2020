import { OnInit } from '@angular/core';
interface UserData {
    displayName: string;
    username: string;
    picUrl: string;
}
export declare class ProfileCardComponent implements OnInit {
    user: UserData;
    username: string;
    displayName: string;
    picUrl: string;
    constructor();
    ngOnInit(): void;
}
export {};
