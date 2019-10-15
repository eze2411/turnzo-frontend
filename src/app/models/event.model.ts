// src/app/shared/models/event.model.ts

import { UserModel } from "./user.model";

export class EventModel {
    id: number;
    title: string;
    type: string;
    date: any;
    start: any;
    end: any;
    patient: UserModel[];
}