import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Group} from "../models/group";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {
  }

  baseUrl = 'https://630cf6ef53a833c534397519.mockapi.io/group';

  getGroup() {
    return this.http.get<Group[]>(this.baseUrl);
  }
}
