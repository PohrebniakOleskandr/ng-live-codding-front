import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import * as Tone from 'tone';

import { InstrumentsBuilderService } from './services/instruments-builder.service';
import { SeqService } from './services/seq.service';
import { ConfigService } from './services/config.service';
import { LoopService } from './services/loop.service';
import { FormsModule } from '@angular/forms';

declare global {
  interface Window {
    source: any;
  }
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CodemirrorModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  codeMirrorOptions = {
    value: '{\n  "key": "value"\n}',
    mode: "application/json",
    theme: "material",
    lineNumbers: true,
    lineWrapping: true,
    indentUnit: 2,
    tabSize: 2,
    indentWithTabs: false,
    autoCloseBrackets: true,
    matchBrackets: true,
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    placeholder: "Start typing JSON…",
    autofocus: true,
    readOnly: false
    //viewportMargin: Infinity,
  };

  public content: string = '';
  //@ViewChild('currentTrackCode') currentTrackCode: any;

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

    this.content = JSON.stringify(this.loopService.getSource(), null, 2);
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


  // here will be tmp migrators logic
  normalizeCodeWithAddingVolume(text: string) {
    eval(`window.source = ${text};`);

    const configObj = window.source;
    
    const interConnections = Object.entries(configObj.interConnections).reduce(
      (accumulator, [key, val]) => ({
        ...accumulator,
        [key]: {
          samples: 
          Object.entries((val as any)?.samples || [])?.reduce(
            (acc2: any, [key2, val2]: any) => ({
              ...acc2,
              [key2]: {
                volume: 0,
                val: val2 as any,
              }
            }),
            {},
          ),
          synths: 
          Object.entries((val as any)?.synths || [])?.reduce(
            (acc2: any, [key2, val2]: any) => ({
              ...acc2,
              [key2]: {
                volume: 0,
                val: val2 as any,
              }
            }),
            {},
          ),
        },
      }),
      {},
    );

    const updatedConfig = {
      ...configObj,
      interConnections,
    };

    this.content = JSON.stringify(updatedConfig, null, 2);
  }

  #interconnectionIterration = 0;

  updateTxtWithNewFragment(text: string) {
    //deep copy 
    const prevSrc = structuredClone(window.source);
    const incomingSrc = JSON.parse(text);

    const interConnectionsArr = Object.keys(incomingSrc.interConnections);
    const interConnectionsArrLength = interConnectionsArr.length;
    const lastInterconnectionKey = interConnectionsArr[interConnectionsArrLength-1];
    const newInterconnectionKey  = `${lastInterconnectionKey}${this.#interconnectionIterration}`;

    //TODO: parse iterration from last interconnection name
    this.#interconnectionIterration++;

    const newSrc = {
      ...prevSrc,
      interConnections: {
        ...prevSrc.interconnections,
        [newInterconnectionKey]: incomingSrc.interConnections[lastInterconnectionKey],
      },
    };

    eval(`window.source = ${newSrc};`);

    this.content = JSON.stringify(newSrc, null, 2);
  }

}

//backlog late march 2025:
// 1. free app-component from all the trash, make it more specified <-
// 2. return back sample usage
// 3. prepare data flows and signal store structure 
// 4. make speed as a variable in config
// 5. add new synths