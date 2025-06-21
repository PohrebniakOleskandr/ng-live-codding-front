import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as Tone from 'tone';
import { InstrumentsBuilderService } from './services/instruments-builder.service';
import { ValueConverterService } from './services/value-converter.service';
import { ConfigService } from './services/config.service';
import { MOCK_SAMPLE_URLS } from './mocks/urls.mock';
import { SeqService } from './services/seq.service';

// right now only synths
declare global {
  interface Window {
    config: any;
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

  public seqService = inject(SeqService);
  public instrumentsBuilderService = inject(InstrumentsBuilderService);
  public valueConverterService = inject(ValueConverterService);
  public configService = inject(ConfigService);

  config: any = this.configService.generateConfig(
    '32n',
    2,
    MOCK_SAMPLE_URLS
  );

  instruments: any;

  isConsented = false;

  loopBeat: any;

  isRecorderStarted = false;

  consent() {
    // audio context is not suspended now
    Tone.start();
    this.isConsented = true;

    this.initToneObjects();

    this.currentTrackCode.nativeElement.value = JSON.stringify(this.config, null, 2);
  }

  toggleRecording() {
    if(!this.isRecorderStarted) {
      this.instrumentsBuilderService.startRecording();
    } else {
      this.instrumentsBuilderService.stopRecording();
    }

    this.isRecorderStarted = !this.isRecorderStarted;
  }

  play() {
    this.loopBeat.start(0);
  }


  initToneObjects() {
    // all synths can be created without any additional info
    // however urls are needed for players
    this.instruments = this.instrumentsBuilderService
      .getInstruments(this.config.samplesUrls);


    // TODO: make it "global"
    let i = 0;
    let j = 0;
    let k = 0;

    this.loopBeat = new Tone.Loop((time) => {

      //this.config.decs.forEach((dec: any) => {
      const dec = this.config.decs[k];
      const synthNames = Object.keys(this.instruments.synths);

        synthNames.forEach((synthName) => {
          // TODO: add each variable for each nested property
          const encodedgridLine = this.config.grid[dec].synths[j][synthName];
          const decodedgridLine = this.seqService.decodeGridLine(encodedgridLine);

          const currentGridSymbol = decodedgridLine[i];

          if (currentGridSymbol !== '-') {

            const currentSynth = this.instruments.synths[synthName];
            currentSynth.instrument.volume.value = this.config.synths[synthName][currentGridSymbol]?.volume || 0;

            currentSynth.effects.feedbackDelay.set(this.config.synths[synthName][currentGridSymbol].effects.feedbackDelay);
            currentSynth.effects.reverb.decay = this.config.synths[synthName][currentGridSymbol].effects?.reverb?.decay || 1;
            currentSynth.effects.distortion.distortion = this.config.synths[synthName][currentGridSymbol].effects?.distortion?.distortion || 0;
            currentSynth.effects.freeverb.set(this.config.synths[synthName][currentGridSymbol].effects.freeverb);

            // Applicable to samples
            //currentSynth.effects.autoFilter.set(this.config.synths[synthName][currentGridSymbol].effects?.autoFilter || { frequency: 0 });
           //this.config.synths[synthName][currentGridSymbol].effects?.autoFilter?.fr || 0;

            //WIP

            if(currentSynth?.instrument?.envelope) {
              currentSynth.instrument.envelope.set(
                this.config.synths[synthName][currentGridSymbol]?.envelope,
              );
            }
            // currentSynth.instrument.pitchDecay = 0.2;

            if(currentSynth?.instrument?.oscillator?.type) {
              currentSynth.instrument.oscillator.type = this.config.synths[synthName][currentGridSymbol]?.oscillator?.type || 'sine';
            }

            if(currentSynth?.instrument?.oscillator?.partials) {
              currentSynth.instrument.oscillator.partials = this.config.synths[synthName][currentGridSymbol]?.oscillator?.partials;
            }

            const fr = this.valueConverterService.frStrToNumber(
              this.config.synths[synthName][currentGridSymbol].fr/*+j*/,
              i
            );
            currentSynth.instrument.triggerAttackRelease(
              fr,
              this.config.synths[synthName][currentGridSymbol].duration,
              time,
            );
          }
        });

        const sampleNames = Object.keys(this.instruments.players);

        sampleNames.forEach((sampleName) => {
          const encodedgridLine = this.config.grid[dec].samples[j][sampleName];
          const decodedgridLine = this.seqService.decodeGridLine(encodedgridLine);

          const currentGridSymbol = decodedgridLine[i];
          if (currentGridSymbol !== '-') {
            const currentPlayer = this.instruments.players[sampleName];

            // turn down a little bit
            // currentPlayer.instrument.volume.value = -5;

            currentPlayer.effects.feedbackDelay.set(this.config.samples[sampleName][currentGridSymbol].effects?.feedbackDelay);
            currentPlayer.effects.reverb.decay = this.config.samples[sampleName][currentGridSymbol].effects?.reverb?.decay || 1;
            currentPlayer.effects.distortion.distortion = this.config.samples[sampleName][currentGridSymbol].effects?.distortion?.distortion || 0;
            currentPlayer.effects.frequencyShifter.set({
              frequency:  this.config.samples[sampleName][currentGridSymbol].effects?.frequencyShifter?.fr || 0,
            });
            currentPlayer.effects.freeverb.set(this.config.samples[sampleName][currentGridSymbol].effects.freeverb);

            const skip = this.config.samples[sampleName][currentGridSymbol]?.skip || '0';

            // undefined, null, 0, "0", "[11]""

            currentPlayer.instrument.start(
              time,
              skip,
              this.config.samples[sampleName][currentGridSymbol].duration
            );
          }
        });

        i = (i + 1) % 16;    // 0..15
        if(i  === 15) {
          j = (j + 1) % this.config.grid[dec].synths.length;
          if(j === this.config.grid[dec].synths.length - 1) {
            k = (k + 1) % this.config.decs.length;
          }
        }
        this.loopBeat.interval = this.config.interval;
      //});
    }, this?.config?.interval); //4n = 120 bpm <-> '16n'


    // check out what to do it this deprecated case
    Tone.Transport.start();
  }

  // textField -> window.config -> this.config
  textToCode(text: string) {
    eval(`window.config = ${text};`);
    // here is a room for modefication of config
    this.config = window.config;
  }
}

// Backlog:

// -1. сделать везде массивы
//  0. itterators should be global
//  2. code generation (with params)
//  3. more easy-to-use grid helpers [grid Builder service]
//  4. add recorder
//  5. add more effects
//  7. add new synths with non-typical params
//  8. auto saver ("chats" butch feature)
//  9. adding players on the go
// 10. annul iterrators with a button

//Theory
// https://pdm.lsupathways.org/3_audio/0_basicsofsound/
// https://teropa.info/harmonics-explorer/


// App's schema


// effectsSettings =------.
// commutation     -------|
// sampleUrls      -------|
// grids           -------|
// soundSetinngs   -------.
//                        |___________> flow
