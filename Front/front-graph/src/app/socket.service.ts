import { Injectable } from '@angular/core';
import{io} from 'socket.io-client'

@Injectable({
  providedIn: 'root'
})
export class SocketService {
socket:any;
readonly url='http://localhost:3000'
  constructor() {
    this.socket=io(this.url)
   }
}
