// todo: Currently used syths: 

//   'synth',
//   'amSynth',
//   'duoSynth',
//   'fmSynth',
//   'metalSynth',
//   'membraneSynth',
//   'pluckSynth',=r
//   'monoSynth'

import { inject, Injectable } from '@angular/core';
import { SeqService } from './seq.service';
import { SampleService } from './sample.service';


enum SynthTypes {
  Synth = 'synth',
  AmSynth = 'amSynth',
  DuoSynth = 'duoSynth',
  FmSynth = 'fmSynth',
  MetalSynth = 'metalSynth',
  MembraneSynth = 'membraneSynth',
  PluckSynth = 'pluckSynth',
  MonoSynth = 'monoSynth',
};

const synthsNnameToTypeSrcArr = [
  {name: 'monoX', type: SynthTypes.MonoSynth},
  {name: 'monoY', type: SynthTypes.MonoSynth},  
  {name: 'monoZ', type: SynthTypes.MonoSynth},
  {name: 'monoQ', type: SynthTypes.MonoSynth},
  {name: 'regular', type: SynthTypes.Synth},
  {name: 'pluckA', type: SynthTypes.PluckSynth},
  {name: 'pluckB', type: SynthTypes.PluckSynth},
  {name: 'pluckC', type: SynthTypes.PluckSynth},
  {name: 'pluckD', type: SynthTypes.PluckSynth},
  {name: 'drum1', type: SynthTypes.MembraneSynth},
  {name: 'hihat1', type: SynthTypes.MetalSynth},
  {name: 'drum2', type: SynthTypes.MembraneSynth},
  {name: 'hihat2', type: SynthTypes.MetalSynth},
  {name: 'drum3', type: SynthTypes.MembraneSynth},
  {name: 'hihat3', type: SynthTypes.MetalSynth},
  {name: 'drum4', type: SynthTypes.MembraneSynth},
  {name: 'hihat4', type: SynthTypes.MetalSynth},
];


const interConnectionsVariationsArr = ['a', 'b', 'c'];

const defaultRythms = {
  'R0': '----------------',
  'R1': 'X---------------',
  'R2': '---X-----X------',
  'R3': '-X---X---X---X--',
  'R4': '-X---X-X-X---X--',
  'R5': 'X-X-X-X-X-X-X-X-',
  'R6': '-X-X-X-X-X-X-X-X',
  'R7': '1+2n3n',
  'R8': '0,1+2n',
  'R9': 'R(XX--)',
  'R10': 'R(--X-X-X)',
  'R11': 'R(-XXX)',
  'R12': 'R(XX-X-X-X-)',
};

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public seqService = inject(SeqService);
  public sampleService = inject(SampleService);
  public synthsNnameToTypeSrcArr = synthsNnameToTypeSrcArr;
  
  //todo: rename to more semantic
  getConfig() {
    const interConnections = interConnectionsVariationsArr.reduce((sum, current)=>{
      return {
        ...sum,
        [current]: {
          synths: {
            ...synthsNnameToTypeSrcArr.reduce((internalSum, {name})=>{
              return {
                ...internalSum,
                [name]: [],
              };
            }, {})
          },
          samples: {
            ...Object.keys(this.sampleService.getSampleUrls()).reduce((internalSum, internalCurrent)=>{
              return {
                ...internalSum,
                [internalCurrent]: [],
              };
            }, {})
          },
        }
      };
    }, {});

    return {
      currentInterConnection: null,
      interConnections: interConnections,
      samples: this.getSamples(),
      synths: this.getSynths(),
    };
  }

  getSynths() {
                                                //synthName
    return synthsNnameToTypeSrcArr.reduce((sum, { name, type }) => {

      let additionalOptions;

      if(type==='monoSynth') {
        additionalOptions = {
            detune  : 0 ,
            filter  : {
              Q  : 6 ,
              type  : 'lowpass',
              rolloff  : -24
            }  ,
            filterEnvelope  : {
              attack  : 0.06,
              decay  : 0.2,
              sustain  : 0.5,
              release  : 2,
              baseFrequency  : 200 ,
              octaves  : 7 ,
              exponent  : 2
            }
          };
      }

      return {
        ...sum,
        [name] : {
          name,
          type,
          // muted by default
          seqs: [],
          variants: {
            'a': {
              effect: 'E1',
              rythm: 'R1',
              sound: 'S1',
            },
            'b': {
              effect: 'E1',
              rythm: 'R2',
              sound: 'S1',
            },
            'c': {
              effect: 'E1',
              rythm: 'R3',
              sound: 'S1',
            },
          },
          config:{
            volume: 0,
            effects: {
              'E1': {
                feedbackDelay: {
                  delayTime: 0,
                  feedback: 0.1,
                  wet: 0.1,
                },
                reverb: {
                  decay: 0,
                },
                distortion: {
                  distortion: '0',
                },
                freeverb: {
                  roomSize : 0.7 ,
                  dampening : 3000
                },
              },
            },
            rythms: defaultRythms,
            sounds: {
              'S1': {
                'X': {
                  fr: '+[30, 60]',
                  duration: '16n',
                  oscillator: {
                    partials: [],
                    spread: 20,
                    count: 3,
                  },
                  envelope : {
                    "attack": 0.001,
                    "decay": 3,
                    "sustain": 0,
                    "release": 1
                  },
                  ...additionalOptions
                },
              },
              'S2': {
                'X': {
                  fr: '+[85, 95, 115]',
                  duration: '16n',
                  oscillator: {
                    partials: [],
                    spread: 20,
                    count: 3,
                  },
                  envelope : {
                    "attack": 0.001,
                    "decay": 3,
                    "sustain": 0,
                    "release": 1
                  },
                },
              },
              'S3': {
                'X': {
                  fr: '+[110, 120, 130, 140, 130, 120, 110]',
                  duration: '16n',
                  oscillator: {
                    partials: [],
                    spread: 20,
                    count: 3,
                  },
                  envelope : {
                    "attack": 0.001,
                    "decay": 3,
                    "sustain": 0,
                    "release": 1
                  },
                },
              },
            },
          }
        }
      };
    }, {});
  }

  getSamples() {
    return Object.entries(this.sampleService.getSampleUrls()).reduce((sum, [key, value])=>{
      return {
       [key]: {
        url: value,
        name: key,
        seqs: [],
        variants: {
          'a': {
            effect: 'E1',
            rythm: 'R1',
            sound: 'S1',
          },
          'b': {
            effect: 'E1',
            rythm: 'R2',
            sound: 'S1',
          },
          'c': {
            effect: 'E1',
            rythm: 'R3',
            sound: 'S1',
          },
        },
        config: {
          volume: 0,
          effects: {
            'E1': {
              // feedbackDelay: {
              //   delayTime: 0,
              //   feedback: 0.1,
              //   wet: 0.1,
              // },
              reverb: {
                decay: 0,
              },
              // distortion: {
              //   distortion: '0',
              // },
              // freeverb: {
              //   roomSize : 0.7 ,
              //   dampening : 3000
              // },
            },
          },
          rythms: defaultRythms,
          sounds: {
            'S1': {
              'X': {
                duration: '+[1, 1, 1]',    //'16n'
                skip: '+[0, 0, 0]',              //1
              },
            },
            'S2': {
              'X': {
                duration: '+[1, 1, 1]',
                skip: '+[0, 0, 0]',
              },
            },
            'S3': {
              'X': {
                duration: '+[1, 1, 1]',
                skip: '+[0, 0, 0]',
              },
            },
          },
        },
       }, 
        ...sum,
      };
    }, {});
  }
}