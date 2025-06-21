import { inject, Injectable } from '@angular/core';
import * as Tone from 'tone';
import { SampleService } from './sample.service';
import { ConfigService } from './config.service';

// Freeverb         [with room size]
// PitchShift
// Tremolo
// BitCrusher

// TODO: work on naming
interface NameToConstructoMap {
  [string: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class InstrumentsBuilderService {  
  public sampleService = inject(SampleService);
  
  public configService = inject(ConfigService);
  //add here a mock provider service

  recorder = new Tone.Recorder();

  stopRecording() {
   console.log('stopRecording');
   (async () => {
      const recording = await this.recorder.stop();
      const url = URL.createObjectURL(recording);
      const anchor = document.createElement("a");
      anchor.download = "recording.webm";
      anchor.href = url;
      anchor.click();
    })();
  }

  startRecording() {
    console.log('startRecording');
    this.recorder.start();
  }

  // buildPlayers(samplesUrls?: any) {

  //   const freeverb = new Tone.Freeverb(0.7, 3000).toDestination().connect(this.recorder);
  //   const reverb = new Tone.Reverb().toDestination().connect(this.recorder);
  //   const feedbackDelay = new Tone.FeedbackDelay({
  //     delayTime: 0,
  //     feedback: 0.1,
  //     wet: 0.1,
  //   }).toDestination().connect(this.recorder);
  //   const distortion = new Tone.Distortion().toDestination().connect(this.recorder);
  //   const frequencyShifter = new Tone.FrequencyShifter().toDestination().connect(this.recorder);

  //   return Object.keys(samplesUrls).reduce((acc, key) => {
  //     frequencyShifter.set({ frequency: 0 });

  //     const url  = samplesUrls[key];

  //     const instrument = new Tone.Player(url)/*.toDestination();*/

  //     //instrument.connect(freeverb);
  //     //instrument.connect(frequencyShifter);
  //     instrument.connect(feedbackDelay);
  //     instrument.connect(reverb);
  //     instrument.connect(distortion);

  //     return {
  //     ...acc,
  //     [key]: {
  //       instrument,
  //       effects: {
  //         feedbackDelay,
  //         reverb,
  //         distortion,
  //         frequencyShifter,
  //         freeverb,
  //         //autoFilter,
  //       }
  //     },
  //   }}, {});
  // }

  enrichSynthsWithEffects(
    map: NameToConstructoMap,
  ) {
    return Object.keys(map).reduce((acc, key) => {
       //const autoFilter = new Tone.Filter().toDestination();
      const freeverb = new Tone.Freeverb(0.7, 3000)//.toDestination().connect(this.recorder);
      const reverb = new Tone.Reverb().toDestination()//.connect(this.recorder);
      const feedbackDelay = new Tone.FeedbackDelay({
        delayTime: 0,
        feedback: 0.1,
        wet: 0.1,
      }).toDestination()//.connect(this.recorder);
      const distortion = new Tone.Distortion()//.toDestination().connect(this.recorder);

      const synth  = map[key];

      // commutation (could be changed)
      //synth.connect(feedbackDelay);
      //synth.connect(reverb);
      //synth.connect(distortion);
      //synth.connect(freeverb);
      //synth.connect(autoFilter);

      // synth ---> feedbackDelay ----> destination
      synth.chain(distortion, feedbackDelay, /*reverb,*/ Tone.Destination, this.recorder);

      return {
      ...acc,
      [key]: {
        instrument: map[key],
        effects: {
          feedbackDelay,
          reverb,
          distortion,
          freeverb,
          //autoFilter,
        }
      },
    }}, {});
  }

  //sum, [key, value]
  buildPlayers(samplesUrls: any) {
    return Object.entries(samplesUrls).reduce((sum, [key, value]: any) => {
      const reverb = new Tone.Reverb().toDestination();

      // warning: please connect to the output
      const player = new Tone.Player(value);
      player.chain(reverb, Tone.Destination, this.recorder);

      return {
        ...sum,
        [key]: {
          instrument: player,
          effects: {
            reverb,
          }
        },
      };
    }, {})
  }

  getInstruments() {
    // number of synths is always the same
    // const instrumentsMap = {
    //   synths: {
    //     synth: new Tone.Synth(),
    //     amSynth: new Tone.AMSynth(),              //amplitude modulation
    //     duoSynth: new Tone.DuoSynth(),
    //     fmSynth: new Tone.FMSynth(),
    //     metalSynth: new Tone.MetalSynth(),        //тарілочки
    //     membraneSynth: new Tone.MembraneSynth(),  //барабани
    //     pluckSynth: new Tone.PluckSynth(),        //струна
    //     monoSynth: new Tone.MonoSynth(),
    //   },
    // };

    const dictSynthFactories = {
      synth: () => new Tone.Synth(),
      amSynth: () => new Tone.AMSynth(),
      duoSynth: () => new Tone.DuoSynth(),
      fmSynth: () => new Tone.FMSynth(),
      metalSynth: () => new Tone.MetalSynth(),        
      membraneSynth: () => new Tone.MembraneSynth(),  
      pluckSynth: () => new Tone.PluckSynth(),        
      monoSynth: () => new Tone.MonoSynth(),
    };

    const synthMap = this.configService.synthsNnameToTypeSrcArr.reduce((acc,{name, type})=>{
      return {
        ...acc,
        [name]: dictSynthFactories[type](),
      };
    }, {});

    // here below: use normal service:
    return {
      synths: this.enrichSynthsWithEffects(synthMap),
      players: this.buildPlayers(this.sampleService.getSampleUrls()),
    };
  }
}
