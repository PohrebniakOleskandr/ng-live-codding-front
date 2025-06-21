import { inject, Injectable } from '@angular/core';
import { SeqService } from './seq.service';
import { STNDR_CNFG_MOCK } from '../mocks/standart-config.mock';

const EMBEDDED_SYNTHS_NAMES = [
  'synth',
  'amSynth',
  'duoSynth',
  'fmSynth',
  'metalSynth',
  'membraneSynth',
  'pluckSynth',
];

const STANDART_SOUND_TYPES = [
  'X',
  'Y',
  'Z'
];

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public seqService = inject(SeqService);

  getConfig() {
    return STNDR_CNFG_MOCK;
  }

  generateSampleSoundSet(soundTypes: string[]) {
    return soundTypes.reduce((acc, key) => ({
      ...acc,
      [key]: {
        volume: 1,
        duration: 0.25,
        skip: 0,
        effects: {
          feedbackDelay: {
            delayTime: 0,
            feedback: 0.1,
            wet: 0.1,
          },
          reverb: {
            decay: 0,
          },
          distortion: {
            distortion: 0,
          },
          frequencyShifter: {
            fr: 0,
          },
          freeverb: {
            roomSize : 0.7,
            dampening : 3000
          },
        },
      },
    }),
    {});
  }

  generateSynthSoundSet(soundTypes: string[]) {
    return soundTypes.reduce((acc, key) => ({
      ...acc,
      [key]: {
        fr: '+[90, 90, 90]',
        volume: 1,
        duration: '64n',
        oscillator: {
          // sine triangle sawtooth square
          type: 'sine',
          partials: [],
        },
        effects: {
          feedbackDelay: {
            delayTime: 0,
            feedback: 0.1,
            wet: 0.1,
          },
          reverb: {
            decay: 0,
          },
          distortion: {
            distortion: 0,
          },
          freeverb: {
            roomSize : 0.7 ,
            dampening : 3000
          },
        },
        envelope: {
                attack: 0.001,
                attackCurve: 'linear',
                decay: 1.4,
                decayCurve: "exponential",
                release: 0.2,
                releaseCurve: "exponential",
                sustain: 0.5,
        },
      },
    }),
    {});
  }

  //TODO generate grids
  generateConfig(
    interval: string,
    gridsNumber: number,
    sampleUrlMap: {[key: string]: string},
  ) {
    const samples = Object.keys(sampleUrlMap).reduce((acc, key) => ({
      ...acc,
      [key]: {
        ...this.generateSampleSoundSet(STANDART_SOUND_TYPES),
      },
    }), {});

    const synths = EMBEDDED_SYNTHS_NAMES.reduce((acc, key) => ({
      ...acc,
      [key]: {
        ...this.generateSynthSoundSet(STANDART_SOUND_TYPES),
      },
    }), {});

    const synthsGrid = EMBEDDED_SYNTHS_NAMES.reduce((acc, key) => {
      const currentKey =/*  (key === 'membraneSynth' || key === 'metalSynth')  ?
        this.seqService.getRandomSeq(['X'])
          :*/this.seqService.getDefaultSeq();
      return {
      ...acc,
      [key]: currentKey,
    }}, {});

    const samplesGrid = Object.keys(sampleUrlMap).reduce((acc, key) => {
      const currentKey = /*(key === 'kick' || key ==='hihat') ?*/
      /*this.seqService.getRandomSeq(['X'])
        :*/ this.seqService.getDefaultSeq();
      return {
        ...acc,
        [key]: currentKey,
      }
    }, {});

    return {
      interval,
      samplesUrls: sampleUrlMap,
      samples,
      synths,
      decs: ['a', 'b', 'c'],
      grid: {
        a :
        {
          synths: [ ...Array(gridsNumber).keys() ].map(i => ({...synthsGrid})),
          samples: [ ...Array(gridsNumber).keys() ].map(i => ({...samplesGrid})),
        },

        b :
        {
          synths: [ ...Array(gridsNumber).keys() ].map(i => ({...synthsGrid})),
          samples: [ ...Array(gridsNumber).keys() ].map(i => ({...samplesGrid})),
        },

        c :
        {
          synths: [ ...Array(gridsNumber).keys() ].map(i => ({...synthsGrid})),
          samples: [ ...Array(gridsNumber).keys() ].map(i => ({...samplesGrid})),
        },

        //synths: [ ...Array(gridsNumber).keys() ].map(i => ({...synthsGrid})),
        //samples: [ ...Array(gridsNumber).keys() ].map(i => ({...samplesGrid})),
      },
    };
  }


}
