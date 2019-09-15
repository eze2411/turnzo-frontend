import { Component, OnInit } from '@angular/core';
import { HelloWorldService } from 'src/app/services/hello-world.service';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.scss']
})
export class HelloWorldComponent implements OnInit {
  message: string;

  constructor(private helloWorldService:HelloWorldService) { }

  ngOnInit() {
    this.helloWorldService.getHelloWorld().subscribe(data=>this.message = data.message);
  }

}
