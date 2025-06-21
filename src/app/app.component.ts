import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import * as Tone from 'tone';
import { InstrumentsBuilderService } from './services/instruments-builder.service';
import { SeqService } from './services/seq.service';
import { ConfigService } from './services/config.service';
import { LoopService } from './services/loop.service';

declare global {
  interface Window {
    source: any;
  }
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('currentTrackCode') currentTrackCode: any;

  public loopService = inject(LoopService);
  public seqService = inject(SeqService);
  public instrumentsBuilderService = inject(InstrumentsBuilderService);
  public configService = inject(ConfigService);
  //source: any = this.configService.getConfig();

  isConsented = false;
  isRecorderStarted = false;

  consent() {
    Tone.start();

    this.loopService.consent();
    this.isConsented = true;

    this.currentTrackCode.nativeElement.value = JSON.stringify(this.loopService.getSource(), null, 2);
  }

  play() {
    this.loopService.play();
  }

  toggleRecording() {
    if(!this.isRecorderStarted) {
      this.instrumentsBuilderService.startRecording();
    } else {
      this.instrumentsBuilderService.stopRecording();
    }
    this.isRecorderStarted = !this.isRecorderStarted;
  }

  // textField -> window.config -> this.config
  textToCode(text: string) {
    const prevSourceCurrentInterConnection = this.loopService.getSource().currentInterConnection;
    eval(`window.source = ${text};`);
    // here is a room for modefication of config
    const actualSourceCurrentInterConnection = window.source.currentInterConnection;

    //this.source = this.seqService.populateAllSeq(window.source);
    
    this.loopService.setSource(this.seqService.populateAllSeq(window.source));
    this.loopService.reInitIterrators();
  }
}

//backlog late march 2025:
// 1. free app-component from all the trash, make it more specified <-
// 2. return back sample usage
// 3. prepare data flows and signal store structure 
// 4. make speed as a variable in config
// 5. add new synths