// src/app/shared/models/event.model.ts

import { User } from "./User.model";

export class EventModel {
    id: number;
    title: string;
    type: string;
    date: any;
    start: any;
    end: any;
    patient: User[];
}
